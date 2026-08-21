# Ligadu — Domain Context

## Glossary

**Member**
A user with a Clerk account. Membership is free. Members can read all articles in full and receive article notifications by email.

**Anonymous User**
A visitor with no Clerk account, not recognized as a Known Crawler. Sees article titles, excerpts, and featured images. Body content is blocked by the ContentGate.

**Known Crawler**
A search or AI-answer-engine bot (Googlebot, Bingbot, GPTBot, ClaudeBot, etc.), detected by user agent (`isKnownCrawler()` in `blog-helpers.ts`). Exempt from the ContentGate: receives full body content like a Member, but none of the Member-only UI (share sidebar, ads, reading progress bar). Not a security boundary — UA spoofing can defeat it — so it exists only to keep articles indexable, never to gate anything that requires real access control. See [ADR 0003](docs/adr/0003-crawler-exempt-from-content-gate.md).

**ContentGate**
The hard wall shown to Anonymous Users (excluding Known Crawlers) on article pages. Renders title + excerpt + Clerk signup/sign-in prompt. No body content is sent in the HTML response for anonymous, non-crawler requests.

**Article Notification**
An email sent to Members when a new article is published. Triggered by a Notion webhook → email function (not yet implemented). Not a newsletter — no separate subscription list, no unsubscribe flow beyond deleting the Clerk account.

**"Fika Ligadu" Banner**
A conversion touchpoint for Anonymous Users. Contains a value proposition and a single button that opens the Clerk sign-in/sign-up modal. Appears on the homepage and in the footer. No email input.

**Newsletter** _(retired concept)_
Previously a separate email subscription system backed by `/api/subscribe`. Removed. The concept no longer exists in this product. All references should be deleted.

## Conversion flow

```
Anonymous User
  → reads article title + excerpt
  → hits ContentGate  →  Clerk modal  →  Member
  → OR sees "Fika Ligadu" banner on homepage/footer  →  Clerk modal  →  Member
```

## Auth

- Auth provider: Clerk (`@clerk/astro` v3)
- Sign-in and sign-up share one modal entry point (`Clerk.openSignIn({})`)
- Clerk's built-in UI has the sign-up toggle — no separate sign-up button needed in the nav
- All elements with class `ligadu-open-sign-in` trigger `Clerk.openSignIn({})` (wired globally in Layout.astro)

## Article Notifications (future)

Notion publish webhook → reads all Clerk users → sends transactional email (provider TBD: Resend / Postmark).
Not implemented. No infrastructure exists yet.
