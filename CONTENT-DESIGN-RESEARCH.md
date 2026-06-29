# Content Design Research
## How Top Tech, Health & Science Publications Structure Their Blogs

Analyzed: Healthline, Medical News Today, Quanta Magazine, Scientific American, MIT Technology Review (2026-06-26)

---

## 1. Homepage Patterns

### Universal Structure (all 5 sites)

```
[NAV BAR]
[HERO — 1 large featured article, full-width image]
[SECONDARY FEATURED — 2-3 article row or grid]
[TRENDING / POPULAR section]
[CATEGORY / TOPIC EXPLORER]
[LATEST / RECENT section]
[NEWSLETTER CTA]
[FOOTER]
```

### Hero Section
| Site | Hero Treatment |
|------|---------------|
| Healthline | Large image + category tag + H1 headline, no excerpt |
| Quanta | Large image + H1 + 1-2 sentence excerpt + author |
| Scientific American | Large image + H1 + date + category tag + author |
| MIT Tech Review | Large image + topic tag + timestamp + H1 + 1-sentence descriptor |
| Medical News Today | No hero — opens directly with 4-card featured grid |

**Pattern:** Hero = big image + category tag (above title) + H1 + optional brief excerpt. No author on hero for health/science; author on hero for science journalism (Quanta, SciAm).

### Article Cards (non-hero)
Consistent anatomy across all sites:
```
[thumbnail image — 16:9 or square]
[CATEGORY TAG — small caps, colored, above title]
[Headline — H2 or H3, bold]
[excerpt — 0-2 lines, only on science sites]
[author name + date — below headline, smaller weight]
[read time — rare, only Quanta sometimes]
```

Health sites (Healthline, MNT): **no excerpt on cards** — just tag + title + author.  
Science/tech sites (Quanta, SciAm, MIT TR): **add 1-sentence excerpt** on standard cards.

### Grid Layouts Used
- **3-col grid**: standard section (SciAm, MIT TR)
- **4-col grid**: trending/category explorer (Healthline, MNT)
- **2-col with 1 large + 2 small**: secondary featured (Quanta)
- **Single-column feed**: article list pages (Quanta primary, MIT TR topic pages)

### Category/Topic Explorer
Healthline and MNT both use a dedicated section (6-column grid) for browsing by health category. Quanta uses the nav. MIT TR uses topic tags on cards as the discovery mechanism.

**For Ligadu:** A topic/tag explorer section on the homepage would follow the Healthline pattern well.

---

## 2. Navigation Structure

### Common patterns
- **Sticky top nav** on all sites
- Categories as primary nav items (dropdown on hover)
- Search icon in top-right
- Newsletter/Subscribe CTA in top-right corner
- Dark mode toggle rare (only some)

### Navigation depth
| Type | Structure |
|------|-----------|
| Health sites | Mega-menu (Health Conditions → 20+ subtopics) |
| Science sites | Flat categories (Physics, Math, Biology, CS) |
| Tech sites | Flat + series (Topics + Featured Series) |

### Mobile nav
All collapse to hamburger. Categories shown as accordion list. Newsletter CTA preserved.

---

## 3. Article Page Anatomy

### Header Zone (above the fold)
```
[CATEGORY TAG — colored, clickable]
[H1 Title — large, bold, narrow column]
[Subtitle / deck — optional, 1 sentence, lighter weight]
[author photo + name + credentials]
[date published + date updated]
[read time estimate]
[hero image — full content-width, below metadata]
```

**Health sites add:** "Medically reviewed by [Name, Credentials]" directly under author. Shown twice: top of article AND end of article.

**Science/tech sites:** category tag prominent above title. No medical reviewer.

### Body Layout
| Site | Content column width | Sidebar |
|------|----------------------|---------|
| Healthline | ~680-720px center | none (full-width responsive) |
| Quanta | ~700px center | right: Most Read + Save |
| SciAm | ~720px center | right: related articles |
| MIT TR | ~720px center | none / sticky share |

**Key insight:** All use **narrow reading column** (~680-740px max-width) centered on page. Wide hero image then narrows for body text. This is the industry standard for readability.

### In-Article Components

#### Key Takeaways / Summary Box
Used by: Healthline (mandatory), MNT (common)
Position: Top of article, before body text
Format: Bordered box, bulleted list, "Key Takeaways" or "At a glance" heading

#### Pull Quotes
Used by: Quanta (prominent), SciAm (occasionally)
Format: Large text, left border accent, indented

#### Callout / Info Boxes
Used by: Healthline (warning/note boxes), SciAm (sidebar facts)
Types: Note, Warning, Tip, Research Note

#### Tables of Contents
Used by: Healthline (horizontal tab bar near top), MNT (anchor links)
Format at Healthline: Horizontal scrollable pill buttons linking to H2 sections

#### Data Tables
Used by: Healthline (nutrition data), SciAm (comparison data)
Format: Standard bordered table, alternating row shading

### Author & Reviewer Block
Position: **End of article** (all sites) + abbreviated at top (health sites)

Health sites format:
```
[Author photo — circle crop]
[Written by: Name]
[Credentials + bio — 2-3 sentences]
[Links: author page, other articles]
---
[Reviewed by: Name, Credentials]
[Review date]
```

Science/tech sites: author bio at end, no reviewer.

