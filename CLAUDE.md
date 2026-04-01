# CLAUDE.md — astro-notion-blog

## Project Overview

Static blog built with **Astro 5** using **Notion** as a headless CMS. Content is fetched from a Notion database at build time via the official `@notionhq/client` SDK. The site is a fork/customization of [otoyo/astro-notion-blog](https://github.com/otoyo/astro-notion-blog) with custom branding ("Ligadu"), locale-specific pages, and additional features (newsletter, search, Coming Soon gate).

## Tech Stack

- **Framework:** Astro 5 (static site generation)
- **UI:** Astro components + React 19 islands (`@astrojs/react`) for interactive pieces
- **Styling:** Tailwind CSS 3 + shadcn/ui pattern (CSS variables, `class-variance-authority`, Radix Slot, `tailwind-merge`)
- **Content:** Notion API (`@notionhq/client`) — all posts resolved at build time
- **Icons:** `astro-icon` + `@iconify-json/octicon`, `lucide-react`
- **Code:** Prism.js syntax highlighting, KaTeX math, Mermaid diagrams
- **RSS:** `@astrojs/rss`
- **Images:** `sharp`, `exif-be-gone`, Astro asset pipeline
- **Caching:** Nx for build caching; `tmp/*.json` for Notion block data
- **Embeds:** metascraper for link previews; dedicated components for Twitter/X, TikTok, Instagram, Pinterest, CodePen, YouTube, Amazon

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 4321) |
| `npm run build` | Production static build |
| `npm run build:cached` | Fetch Notion cache then build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (TS + Astro) |
| `npm run format` | Prettier format all files |
| `npm run cache:fetch` | Populate `tmp/` with Notion block JSON |
| `npm run cache:purge` | Clear Nx + tmp caches |

## Project Structure

```
src/
├── server-constants.ts          # All env vars and config constants
├── layouts/Layout.astro         # Single global layout (SEO, nav, analytics, newsletter, search)
├── pages/
│   ├── index.astro              # Home: featured + top + latest posts
│   ├── posts/[slug].astro       # Single post (getStaticPaths from Notion)
│   ├── posts/page/[page].astro  # Paginated post list
│   ├── posts/tag/[tag].astro    # Tag filter (first page)
│   ├── posts/tag/[tag]/page/[page].astro
│   ├── feed.ts                  # RSS endpoint
│   ├── search-index.json.ts     # Full-text search index (JSON)
│   └── *.astro                  # Static info pages (kontaktu, privasidadi, termus)
├── components/
│   ├── notion-blocks/           # One component per Notion block type
│   │   └── annotations/        # Rich text annotation renderers
│   ├── ui/                      # React shadcn-style components (button, card, aurora)
│   ├── PostBody.astro           # Wraps NotionBlocks
│   ├── NotionBlocks.astro       # Block dispatcher (normalizes lists, prefetches embeds)
│   ├── SearchModal.astro        # Client-side search UI
│   └── ...                      # PostDate, PostTags, Pagination, ShareButtons, etc.
├── lib/
│   ├── notion/client.ts         # Notion SDK wrapper, caching, data normalization
│   ├── notion/responses.ts      # Raw Notion API response types
│   ├── notion/request-params.ts # Typed request shapes
│   ├── notion/text-helpers.ts   # Text extraction for search index
│   ├── interfaces.ts            # Domain types (Post, Block, Database, RichText, etc.)
│   ├── blog-helpers.ts          # Routing, URL builders, embed detectors, date formatting
│   ├── image-helpers.ts         # Build-time image glob + Notion URL → ImageMetadata mapping
│   ├── style-helpers.ts         # snakeToKebab for Notion color tokens
│   └── utils.ts                 # cn() (clsx + tailwind-merge), pathJoin()
├── integrations/                # Astro build hooks to download Notion-hosted images
├── styles/
│   ├── globals.css              # Tailwind base + shadcn CSS variables
│   ├── syntax-coloring.css      # Code syntax theme
│   ├── notion-color.css         # Notion color mapping
│   └── blog.module.css          # Blog listing styles
└── images/                      # Static SVG assets
scripts/
├── blog-contents-cache.cjs      # Notion DB query + block fetch → tmp/
├── retrieve-block-children.cjs  # Nx-cached block fetcher
└── testNotionClient.js          # Manual Notion connectivity test
```

## Environment Variables

