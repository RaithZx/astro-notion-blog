# ADR 0001 — Remove newsletter, use Clerk as the single signup path

**Status:** Accepted  
**Date:** 2026-06-28

## Context

Ligadu launched with a separate newsletter subscription system (`/api/subscribe`, custom modal, inline banners). Separately, Clerk was added for authentication. This created two parallel signup paths with no shared state, duplicate consent flows, and a GDPR gap (inline banner submitted `privacy: true` silently without showing a checkbox).

A content gate was then added (ContentGate component) requiring Clerk accounts to read full articles. This made newsletter subscription redundant — the gate already forces the signup decision.

## Decision

Remove the newsletter system entirely:

- Delete `subscribeBanner.astro`
- Remove the newsletter modal from `Layout.astro`
- Remove `trySubscribeFromClerkUser()`, `wireClerkNewsletterHook()`, `userShouldSkipNewsletterPrompts()`, and all `/api/subscribe` fetch calls
- Remove `NEWSLETTER_API_URL` env var usage
- Convert all newsletter CTAs ("Fika Ligadu" banners, footer, mobile drawer) to `ligadu-open-sign-in` buttons that trigger `Clerk.openSignIn({})`
- The homepage band loses its email input and becomes a value-prop + button

Article notifications (emailing Members when new content is published) will be implemented separately as a Notion webhook → transactional email flow, with no frontend changes required.

## Alternatives considered

**Keep newsletter as low-friction entry point, Clerk as optional upgrade.** Rejected — the ContentGate already forces the Clerk decision on every article. The newsletter becomes a second parallel identity system with no benefit.

**Replace newsletter modal with a custom Clerk signup modal.** Rejected — Clerk's modal already has full Kreol localisation. A custom wrapper adds code with no UX gain.

## Consequences

- Simpler codebase: ~200 lines of JS removed from Layout.astro
- Single identity: one user = one Clerk account, no orphaned email-only subscribers
- Email notifications are not yet implemented — Members sign up but receive no emails until the Notion webhook is built
