# Implementation Plan — PRD 0001 (SEO Remediation)

Sequenced so each step is independently shippable/testable. File paths are relative to repo root.

## Step 1 — Sitemap + robots.txt

**Files:** `astro.config.mjs`, new `public/robots.txt`, `package.json`

1. `npm install @astrojs/sitemap`
2. In `astro.config.mjs`, add the integration with `customPages` populated via a top-level-await call to `getAllPosts()` (`src/lib/notion/client.ts`) + `getPostLink()` (`src/lib/blog-helpers.ts`), building full URLs against the existing `getSite()` result.
3. Include: homepage, all post URLs, 5 tag URLs (`getTagLink()` for Notísias, Saúdi, Siênsia, Stórias, Tekinolojia — **excluding** Natureza and Stória di Mundu per Decision 6), `kontaktu`, `privasidadi`, `termus`.
4. Exclude paginated routes — don't add `/posts/page/*` or `/posts/tag/*/page/*` to `customPages`, and confirm the integration's auto-discovery (from prerendered routes) doesn't pull them in either.
5. Failure mode: if `getAllPosts()` throws or returns empty during config evaluation, log a build warning and fall back to `customPages: []` rather than failing the whole build (per PRD risk section).
6. Create `public/robots.txt`:
   ```
   User-agent: *
   Allow: /

   Sitemap: https://ligadu.com/sitemap-index.xml
   ```
   (confirm exact sitemap filename `@astrojs/sitemap` produces once installed — adjust if it differs)

**Test:** `npm run build`, verify `dist/client/sitemap-index.xml` (or wherever output lands) contains exactly the expected URL set; `curl localhost:4321/robots.txt` returns the file.

## Step 2 — `/404` fix + error page `noindex`

**Files:** `src/pages/404.astro`

1. Reproduce: `curl -I https://ligadu.com/404` (or local equivalent) — find why direct navigation 500s while the automatic not-found fallback works.
2. Fix so direct requests return `200` with the 404 UI and correct `404` semantics are still communicated to crawlers via `<meta name="robots" content="noindex">` (add this meta tag to the error page, currently missing).

**Test:** `curl -I` both the literal `/404` path and a genuinely nonexistent path (e.g. `/this-does-not-exist`) — both should render the same UI without a 500, and both should carry `noindex`.

## Step 3 — `CUSTOM_DOMAIN` build guard

**Files:** `astro.config.mjs`

