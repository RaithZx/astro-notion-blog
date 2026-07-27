---
name: social-clips
description: Turns one published (or draft) Ligadu blog post into a ready-to-shoot cross-platform distribution package — an Instagram Reels script built around one standout stat/fact plus caption and hashtags, and a LinkedIn text post. Use this whenever asked to promote a Ligadu article on social media, turn an article into a Reel/short-form video script, write social captions for a post, or prepare distribution/marketing artifacts for a specific post — even if the user just gives a slug or Notion link and says "make social content for this one." Always call this per-post; it is not a general social-media-strategy skill.
---

# Social clips for Ligadu posts

Ligadu is a science/health/tech blog written in Kabuverdianu (Cape Verdean Creole). This skill
turns a single post into short-form distribution copy for two platforms — Instagram Reels and
LinkedIn. It does not render video or images (no such tool exists in this environment); it produces
the creative brief and copy a human then shoots or designs from.

**Brand rule, non-negotiable:** never frame Ligadu as new, first-of-its-kind, or novel. The owner
has explicitly said to write as if Ligadu is a normal, already-established science/health/tech
outlet. The differentiator is clear writing in Kabuverdianu, not novelty.

## Step 1 — Get the post content

Ask the user for the post's `Slug` (as it appears in the Notion database) or a Notion page URL if
you don't already have one from context. Then run, from the repo root:

```
node .claude/skills/social-clips/scripts/fetch-post.cjs <slug-or-notion-url>
```

This script queries the same Notion database this site builds from (`DATABASE_ID`) and writes the
extracted title, excerpt, tags, and full block text to `social/<slug>/source.json`. It needs
`NOTION_API_SECRET` and `DATABASE_ID` in `.env` at the repo root — the same variables
`npm run cache:fetch` uses. If they're missing the script exits with a clear message; don't try to
work around it by guessing content instead of fetching it.

The script deliberately does zero creative work — it does not pick a stat or write copy. That
judgment call is yours, in the next step, with the real article text in front of you.

Note it does **not** filter on `Published`, so it works for draft/scheduled posts too — prepping
distribution artifacts ahead of a publish date is a normal use of this skill.

## Step 2 — Read the source and find the ONE hook

Read `social/<slug>/source.json`. It contains `title`, `excerpt`, `tags`, `date`, `url` (the real
article link — see the note on `url` below), and `blocks`/`plainText` (the full body).

Read the whole `plainText`, not just the excerpt — the best short-form hook is often a specific
number, comparison, or counter-intuitive claim buried mid-article, not the framing sentence at the
top. Pick exactly **one** stat or fact per platform artifact (they can be the same one, or the
LinkedIn post can use a complementary second one if the article supports it — don't force a second
one if there isn't a good one).

Good hook criteria: concrete (a number, a named comparison, a surprising cause-effect), true to what
the article actually says (never round up or dramatize past what the source supports), and
interesting to someone who has 3 seconds of attention on a vertical feed.

If the article is too short or too abstract to yield a real standout stat/fact, say so to the user
instead of inventing one — a generic "did you know science is cool" hook isn't worth producing.

## Step 3 — About the `url` field

`source.json`'s `url` is built the same way the site itself builds article links: `getPostLink()` in
`src/lib/blog-helpers.ts` (prepends `BASE_PATH`) combined with the canonical domain logic in
`getSite()` in `astro.config.mjs` (prefers `CUSTOM_DOMAIN`). If `CUSTOM_DOMAIN` isn't set in the
environment the script ran in, `url` will be a relative path only (e.g. `/posts/my-slug`) — flag
this to the user rather than silently shipping a broken link, and ask for the real domain to
complete it if they want a finished CTA link.

## Step 4 — Write the artifacts

Create the directory `social/<slug>/` (already created by the fetch script) and write two files.
Everything user-facing (script lines, on-screen text, captions, the LinkedIn post) is in
**Kabuverdianu**, matching this site's existing voice — skim `src/locales/ui-strings.json` for
vocabulary and register (e.g. "Odja tudu artigu", "Fika Ligadu", "Djunta Ligadu — di grasa") before
writing, so the copy sounds like the same publication, not a generic translation.

### `social/<slug>/instagram-reel.md`

```markdown
# Instagram Reel — <post title>

**Source article:** <url>
**Hook stat/fact used:** <one line stating the exact stat/fact, in English, for the human's reference>

## Script

| Time | Voiceover / on-screen speech | On-screen text overlay |
|------|-------------------------------|--------------------------|
| 0:00–0:03 | <hook line, in Kabuverdianu> | <short punchy overlay text> |
| 0:03–0:0X | <stat reveal + one line of context, in Kabuverdianu> | <the number/fact as bold overlay text> |
| 0:0X–0:0Y | <optional: one more line of context or a "why it matters"> | <supporting overlay text, if any> |
| 0:0Y–end | <CTA line, in Kabuverdianu, telling viewers to read the full article> | "Lê artigu kompletu — link na bio" (or equivalent) |

Keep total runtime to roughly 15–30 seconds — this is a Reel, not a documentary. Three to four
script rows is usually enough; don't pad it out.

## Caption

<Kabuverdianu caption, 2-4 sentences, ending with a soft CTA to read the full article. Don't
restate the whole script — the caption complements the video, it doesn't duplicate it verbatim.>

## Hashtags

<8-15 hashtags. Mix a few Kabuverdianu/Cape-Verde-specific tags with broader science/health/tech
discovery tags — pure Kabuverdianu tags alone will have very little search volume on Instagram, so
some general-language tags earn real reach. Use judgment on the mix; don't just transliterate the
caption into hashtags.>

## Shot / visual notes for whoever films this

<2-4 bullet points: suggested visuals, on-camera vs. text-on-background, whether a presenter is
needed, any b-roll ideas tied to the specific stat. Keep practical — this is a brief for a human,
not a shot-by-shot storyboard.>
```

### `social/<slug>/linkedin-post.md`

```markdown
# LinkedIn post — <post title>

**Source article:** <url>
**Hook stat/fact used:** <one line, in English, for the human's reference>

## Post text

<Kabuverdianu text post, roughly 4-8 short paragraphs/lines as is typical for LinkedIn's format
(short lines, not dense blocks). Lead with the stat/fact, add one or two lines of context or "why
this matters" analysis suited to a professional audience, end with a link back to the article.
Tone: informative and credible, not promotional — LinkedIn readers respond to substance, not hype.
No "first of its kind" framing; write like an established outlet sharing a genuinely interesting
finding.>

## Hashtags

<3-5 hashtags, LinkedIn convention is far fewer than Instagram — keep it tight.>
```

## Step 5 — Tell the user what you produced

After writing both files, tell the user where they are (`social/<slug>/`), which single stat/fact
you built the package around and why you picked it over other candidates in the article, and flag
anything they need to act on (missing `CUSTOM_DOMAIN`, an article too thin to yield a strong hook,
etc.). Don't just say "done" — the stat you picked is a judgment call worth surfacing so they can
override it if they'd have picked differently.
