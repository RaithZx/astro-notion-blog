# Design System Strategy: High-End Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system bridges the gap between cold, technical precision and the warm, human pursuit of knowledge. Unlike standard tech blogs that rely on heavy borders and rigid grids, this system prioritizes a fluid, "connected" experience inspired by the network nodes of the logo.

We break the "template" look by utilizing **intentional asymmetry**—large typographic headlines paired with generous whitespace—and **layered surfaces** that suggest depth and discovery. The goal is to make the reader feel they are looking through a high-tech lens at complex scientific truths, presented with clarity and editorial elegance.

---

## 2. Colors & Surface Philosophy
The palette centers on deep blues and vibrant teals, moving from the dark depths of knowledge to the bright sparks of discovery.

*   **Primary (`#0058be`) & Tertiary (`#006577`):** Use these for high-impact moments. The Primary acts as the "source of truth," while the Tertiary (Teal) represents "active discovery."
*   **The "No-Line" Rule:** Explicitly prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a clean, modern break without visual clutter.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper.
    *   **Level 0:** `surface` (#f8f9ff) – The main canvas.
    *   **Level 1:** `surface-container-low` (#eff4ff) – Use for secondary content modules.
    *   **Level 2:** `surface-container-highest` (#d3e4fe) – Use for high-priority cards or "Deep Dive" callouts.
*   **The "Glass & Gradient" Rule:** Use Glassmorphism for floating navigation and context menus. Use `surface_variant` with a `backdrop-blur` of 12px and 60% opacity to let background colors bleed through.
*   **Signature Textures:** Apply a subtle linear gradient from `primary` (#0058be) to `primary_container` (#2170e4) on main CTAs to mimic the "glow" seen in the logo's nodes.

---

## 3. Typography
Typography is our primary tool for authority. We pair the technical, wide-set **Space Grotesk** with the highly readable, human-centric **Inter**.

*   **Display & Headline (Space Grotesk):** These should feel massive and architectural. `display-lg` (3.5rem) should be used for lead features. The "tech-forward" feel comes from the geometric nature of this typeface.
*   **Title & Body (Inter):** For long-form science reading, `body-lg` (1rem) provides the necessary comfort. The high x-height of Inter ensures legibility in Kabuverdianu, which often features unique character combinations.
*   **The Hierarchy Goal:** Use dramatic scale shifts. A `display-md` headline should sit next to a `label-md` category tag to create an "Editorial Boutique" feel rather than a generic news feed.
*   **Body measure:** Article body copy targets a `44rem` (~70ch at 1.125rem) max-width, centered within its column. This is the single source of truth for reading-column width — implemented on `.article-body` in `PostBody.astro`.

---

## 4. Elevation & Depth
Depth here is atmospheric, not structural.

*   **The Layering Principle:** Avoid shadows for standard cards. Instead, place a `surface_container_lowest` (#ffffff) card atop a `surface_container_low` (#eff4ff) background. This creates "Soft Lift."
*   **Ambient Shadows:** For floating elements (Modals, Hovered Cards), use a shadow with a 24px blur, 0px offset-y, and 6% opacity using a tint of `on_surface` (#0b1c30). This mimics natural laboratory lighting.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at 15% opacity. Never use 100% opaque lines.
*   **Visual Connectivity:** Inspired by the logo, use `primary_fixed` (#d8e2ff) subtle lines (2px) to "connect" related articles in a list, creating a visual thread that guides the reader’s eye.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `full` (9999px). Background: Gradient `primary` to `primary_container`. Text: `on_primary`. No border.
*   **Secondary:** `surface_container_high` background with `on_secondary_container` text.
*   **Tertiary:** Ghost style. No background; `primary` text with an underline that appears only on hover.

### Cards & Deep Dives
*   **Article Cards:** Use `surface_container_lowest` as the base. Forbid divider lines. Use `spacing-6` (1.5rem) to separate the headline from the summary.
*   **Deep Dive Callouts:** Use a `tertiary_container` background with a subtle "Glass" overlay. This signals a higher level of scientific rigor.

### Chips (Category Tags)
*   **Tech/Science Tags:** Use `secondary_fixed` (#d8e3fb) with `on_secondary_fixed` text. Shape: `md` (0.75rem) roundedness. 

### Inputs
*   **Text Fields:** No bottom line. Use a `surface_container_low` fill with a `sm` (0.25rem) corner radius. On focus, transition the background to `surface_container_high` and add a "Ghost Border" of `primary`.

### List Items
*   Avoid the "List View" look. Separate items using `spacing-4` (1rem) and a background shift. Use the `tertiary` color for bullet points or "read more" indicators.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where the text column is offset from the center to create a professional editorial feel.
*   **Do** leverage `surface-dim` for "Dark Mode" sections within a light page to highlight breaking news.
*   **Do** use `spacing-12` (3rem) or higher between major thematic sections to let the content breathe.
*   **Do** ensure that Kabuverdianu text is properly kerned, especially for `Space Grotesk` headlines.

### Don't:
*   **Don't** use 1px solid dividers (lines) to separate articles; use whitespace or `surface-container` shifts.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#0b1c30) to maintain a premium, soft-contrast feel.
*   **Don't** use harsh, small-radius corners. Stick to the `md` (0.75rem) and `lg` (1rem) tokens to keep the "inviting" brand promise.
*   **Don't** crowd the logo. It represents "connection"—give it `spacing-16` of clear space in any header implementation.

---

## 7. Implementation in this repo
*   **Tokens & typography scale:** `tailwind.config.mjs` — colors, `fontSize` (`display-lg`, `display-md`, `body-lg`, `label-md`), `boxShadow` (`ambient`, `ambient-lg`), `backgroundImage` (`cta-primary`, `cta-primary-br`).
*   **Primitives:** `src/styles/globals.css` — `.ds-nav-glass`, `.ds-btn-primary`, `.ds-btn-secondary`, `.ds-btn-tertiary`, `.ds-btn-tertiary-muted`, `.ds-input`, `.ds-chip`, `.ds-card-soft`, `.ds-panel-floating`, `.ds-callout-deep`.
*   **Shell:** `src/layouts/Layout.astro` — glass nav, gradient CTAs, modal + form fields, footer CTA.
*   **Article flow:** `src/pages/posts/[slug].astro`, `PostBody.astro`, `PostTags.astro`, `RelatedArticles.astro`, `subscribeBanner.astro`.