### Related Articles
| Site | Position | Format |
|------|----------|--------|
| Healthline | Inline mid-article + end section | Card grid (2-3 cols) |
| Quanta | Right sidebar (sticky) + end | List with thumbnail |
| SciAm | Right sidebar + end | List |
| MIT TR | End of article | 3-card row |
| MNT | End of article | List with author |

**Pattern:** Always at end. Science sites also have sidebar "Most Read." Health sites inject related links inline mid-article.

### Social Share
| Site | Position | Style |
|------|----------|-------|
| Healthline | After article body | Facebook + X icons, inline |
| Quanta | Sticky left sidebar (desktop) | Icon buttons: Save, Share, Comment |
| SciAm | Below hero image + end | Share count + icons |
| MIT TR | Sticky left sidebar (desktop) | Icon-only |

**Pattern:** Two placements are common: sticky left sidebar on desktop (Quanta, MIT TR) and inline after article content. Health sites just inline at end.

### Newsletter / Subscription Prompts
| Site | Placement | Aggressiveness |
|------|-----------|----------------|
| Healthline | Banner at top, mid-article | Moderate |
| Quanta | After each article section, sidebar | Low — content-first |
| SciAm | Mid-article + end | Moderate |
| MIT TR | Topic page header, end of article | Moderate |

---

## 4. Typography Hierarchy

### Scale pattern (consistent across all)
```
Category tag:    11-12px, uppercase, colored, letter-spaced
H1 (title):      32-48px, bold/black weight
H2 (sections):   24-28px, bold
H3 (subsections):20-22px, semibold
Body text:       17-18px, regular, 1.6-1.75 line height
Byline/metadata: 13-14px, regular or medium, muted color
Caption:         13px, italic or muted
```

### Font choices
- Health sites: System sans-serif or clean geometric (Inter-style)
- Science sites: Serif for body text (Quanta uses serif), sans for UI
- Tech sites: Mixed — sans for UI, sometimes serif for article body

**For Ligadu:** Using serif for article body text (like Quanta) signals quality journalism. Sans for UI/nav/metadata.

---

## 5. Trust Signals

### Health sites (critical)
- Medical reviewer badge (top and bottom of article)
- "Updated: [date]" prominent
- Author credentials in byline (RD, PhD, MD)
- "X studies cited" / "fact-checked" label
- Editorial process transparency page
- Reviewer count stat ("130 medical reviewers")

### Science sites
- Author institutional affiliation
- Publication date + "last reviewed" date
- Source citations / references section at end
- Editorial independence statement

### Tech sites
- Author bio with past publications/beats
- Timestamp (very prominent — tech news is time-sensitive)
- "X minute read" estimate

---

## 6. Footer Patterns

### Universal 3-column structure
```
Col 1: Navigation / Explore
  - Main categories
  - Sitemap links

Col 2: Company / About
  - About, Careers, Contact
  - Advertise, Press

Col 3: Legal / Connect
  - Privacy, Terms, Cookies
  - Social media icons
  - Newsletter signup (sometimes)
```

Health sites add: medical disclaimer, brand ecosystem (Healthline → MNT → Greatist → Psych Central).  
Science/tech: Add RSS feed links.

---

## 7. Color & Visual Language Patterns

### Category tags
All sites use **color-coded category tags** to aid scannability. Health: condition-based colors. Science: discipline colors (Physics=red, Math=blue, etc.). Tech: single accent color or topic-based.

### Image treatment
- Cards: always **16:9** landscape for consistency in grids
- Hero: full-width, can be taller ratio (21:9 or cinematic)
- Author photos: small circle crop (40-48px)
- Reviewer photos: same circle crop

### Cards: hover state
All sites lift cards on hover (box shadow or slight scale). Category tag usually changes color or underlines. Headline underlines.

---

## 8. Patterns to Apply to Ligadu

### Homepage priorities
1. **Hero section** with single featured post (large image + tag + title + excerpt)
2. **3-col featured grid** below hero (3 top/curated posts)
3. **Latest posts section** (clean list or 4-col grid)
4. **Tag/category explorer** (if Ligadu uses multiple topic categories)
5. **Newsletter CTA** inline in homepage flow

### Article page priorities
1. **Category tag** above H1 (colored, linked)
2. **Author + date + read time** below title
3. **Full-width hero image** after metadata
4. **Narrow reading column** (~700px, centered)
5. **Key Takeaways box** at article top (if applicable)
6. **Horizontal TOC** for long articles (Healthline-style pill tabs)
7. **In-article related links** (inline, subtle)
8. **Sticky share bar** left side on desktop (Quanta-style)
9. **Author bio** at end with photo
10. **Related posts grid** (3 cards) at end of article

### What to skip
- Medical reviewer pattern (not applicable unless health content)
- Mega-menus (Ligadu likely has fewer categories)
- Paywall/subscription modals mid-article

---

## 9. Site-by-Site Summary

| Site | Category | Layout Complexity | Key Differentiator |
|------|----------|-------------------|--------------------|
| Healthline | Health | High | Trust signals, medical reviewers, horizontal TOC |
| Medical News Today | Health | Medium | Author-first cards, podcast/series sections |
| Quanta Magazine | Science | Medium-High | Serif typography, sticky share sidebar, save/read-later |
| Scientific American | Science | Medium | Color-coded categories, issue-based featured |
| MIT Technology Review | Tech | Medium | Topic tag on every card, newsletter-first topic pages |

---

*Research conducted 2026-06-26. Sites may update their designs; re-verify before implementation.*
