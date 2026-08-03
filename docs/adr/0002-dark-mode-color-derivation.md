# ADR 0002 — Dark mode: CSS-variable tokens, algorithmically derived neutrals

**Status:** Accepted
**Date:** 2026-08-03

## Context

`tailwind.config.mjs` defined ~40 MD3 (Material Design 3) color tokens (`surface`, `on-surface`, `primary-container`, `-fixed`/`-fixed-dim` pairs, `inverse-*`, etc.) as literal hex values. `darkMode: ['class']` was already set, but zero `dark:` variant classes existed anywhere in the codebase, and no dark palette had ever been generated — CLAUDE.md's claim of "shadcn-style CSS variables for theming" did not match reality; the tokens were hardcoded hex, not CSS custom properties.

The token names and structure (`inverse-surface`, `-fixed`, `-fixed-dim`) are textbook Material Theme Builder output, which normally generates light and dark schemes together. No original export/Figma/JSON with the dark scheme was available. `primary-container` (`#2170e4`) is also more saturated than a stock MD3 tone90 container, confirming this palette was hand-customized rather than a raw tool export — so standard MD3 tone-number mapping couldn't be trusted to reconstruct the missing dark half faithfully.

## Decision

1. **Convert every color token to a CSS variable**, stored as raw `R G B` channel triples (not hex), referenced in Tailwind as `rgb(var(--x) / <alpha-value>)`. This is required for Tailwind's opacity modifiers (`bg-surface/80`, `border-outline-variant/20`, used extensively) to keep working.
2. **Define light values in `:root`, override only in `.dark`.** Tokens not redefined in `.dark` cascade from `:root` unchanged.
3. **Keep brand/accent families constant across themes**: `primary`, `secondary`, `tertiary`, `error` and their `on-*`, `-container`, `-fixed`/`-fixed-dim` pairs are NOT overridden in `.dark`. These are vivid, deliberately saturated brand colors (gradient CTAs, chips) that read fine on a dark background — re-deriving a second full tonal palette for them risked drifting from the brand's actual intent without the source design tool.
4. **Only the neutral/surface/text hierarchy gets dark values** (`background`, `surface*`, `on-surface*`, `outline*`, `card`/`popover`/`muted`/`accent` + foregrounds, `border`, `input`). These were derived from the light-mode `on-surface` navy hue, desaturated (capped ~24% saturation — full saturation read as too vivid for large dark fills), at official MD3 dark tone-percentage anchors (surface=6%, surfaceContainerHighest=22%, onSurface=90%, etc.).
5. **`inverse-*` triplet follows MD3's documented role-swap rule**: dark-theme `inverse-surface`/`inverse-on-surface`/`inverse-primary` reuse the light theme's `inverse-on-surface`/`inverse-surface`/`primary` values respectively (not newly invented colors).
6. Theme choice is manual (toggle in nav + mobile drawer), persisted to `localStorage['ligadu-theme']`, defaulting to `prefers-color-scheme` on first visit. Class applied via an inline, blocking `<script>` as the first child of `<head>` to avoid a flash of unstyled/wrong theme.

## Alternatives considered

**Wait for the original Material Theme Builder export before building dark mode.** Rejected by the user — no export exists, and blocking on it wasn't worth the delay for a derivable, reasonable palette.

**Fully regenerate both light and dark palettes via strict MD3 tone-number mapping.** Rejected — the existing light palette is already a customized deviation from stock MD3 tones (e.g. vivid `primary-container`), so mechanically applying textbook tone percentages to reconstruct "the other half" would likely contradict the actual brand look rather than match it.

**Add `dark:` variant classes ad hoc per component instead of CSS variables.** Rejected — the whole site already consumes semantic Tailwind tokens (`bg-surface`, `text-on-surface-variant`, etc.) rather than raw palette classes, so swapping the token *values* via CSS variables re-themes the whole site through the existing class usage, with no need to touch most components individually.

## Consequences

- Whole-site dark mode achieved by touching two files (`tailwind.config.mjs`, `globals.css`) plus the toggle itself, instead of sprinkling `dark:` classes across every component.
- A handful of components used raw non-token Tailwind classes (`bg-gray-100`, `bg-white`, inline hex styles) that don't participate in the CSS-variable system — these were patched individually where they represented actual page chrome (mobile drawer). Self-contained colored components (e.g. the "Fika Ligadu" gradient banner) were deliberately left alone since they're brand-colored regardless of site theme.
- The dark neutral palette is a reasonable approximation, not a verified match to original design intent — if a real Material Theme Builder export surfaces later, the `.dark` block values in `globals.css` should be replaced with it.
- Brand accent colors (primary/secondary/tertiary/error) are identical in both themes by design — if that turns out to look wrong on dark backgrounds in practice, only those token groups need dark overrides added, without touching the neutral system.
