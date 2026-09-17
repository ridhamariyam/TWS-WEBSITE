# Clone notes — known gaps and deliberate choices

## Not reproducible as-is

**`made-with-sqsp` is a WebGL scene.** The live section renders a
`.scene__canvas`, not DOM nodes — there is no markup, no `<img>` set and no
transform matrices to copy, and the texture atlas is generated at runtime.
The clone ships Squarespace's own degradation path instead: the
`made-with-sqsp__fallback` still image they serve when the scene can't run,
with a light scroll-linked parallax, plus the screen-reader link list that
exists alongside the canvas on the live page. Visually very close; it is not a
live 3D wall.

## Inferred rather than measured

**Accordion open animation.** The live accordions set an explicit pixel height
inline from JS and declare no transition in CSS, and their JS did not respond to
synthetic clicks during extraction, so the open state could not be observed.
The clone uses the timing the same design system declares for its nav accordion
— `.7s cubic-bezier(.165,.84,.44,1)` — and rotates the plus 45° into a ×.

**Hero video cycle interval.** The crossfade is verbatim
(`opacity .8s cubic-bezier(.23,1,.32,1)`); the dwell time between slides is not
in the CSS, so 6s is a judgement call.

**Carousel autoplay interval** in `grow-your-business`: same situation, 6s.

## Deliberate deviations

- **Template carousel** shows the 3 templates the homepage actually ships
  (`altaloma`, `reseda`, `rotate`); the live carousel pages through a larger
  server-driven set.
- **Account dropdown / launchpad** in the header are logged-in surfaces. The
  logged-out page never shows them, so they are not built.
- **`.offers-modal`** is present in the DOM at `opacity: 0` and inert on the
  live page; skipped.
- **Forms are inert.** The domain search preventDefaults rather than posting to
  Squarespace.

## Asset notes

- `payment-2` exists only as `.webp`; every `.jpg` variant 404s on Squarespace's
  own CDN.
- The hero's four non-default video slides are injected by JS, so they are not
  in the server-rendered HTML — they were enumerated from the live DOM and
  fetched separately.
- **Clarkson / Clarkson Serif are Squarespace's licensed typefaces**, and the
  imagery, copy and logo are their IP. They are here so the clone renders at
  true fidelity; this is not licensed for redistribution or public deployment.
