# ConversionCtaSection Specification

## Overview
- **Target file:** `src/components/sections/conversion-cta-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-10-conversion-cta.png`, `mobile-390-05-conversion-cta.png`
- **Ground-truth CSS:** `docs/research/css/conversion.css`, `conversion-component.css`
- **Ground-truth DOM:** `docs/research/html/12-conversion-cta.html`
- **Interaction model:** static.
- **Geometry:** y 6216, height 900 @1440 (844 @390). Background `#000`.

## Structure

```
section.conversion
  video   the particle sphere, centred behind the copy
  h2      "Start your free website trial today"
  p       "No credit card required. Cancel anytime."
  Cta     "Get started"   .cta--primary.cta--light
```

## The sphere is a video, not a canvas

Use `public/images/components/conversion/`:

| Viewport | Video | Poster |
| --- | --- | --- |
| ≥744 | `conversion-centered.mp4` | `conversion-centered-poster.png` |
| <744 | `conversion-centered-mobile.mp4` | `conversion-centered-mobile-poster.png` |

`autoplay muted loop playsInline`, poster set, and swap sources by viewport
(`<source media="...">`, matching the DOM slice). Do **not** rebuild the
particle field with canvas or CSS.

## Typography
- `h2`: `.text-title4`-scale, Clarkson 300 at ≥1280, white, centred, two lines.
  Confirm the exact `.text--*` class in the DOM slice.
- `p`: `.text-body`, white, centred.
- CTA: `.cta--primary.cta--light` — white bg, black label, radius 4px,
  padding 23px 28px, uppercase 14px.

## Notes
- The DOM slice shows three CTA labels ("Get started", "Start a Free Trial") —
  these are A/B variants. Render the visible one, "Get started".
- Copy and CTA reveal on intersection; wrap in `Reveal`.