1. In `getSite()`, before falling through to the `localhost:4321` return, add a check: if none of `CUSTOM_DOMAIN`/`VERCEL_URL`/`CF_PAGES_URL` are set **and** `process.env.NODE_ENV === 'production'` (or equivalent production-build signal — confirm which env var Astro sets reliably at config-evaluation time, since `import.meta.env.PROD` may not be populated this early in the config file), throw a clear error naming the missing env var.
2. Confirm `npm run dev` and a local `npm run build` without prod env vars still behave as today (don't throw) — if `npm run build` is used locally without prod vars as a normal workflow, this guard needs an explicit escape hatch (e.g. only guard when a `COOLIFY`/deploy-specific env var is present, or add an explicit `ALLOW_LOCALHOST_SITE_URL` opt-out). Confirm actual local workflow before finalizing which signal to gate on.

**Test:** unset `CUSTOM_DOMAIN` locally, run a prod-mode build, confirm it fails loudly with a clear message; confirm `npm run dev` is unaffected.

## Step 4 — Structured data: Organization + WebSite + Breadcrumb

**Files:** `src/layouts/Layout.astro`, `src/pages/posts/[slug].astro`, `src/components/Breadcrumbs.astro`

1. In `Layout.astro`, build an `Organization` JSON-LD object: `name: "Ligadu"`, `url: Astro.site`, `logo`, `sameAs: ["https://linkedin.com/company/ligadu", "https://www.instagram.com/ligadu.cv/"]`.
2. Build a `WebSite` JSON-LD object: `name: "Ligadu"`, `url: Astro.site`.
3. Merge these into the existing `structuredData` prop array alongside any page-specific schema passed in (Layout already accepts `structuredData?: Record<string, unknown>[]` from the earlier ContentGate fix — extend rather than replace).
4. In `[slug].astro`, extend the existing `articleSchema` object: set `author` and `publisher` both to `{ '@type': 'Organization', name: 'Ligadu' }` (publisher already does this from the earlier fix — add `author` to match).
5. Add a `BreadcrumbList` JSON-LD object using `post.Tags[0]?.name` as the middle crumb (Home → Tag → Post), falling back gracefully if a post somehow has zero tags (Home → Post only).
6. Import and render `Breadcrumbs.astro` in the post page UI (above the article header) — check its existing prop interface first since it's currently unused and may need adjustment to accept the post + primary tag.

**Test:** validate JSON-LD on a sample post with Google's Rich Results Test (or schema.org validator) after building; confirm breadcrumbs render visually and match the JSON-LD trail.

## Step 5 — On-page fixes

**Files:** `src/layouts/Layout.astro`

1. Replace `og:site_name` value (`database.Title`) with a hardcoded `"Ligadu"` constant (define once near the top of the frontmatter, don't inline the string twice).
2. Delete `navTopicInnovation` and `navTopicSpace` (unused vars, `Layout.astro:31-32`) — confirm no other file references them first (`grep -rn "navTopicInnovation\|navTopicSpace" src/`).

**Test:** `npm run lint` — the two pre-existing unused-var errors on those lines should disappear.

## Step 6 — Security headers

**Files:** `src/middleware.ts`

1. Chain a new header-setting middleware with the existing `clerkMiddleware()` via Astro's `sequence()`.
2. Enforcing headers (ship immediately): `Strict-Transport-Security`, `X-Frame-Options: SAMEORIGIN` (or `DENY` if no legitimate reason to be framed — confirm nothing embeds Ligadu pages in an iframe elsewhere), `Referrer-Policy: strict-origin-when-cross-origin`.
3. `Content-Security-Policy-Report-Only` header, built from the actual origin inventory found in the codebase: Clerk (`*.clerk.accounts.dev`, `img.clerk.com`, and whatever Clerk's docs specify for `connect-src`/`frame-src`), `fonts.googleapis.com`/`fonts.gstatic.com`, `cdn.jsdelivr.net` (KaTeX), `pagead2.googlesyndication.com` + related AdSense domains, `www.googletagmanager.com`, `stats.ligadu.com` (Umami), and `frame-src`/`img-src` entries for the embed platforms (YouTube, Twitter/X, TikTok, Instagram, Pinterest, CodePen) found via the earlier grep. Set a `report-uri`/`report-to` endpoint if one exists, or omit and rely on browser devtools console during manual testing if not.
4. **Do not** add an enforcing `Content-Security-Policy` header yet — Report-Only only, per Decision 5.

**Test:** manually exercise the site with devtools open — sign in/out via Clerk, view a post with embeds, confirm ads render, check the CSP violation report console for anything unexpected. This step needs a human pass, not just an automated check.

## Step 7 — RSS fixes

**Files:** `src/pages/feed.ts`, `src/layouts/Layout.astro`

1. Set the correct `Content-Type` response header in `feed.ts` (`application/rss+xml; charset=utf-8` is the conventional choice).
2. Add `<link rel="alternate" type="application/rss+xml" title="Ligadu" href={...}>` in `Layout.astro`'s `<head>`, pointing at `/feed`.

**Test:** `curl -I localhost:4321/feed` shows the corrected content-type; view page source on any page and confirm the autodiscovery link is present.

## Step 8 — Misc cleanup

**Files:** `src/layouts/Layout.astro`, `src/components/SocialIcons.astro`

1. Add `rel="nofollow noopener noreferrer"` to both Buy Me a Coffee links in `Layout.astro` (currently `noopener noreferrer` only).
2. Update `SocialIcons.astro`'s LinkedIn `href="#"` to `https://linkedin.com/company/ligadu`, and add a new Instagram icon linking `https://www.instagram.com/ligadu.cv/` (same markup pattern as the existing LinkedIn `<a>`, new SVG icon).
3. In `[slug].astro`, detect whether the current post's `blocks` contain an `equation` block (recursively, matching the existing block-tree-walking pattern used elsewhere in the file, e.g. `countTotalWords`). Pass a boolean down to `Layout.astro` (new prop, e.g. `hasMath`) and wrap the KaTeX `<link>` in `Layout.astro` with that conditional — default `false` for every other page type.

**Test:** confirm a post with an equation block still renders math correctly; confirm a post without one no longer requests the KaTeX CSS (check network tab).

## Suggested PR breakdown

Given the file overlap, group as: **PR1** = Steps 1-3 (crawlability/indexability, all touch `astro.config.mjs`/build-time concerns) · **PR2** = Step 4 (structured data, biggest single change) · **PR3** = Steps 5+7+8 (small independent on-page fixes, bundle to avoid PR overhead) · **PR4** = Step 6 (security headers — isolated so a CSP surprise doesn't block unrelated fixes, and so the later CSP-enforcing flip is its own reviewable diff).

## Not in this plan (tracked separately)
- Tag taxonomy consolidation — `ligadu.com-audit/findings/cluster.md`
- About page + tag intro copy (needs native Kriolu review before shipping) — `ligadu.com-audit/findings/content.md`
- Backlink outreach — `ligadu.com-audit/findings/backlinks.md`
- CSP flip from Report-Only to enforcing — follow-up PR after a clean monitoring window
