# GetStartedSection Specification

## Overview
- **Target file:** `src/components/sections/get-started-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-05-get-started.png`
- **Ground-truth CSS:** `docs/research/css/get-started.css`,
  `blueprint-ai-search-input.css`, `templates.css`, `template-carousel.css`,
  `ai-entrypoints.css`, `ai-dots.css`, `floating-blueprint-ai.css`
- **Ground-truth DOM:** `docs/research/html/05-get-started.html` (200 lines)
- **Interaction model:** two static entry cards, then a **click-driven** template
  carousel.
- **Geometry:** y 3242, height 1097 @1440 (774 @390). Starts `#fff`, ends with a
  gradient wash into the black `your-domain` section below.

## Structure

```
section#get-started.get-started
  .headline--centered
    h2  "Getting started has never been easier with AI"
    p   "No experience required."
  .ai-entrypoints              two cards, side by side
    card 1  "Blueprint AI Builder"      → Cta "Build with AI"
    card 2  "Professional Templates"    → Cta "Browse website templates"
  p   "Blueprint AI, one of TIME's Best Inventions of 2025*"
  h2  "Start with a website template designed for your business"
  .template-carousel
    template cards  →  Cta "Start with this template"
    Cta "Browse templates"
```

## Copy (verbatim)

- `Getting started has never been easier with AI`
- `No experience required.`
- **Blueprint AI Builder** — `Answer a few questions and let our AI website builder do the rest.` → `Build with AI`
- **Professional Templates** — `Crafted by our designers, customized by AI—just for your business.` → `Browse website templates`
  (note the em dash in "AI—just", keep it)
- `Blueprint AI, one of TIME's Best Inventions of 2025*` (curly apostrophe)
- `Start with a website template designed for your business`
- `Browse templates`, `Start with this template`, `Loading`

## The two entry cards

- Black cards (`#000`) on the light gradient, radius per `get-started.css`.
- Each has a media area on top and the title / body / CTA stacked below,
  centred.
- Card 1 carries a small red "BEST INVENTIONS" TIME badge image in its top-left.
- CTAs are `.cta--tertiary`-style inline links with a trailing arrow, white text.
- Entry animation: `hero-blueprint-ai-in` —
  `0% { opacity: 0; transform: translateY(25px) }` → `to { opacity: 1; transform: translateY(0) }`.
- A loading spinner uses `blueprint-ai-spin` — `to { transform: rotate(360deg) }`.

## Template carousel

Template thumbnails from `public/images/mpp-starting-points/en/` (e.g. `alta…`)
and `public/images/pages/homepage-2025/get-started/`. Enumerate exact files and
template names from the DOM slice. Each card links to its template preview.

## Background gradient

The section transitions white → black down its height so it meets
`#your-domain`. Take the exact `linear-gradient` stops from `get-started.css` —
do not approximate, this seam is very visible.

## Responsive
- **≥1020:** two entry cards side by side, carousel shows ~3 templates.
- **<744:** cards stack; carousel becomes a one-up horizontal scroller.

## Notes
- Import `Cta`, `Reveal`, `ArrowRightIcon`.
- Headlines carry inline `opacity: 0` — wrap in `Reveal`.
