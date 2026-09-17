# MadeWithSqspSection Specification

## Overview
- **Target file:** `src/components/sections/made-with-sqsp-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-08-made-with-sqsp.png`
- **Ground-truth CSS:** `docs/research/css/made-with-sqsp.css`, `angled-carousel.css`
- **Ground-truth DOM:** `docs/research/html/08-made-with-sqsp.html` (315 lines)
- **Interaction model:** **scroll-driven**. Columns of customer-site thumbnails
  are tilted in 3D and drift as the section scrolls past. Not click-driven,
  no arrows, no dots.
- **Geometry:** y 5027, height 820 @1440 (776 @390). Background `#000`.

## Structure

```
section#made-with-sqsp.made-with-sqsp
  .made-with-sqsp__intersection-ref        sentinel that starts the drift
  a.made-with-sqsp__fallback               reduced-motion / no-JS still image
    img.made-with-sqsp__fallback-image
  .made-with-sqsp__accessible-list         role="region", screen-reader path
    h2  (sr-only)  "Websites made with Squarespace"
    p   (sr-only)  "This section contains a list of websites created using
                    Squarespace. Each link will open the website in a new tab."
    ul  →  16 external links
  .angled-carousel                         the visible 3D wall
  h2                                       "Made with Squarespace", centred over the wall
```

## The 3D wall

- Several vertical columns of site thumbnails, each column rotated and skewed
  (`transform: rotate3d/​perspective` — take exact matrices from
  `angled-carousel.css`).
- Columns drift at different rates tied to scroll progress, so it reads as
  parallax. Drive it from the section's own scroll progress, not a timer.
- Height is pinned to `calc(100vh - var(--global-nav-height))` when the promo
  banner is present:
  `html.has-promo-banner:not(.has-promo-banner--exempt) #made-with-sqsp`.
  There is no promo banner on this capture — use the section's natural height.
- The centred `h2` sits above the wall with a slight dark scrim behind it.

## Accessibility (do not drop this)

The site ships a parallel, screen-reader-only list because the wall itself is
decorative. Keep both paths:
- Visual wall: `aria-hidden="true"`.
- `.made-with-sqsp__accessible-list`: `role="region"`,
  `aria-label="Websites made with Squarespace"`, containing the sr-only heading,
  the explanatory paragraph, and the link list.

## Links (verbatim, in DOM order)

`samfresquez.com`, `andamirobk.com`, `noraventura.com`, `yarzatwins.com`,
`myrtlegreen.org`, `littleripper.la`, `breathpod.com`, `franklygoodcoffee.com`,
`thedial.world`, `shopmemor.com`, … — the full list and exact `href` values are
in the DOM slice. All are `target="_blank" rel="noopener noreferrer"`.

## Assets
`public/images/pages/homepage-2025/made-with-sqsp/` — including
`fallback-mobile-1.png` (430×710, alt "A grid of Squarespace customer websites.")
and the thumbnail set. Enumerate from the DOM slice.

## Responsive
- **<744:** the 3D wall is replaced by the flat fallback image linking to
  `/showcase`.

## Notes
- Under `prefers-reduced-motion: reduce`, show the fallback image instead of
  animating the wall — that is what the site does.
