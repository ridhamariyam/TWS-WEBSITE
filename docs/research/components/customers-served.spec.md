# CustomersServedSection Specification

## Overview
- **Target file:** `src/components/sections/customers-served-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-07-customers-served.png`
- **Ground-truth CSS:** `docs/research/css/customers-served.css`, `faces.css`
- **Ground-truth DOM:** `docs/research/html/07-customers-served.html`
- **Interaction model:** static + scroll reveal. Nothing clickable.
- **Geometry:** y 4720, height 306 @1440 (264 @390). Background `#000`, text `#fff`.

## Structure

```
section#customers-served.customers-served
  .faces.customers-served__faces.faces--no-padding-top
    picture × 5   →  img.faces__face
  .headline.headline--centered.headline--no-padding-top
    h2  "Trusted by 14 million entrepreneurs worldwide"
```

## Avatars

Five overlapping circular headshots, in this DOM order:

`headshot-2`, `headshot-3`, `headshot-5`, `headshot-1`, `headshot-4`

- Files: `public/images/pages/homepage-2025/customers-served/headshot-N.webp`
  (jpg fallbacks also downloaded).
- Intrinsic `width=240 height=240`; rendered **60px** at ≥1020px, **48px** below
  (from the source's `sizes="(min-width: 1020px) 60px, 48px"`).
- `alt=""` — they are decorative, keep it empty.
- They overlap horizontally; the negative margin and z-order are in `faces.css`.

## Typography
- `h2`: `.text-subtitle1` + `.text--light` — Clarkson 400, 40px / 43.2px,
  letter-spacing -1.6px, `#fff`, centred.

## Behavior — reveal
Every avatar **and** the headline are server-rendered with
`style="opacity:0;transform:translateY(25px)"` and cleared on intersection.
Wrap each in `Reveal`; stagger the five faces so they rise in sequence.

## Responsive
- **<1020:** avatars 48px; headline wraps to three lines at 390.

## Notes
- The heading says "14 million" while the hero's odometer reads "14M+" — both
  are correct, do not reconcile them.
