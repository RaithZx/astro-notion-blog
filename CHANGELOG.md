# Changelog

All notable changes to Ligadu are documented here, in plain language.

## [Unreleased] — Ligadu Launch (Mar 2025 – Aug 2026)

Everything below covers the full journey from the original open-source template to Ligadu as it stands today — 91 commits, one continuous release.

### ✨ New Features

- **Ligadu branding**: New logo, favicon, title, and description across the whole site.
- **Dark mode**: Full dark theme with a persistent toggle.
- **Reader accounts (Clerk)**: Sign in to unlock full articles, replacing the old newsletter-only signup. Includes legal consent copy in Kriolu.
- **Content gate**: Free preview of every article, then a sign-in prompt to keep reading.
- **Site search**: Fast full-text search (Cmd+K) with highlighted matches, ranked results, and an idle/empty state.
- **Tag pages & pagination**: Browse posts by tag, with "load more" instead of hard page breaks.
- **Featured & Top posts**: Curated sections on the homepage, plus related-articles and latest-articles blocks on every post.
- **Newsletter subscription**: Inline banner and modal, later folded into Clerk sign-up.
- **Comments-free reading extras**: Estimated reading time, formatted publish dates, breadcrumbs, share buttons, back-to-top button, image lightbox with blur-up placeholders.
- **Custom 404 page**: Illustrated page with a list of recent posts instead of a dead end.
- **Ad placements**: AdSense-ready ad units, with a visible placeholder in local development.
- **"Coming Soon" mode**: Optional gate to show a holding page before public launch.
- **Kabu Verde (Kriolu) localization**: All UI copy — nav, search, forms, legal pages, error states — translated and centralized in one strings file, with native-speaker corrections applied.

### 🎨 Design

- **Newspaper-organic redesign**: Editorial typography, color palette, and layout overhaul across the whole site.
- **Tailwind + shadcn/ui adoption**: Replaced ad-hoc CSS with a consistent design system (buttons, cards, theming variables).
- **Mobile navigation rework**: New drawer menu, fixed stacking/z-index bugs, smoother transitions.
- **Responsive fixes**: Eliminated horizontal overflow on mobile for code blocks, tables, and embeds (Instagram, TikTok).
- **Image pipeline**: Notion-hosted images now download and optimize at build time (via Astro's asset pipeline), preventing layout shift and broken images.

### 🔧 Improvements

- **Faster, smarter search**: Debounced input, case-insensitive full-text matching.
- **Secure link sharing**: Share/RSS links now rebuild correctly against the current origin, including on localhost.
- **CSRF protection**: Newsletter and form submissions now carry CSRF tokens.
- **Copy protection**: Prevents bulk content copying while still allowing text selection in forms.
- **Analytics**: Umami tracking wired in over HTTPS, plus a full tracking plan for article views, scroll depth, and newsletter engagement.

### 🐛 Fixes

- Fixed images not displaying in production.
- Fixed template literal syntax bug from upstream (`[slug].astro`).
- Fixed dead navigation links and search friction on the homepage.
- Fixed percent-encoded tag URLs (now clean, slugified).
- Fixed pagination key naming and several Kriolu copy/translation errors.
- Fixed "Más Populár" section layout.
- Fixed social-clips slug fallback when a post's Notion Slug field is empty.
- Fixed mobile search bar stacking issue.

### 🛠 Infrastructure

- **Deployment**: Migrated from static/nginx serving to a Node SSR server (Docker/Nixpacks-ready) for Coolify deployment.
- **Node version pinning**: Standardized on a supported Node engine after several nixpacks config iterations.
- **Email tooling**: Added Clerk → Resend sync script and resubscribe/notify email flow.
- **Docs**: Added `DESIGN.md` (design system), article publication guide, analytics tracking plan, and content-design research notes for the team.

---

*Generated from git history (`0.10.1..HEAD`) — review before publishing externally; internal refactor/chore commits were filtered out.*
