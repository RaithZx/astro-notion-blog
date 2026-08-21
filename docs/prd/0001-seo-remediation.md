# PRD 0001 — SEO Remediation (Engineering Scope)

**Status:** Draft
**Date:** 2026-08-20
**Source:** `ligadu.com-audit/` (FULL-AUDIT-REPORT.md, ACTION-PLAN.md, findings/*.md) — SEO Health Score 42/100 at time of audit
**Related:** [ADR 0003 — Crawler exempt from ContentGate](../adr/0003-crawler-exempt-from-content-gate.md) (already shipped, commit `db8e181`), [CONTEXT.md](../../CONTEXT.md)

## Problem

The SEO audit found ligadu.com's engineering foundation is sound (correct canonicals, clean URLs, real SSR, working image pipeline) but a handful of missing basics and one architectural gap (the ContentGate blocking crawlers, already fixed) were suppressing the score to 42/100. This PRD covers the remaining engineering-fixable items.

## Out of scope

The following audit findings require editorial judgment, new content, or manual outreach — not engineering — and are intentionally **not** planned in this PRD:

- Tag taxonomy consolidation (7 tags → fewer clusters, re-tagging live posts) — `findings/cluster.md`
- About/"Sobri-nu" page copy, tag intro copy — any new Kriolu copy needs native-speaker review before shipping, not generated as part of implementation — `findings/content.md`
- Backlink outreach (diaspora communities, Kriolu directories, etc.) — `findings/backlinks.md`

This PRD does implement the *mechanism* that supports some of that future editorial work (e.g. sitemap excludes thin tags without touching the tags themselves; author is hardcoded to "Ligadu" rather than adding an empty byline field).

## Decisions locked during grilling

| # | Decision |
|---|---|
| 1 | "Known Crawler" is a documented glossary term (CONTEXT.md), distinct from Member/Anonymous User. Formalized as ADR 0003. |
| 2 | PRD scope is engineering-only; editorial work referenced, not planned here. |
| 3 | Article `author` and `publisher` are both a hardcoded `Organization` named "Ligadu" — no per-post byline field, no Notion schema change. |
| 4 | Security headers ship via `src/middleware.ts` (already runs on every request for Clerk) — not platform-specific config — so behavior is identical across Coolify/Node, Vercel, and Cloudflare Pages. |
| 5 | CSP ships as `Content-Security-Policy-Report-Only` first; HSTS/X-Frame-Options/Referrer-Policy ship enforcing immediately. CSP flips to enforcing in a follow-up once violation reports are clean. |
| 6 | Sitemap includes: homepage, all posts, 5 of 7 tag pages (excludes Natureza, Stória di Mundu — 2 posts each, thin), static pages. Excludes all paginated routes. |
| 7 | BreadcrumbList parent category = `post.Tags[0]` (first tag in Notion's array), matching the existing single-eyebrow-label convention already used on post cards. |
| 8 | `CUSTOM_DOMAIN` fallback guard throws only during production build (`import.meta.env.PROD`), not `npm run dev` — dev's localhost fallback is legitimate and must keep working. |
| 9 | KaTeX CSS loads only on posts whose blocks actually contain an `equation` block (detectable server-side per-post), not sitewide. |
| 10 | `SocialIcons.astro`'s LinkedIn link becomes `https://linkedin.com/company/ligadu`, plus a new Instagram icon linking `https://www.instagram.com/ligadu.cv/` (canonical URL — tracking params `?igsh=...&utm_source=qr` from the shared link stripped). Both feed `sameAs` on the Organization schema. |
| 11 | `navTopicInnovation`/`navTopicSpace` in `Layout.astro` are unused dead code (never rendered, pre-existing lint errors) — deleted, not a nav redesign. |

## Requirements

### R1 — Crawlability basics
- `public/robots.txt` exists, includes a `Sitemap:` directive.
- `@astrojs/sitemap` installed with `customPages` built at config-evaluation time from `getAllPosts()` + `getPostLink()` (default config alone won't discover on-demand SSR post routes — confirmed in `findings/sitemap.md`).
- Sitemap content per Decision 6.
- Direct request to `/404` returns a proper 404 status with content, not HTTP 500.
- Error pages carry `noindex` in their robots meta.

### R2 — Canonical URL integrity
- Astro config throws at production build time if none of `CUSTOM_DOMAIN`, `VERCEL_URL`, `CF_PAGES_URL` are set — per Decision 8, build-only.

### R3 — Structured data
- `Layout.astro`'s `structuredData` prop (already added for the Article/paywall schema) is used to inject sitewide `Organization` + `WebSite` JSON-LD on every page.
- `Organization` includes `sameAs: ["https://linkedin.com/company/ligadu", "https://www.instagram.com/ligadu.cv/"]` per Decision 10.
- Post pages add `BreadcrumbList` JSON-LD (Home → `Tags[0]` → Post), using `Tags[0]` per Decision 7.
- Existing `Breadcrumbs.astro` component (currently unused — `findings/cluster.md`) is wired into the post page UI, not just the JSON-LD.
- Existing `Article` schema's `author`/`publisher` set to `Organization` "Ligadu" per Decision 3.

### R4 — On-page fixes
- `og:site_name` in `Layout.astro` reads a hardcoded "Ligadu" constant instead of `database.Title`.
- `navTopicInnovation`/`navTopicSpace` dead variables removed from `Layout.astro`.

### R5 — Security headers (`src/middleware.ts`)
- HSTS, X-Frame-Options, Referrer-Policy ship enforcing.
- CSP ships as `Content-Security-Policy-Report-Only` first (Decision 5), built from the actual third-party origin inventory (Clerk, Google Fonts, KaTeX CDN, AdSense, GA, self-hosted Umami `stats.ligadu.com`, embed iframes for YouTube/Twitter/TikTok/Instagram/Pinterest/CodePen).
- Follow-up (separate PR, after a monitoring window with zero unexpected violation reports): flip CSP to enforcing.

### R6 — RSS
- `feed.ts` sets correct `content-type` (`application/rss+xml` or `application/xml`, not `application/octet-stream`).
- `Layout.astro` adds `<link rel="alternate" type="application/rss+xml">` autodiscovery.

### R7 — Misc cleanup
- `nofollow` added to the two Buy Me a Coffee outbound links.
- KaTeX CSS `<link>` in `Layout.astro` becomes conditional per Decision 9 — only rendered when the current post's blocks contain an `equation` block.

## Non-goals
- No change to the ContentGate's behavior for real Anonymous Users (already correctly scoped by ADR 0003).
- No Notion schema changes (no new properties).
- No changes to Clerk auth flow.

## Risks
- **CSP breaking something despite Report-Only staging**: mitigated by shipping Report-Only first and manually verifying Clerk sign-in, ads, embeds, Umami before flipping to enforcing.
- **Sitemap `customPages` growing stale** if `getAllPosts()` is slow or fails at config-evaluation time (runs once per build, not per-request) — needs a sane failure mode (empty customPages + build warning) rather than failing the whole build.
- **`CUSTOM_DOMAIN` guard false-positive** on a legitimate CI/preview build with no domain vars set — scoped narrowly to `import.meta.env.PROD` to avoid breaking `npm run dev`; confirm this doesn't also break `npm run build` used for local testing without env vars (may need an explicit opt-out env var if that's a real workflow — flag if it comes up during implementation).

## Success criteria
- `findings/technical.md`'s 5 Critical + high-priority findings resolved (robots.txt, sitemap, `/404`, `CUSTOM_DOMAIN` guard, schema).
- Re-running the audit shows Technical SEO and Schema/Structured Data category scores materially improved from the 46/100 and 15/100 baseline.
- No regression in Clerk sign-in, ad rendering, or embed rendering after CSP Report-Only rollout (manual smoke test).