Required in `.env` (no committed `.env.example` — only `.env.newsletter.example` exists):

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_SECRET` | Yes | Notion integration token |
| `DATABASE_ID` | Yes | Notion database ID for the blog |
| `CUSTOM_DOMAIN` | No | Custom hostname for canonical URLs (e.g. `ligadu.com`) |
| `BASE_PATH` | No | Subpath when not at domain root (e.g. `/docs/`) |
| `PUBLIC_GA_TRACKING_ID` | No | Google Analytics tracking ID |
| `REQUEST_TIMEOUT_MS` | No | HTTP timeout in ms (default: `10000`) |
| `ENABLE_LIGHTBOX` | No | Enable image lightbox feature |
| `COMING_SOON` | No | Set `'true'` to show Coming Soon page instead of full site |
| `NEWSLETTER_API_URL` | No | Base URL for newsletter subscribe API |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk publishable key (reader sign-in) |
| `CLERK_SECRET_KEY` | No | Clerk secret (required when using `output: 'server'` + middleware) |

Site and Clerk UI copy for translation handoff lives in [`src/locales/ui-strings.json`](src/locales/ui-strings.json). [`src/lib/clerk-localization.mjs`](src/lib/clerk-localization.mjs) deep-merges the `clerk` section onto `ptPT` from `@clerk/localizations` and is passed to `clerk({ localization })` in [`astro.config.mjs`](astro.config.mjs). Layout shell, newsletter, search, home page, and related components read from the `app` section of the same JSON. Default Clerk appearance (no custom `appearance` object). Hosted Account Portal wording is configured in the Clerk Dashboard separately.

Optional platform env for canonical `site` URL in `astro.config.mjs` (if unset, use `CUSTOM_DOMAIN`): `VERCEL`, `VERCEL_URL`, `CF_PAGES`, `CF_PAGES_URL`, `CF_PAGES_BRANCH`.

## Architecture & Key Patterns

### Notion as CMS
- All posts fetched at build time from a single Notion database
- Required database properties: `Page` (title), `Date`, `Published` (checkbox), `Slug` (rich text), `Tags` (multi_select), `AdminTags` (multi_select: `featured`, `top`), `Excerpt`, `FeaturedImage` (files), `Rank` (number)
- In-memory caches (`postsCache`, `dbCache`) avoid repeated API calls within a single build
- `async-retry` on API calls; 4xx errors bail without retry
- Slug auto-generated from title if `Slug` property is empty (lowercased, NFD-normalized, diacritics stripped, hyphenated)

### Dual Type Layer
- **Domain types** in `src/lib/interfaces.ts`: PascalCase (`Post`, `Block`, `RichText`) — used throughout components
- **Wire types** in `src/lib/notion/responses.ts`: mirror raw Notion API shapes — used only in `client.ts` for mapping

### Block Rendering Pipeline
- `NotionBlocks.astro` normalizes consecutive list/todo items into synthetic `List` wrappers
- Dispatches to individual `notion-blocks/*.astro` components by `block.Type`
- Rich text annotations rendered by `annotations/*.astro` sub-components

### Image Pipeline
- Build integrations (`src/integrations/`) download Notion-hosted files to `src/assets/notion/`
- `image-helpers.ts` uses `import.meta.glob` to map URLs to `ImageMetadata` for Astro `<Image />`
- Dev mode can use remote Notion URLs directly (`import.meta.env.DEV` branches)

### Search
- `/search-index.json` endpoint extracts full block text via `text-helpers.ts` at build time
- Client-side search in `SearchModal.astro`

### Caching Strategy
- `npm run cache:fetch` populates `tmp/*.json` with Notion block trees
- `client.ts` checks `tmp/${blockId}.json` before hitting the API
- Nx caches the `_fetch-notion-blocks` target

## Coding Conventions

### Formatting (Prettier)
- Single quotes everywhere
- **No semicolons** in `.ts` and `.astro` files
- Trailing commas: `es5`

### Linting (ESLint)
- `@typescript-eslint/no-unused-vars`: error
- `@typescript-eslint/no-explicit-any`: error
- Astro files use `astro-eslint-parser`
- Run via: `ESLINT_USE_FLAT_CONFIG=false eslint --ext .js,.ts,.astro src`

### TypeScript
- Strict mode (extends `astro/tsconfigs/strict`)
- Path alias: `@/*` → `./src/*`
- Domain models use PascalCase properties matching the app's conventions, not Notion's snake_case

### Component Patterns
- Data fetching in Astro frontmatter with `await`
- Dynamic routes use `getStaticPaths()` with params from Notion data
- React used only as islands where interactivity is needed (shadcn components)
- Layout receives `title`, `description`, `path`, `ogImage` props; uses named slots (`featured`, `main`, `aside`)

### Styling
- Tailwind utility classes on elements
- shadcn-style CSS variables for theming (`--background`, `--primary`, etc.)
- Dark mode via Tailwind `class` strategy
- CSS modules for blog listing pages (`blog.module.css`)
- Global styles in `Layout.astro` `<style is:global>` block

### Routing Helpers
- All internal links go through `getNavLink`, `getPostLink`, `getTagLink`, `getPageLink` from `blog-helpers.ts`
- These prepend `BASE_PATH` automatically via `pathJoin()`

## Adding a New Notion Block Type

1. Add type definition to `src/lib/interfaces.ts`
2. Handle mapping in `src/lib/notion/client.ts` (`_buildBlock`)
3. Create `src/components/notion-blocks/YourBlock.astro`
4. Add the case in `src/components/NotionBlocks.astro` switch

## Deployment

- **Primary:** **Coolify** (Docker / Nixpacks) running the **Node** server from `@astrojs/node` (`output: 'server'`, `adapter: node({ mode: 'standalone' })`). After `npm run build`, start the app from the adapter’s server entry (see [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/)). Set `NODE_VERSION=20.18.1+`, `CUSTOM_DOMAIN`, Notion secrets, Clerk keys, and `NEWSLETTER_API_URL` in the Coolify service.
- **Also supported:** Vercel, Cloudflare Pages, or any Node host — `getSite()` can use `VERCEL_*` / `CF_PAGES_*` when those env vars exist.
- **CI/CD:** GitHub Actions and/or Coolify deploy webhooks (e.g. `DEPLOY_HOOK_URL` secret) as you configure.

## Testing

No automated test suite. Quality checks:
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `scripts/testNotionClient.js` — manual Notion connectivity probe
