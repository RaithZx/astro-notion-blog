# ADR 0003 — Exempt known crawlers from the ContentGate

**Status:** Accepted
**Date:** 2026-08-20

## Context

The ContentGate blocks body content from every Anonymous User, with no exception — this was a deliberate design (see CONTEXT.md). It did not distinguish a human visitor from a search or AI crawler: both are unauthenticated, so both received only a ~20% preview.

An SEO audit (`ligadu.com-audit/`) found this made articles effectively unindexable — Googlebot, Bingbot, and AI answer-engine bots (GPTBot, ClaudeBot, PerplexityBot, etc.) never saw more than ~100-150 words of any post. Health score impact: Technical SEO 46/100, AI Search Readiness 25/100, both dominated by this one issue.

Google explicitly sanctions serving crawlers the full text of paywalled/gated content, provided it's declared via structured data (`isAccessibleForFree`) rather than silently: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content. This is not considered cloaking when done this way.

## Decision

Detect known crawler user agents (`isKnownCrawler()` in `blog-helpers.ts`) and treat them as an exception to the ContentGate on post pages: full body content is served, matching what a Member would see, but none of the Member-only interactive UI (share sidebar, ads, reading-progress bar) — crawlers don't need it and it adds noise/weight to the response.

Every post page now also emits `Article` JSON-LD with `isAccessibleForFree: false`, so the paywall status is explicit regardless of which variant of the page a given requester received.

## Alternatives considered

**Serve full content to everyone, drop the gate entirely.** Rejected — this is a real product growth mechanic (see CONTEXT.md conversion flow), not just an SEO obstacle. The audit's job was to fix indexability, not remove the paywall.

**Google-only exemption (Googlebot reverse-DNS verified) instead of a broad UA-string allowlist.** Rejected for now — reverse-DNS verification is the hardened approach but meaningfully more complex, and this is a soft engagement gate, not a paid subscription: the cost of someone spoofing a crawler UA to read one article free is low. Revisit if abuse is observed.

**CSS-selector-based "flexible sampling" (single HTML page for everyone, gated part hidden via CSS, same structured data pattern).** Rejected — would require serving the full article HTML to every anonymous human too (just visually hidden), which defeats the actual gate. Doesn't fit this site's genuinely different-per-requester architecture.

## Consequences

- Anonymous User no longer strictly means "gets the preview" — it now means "gets the preview, unless also a Known Crawler." CONTEXT.md updated accordingly.
- UA-string detection is spoofable: any client can claim to be Googlebot and get a free full article. Accepted risk (see Alternatives).
- `Article` JSON-LD's `isAccessibleForFree: false` is a general-audience access-policy statement, not a per-request flag — it stays `false` even on the crawler/Member branches where content happens to be unlocked for that specific requester.
