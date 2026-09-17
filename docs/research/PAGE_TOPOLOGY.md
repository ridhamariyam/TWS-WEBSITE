# Page Topology — squarespace.com homepage

Measured in a same-origin 1440×900 probe iframe on the live page.
Document height **7844px** at 1440, **6854px** at 390.

## Ground truth in this repo

Everything below is backed by files extracted straight from the live site. These
are the authority — prefer them over anything restated in prose:

| What | Where |
| --- | --- |
| Per-component CSS, all media queries, base→widest order | `docs/research/css/<block>.css` (78 files) |
| Per-section server-rendered DOM, pretty-printed | `docs/research/html/<nn>-<name>.html` (14 files) |
| Design tokens, grid, type scale | `src/app/globals.css` |
| Extracted SVGs as React components | `src/components/icons.tsx` |
| Downloaded imagery/video | `public/images/...`, manifest in `docs/research/asset-urls.txt` |
| Screenshots | `docs/design-references/desktop-1440-*.png`, `mobile-390-*.png` |

## Root structure

```
body
└── div#homepage-default            background #000
    ├── header#global-navigation    position: fixed, height 80px, z-index 900
    ├── main#content                12 sections
    └── footer#footer               height 727px
```

There is no scroll container, no scroll-snap, and **no smooth-scroll library**
(no Lenis, no Locomotive — verified by probing `window` and the DOM). Native
scrolling only.

## Sections, in order

| # | id | y @1440 | h @1440 | h @390 | Background | Interaction model |
| --- | --- | ---: | ---: | ---: | --- | --- |
| — | `global-navigation` | fixed | 80 | 68 | transparent | hover mega-menu; mobile drawer |
| 00 | `homepage-hero` | 0 | 1375 | 979 | `#000` | time-driven video carousel + odometer stats |
| 01 | `.offers-modal` | overlay | 900 | 844 | `rgba(0,0,0,.45)` | promo modal, `opacity: 0` — **inert, skip** |
| 02 | `grow-your-business` | 1375 | 1091 | 932 | `#fff` | pill filter + auto-playing card carousel |
| 03 | `one-platform` | 2466 | 776 | 757 | `#fff` | card carousel, arrows + dots |
| 04 | `get-started` | 3242 | 1097 | 774 | `#fff` → gradient to black | two AI cards + template carousel |
| 05 | `your-domain` | 4339 | 381 | 328 | `#000` | domain search input |
| 06 | `customers-served` | 4720 | 306 | 264 | `#000` | 5 avatars + headline, reveal only |
| 07 | `made-with-sqsp` | 5027 | 820 | 776 | `#000` | 3D angled carousel wall, scroll-driven |
| 08 | `homepage-how-to` | 5847 | 123 | 76 | `#000` | accordion (collapsed) |
| 09 | `homepage-faq` | 5970 | 123 | 76 | `#000` | accordion (collapsed) |
| 10 | `homepage-support` | 6093 | 123 | 76 | `#000` | accordion (collapsed) |
| 11 | `.conversion` | 6216 | 900 | 844 | `#000` + particle sphere video | static CTA |
| — | `footer#footer` | 7116 | 727 | — | `#000` | link columns; mobile accordion |

Sections 08–10 are three instances of the same `accordion-headline` component
stacked with hairline separators, so they read as one block.

## Theme flow

The page is black → white → black:

- **Black:** hero, then everything from `your-domain` down.
- **White:** `grow-your-business`, `one-platform`, `get-started`.
- `get-started` ends with a gradient wash back to black before `your-domain`.

The header is transparent at every scroll position and never gains a background,
shadow or height change — it simply sits over whatever is beneath it. Nav link
colour is set per-section by the sections themselves, not by a scroll listener.

## Z-index layers

| Layer | z-index |
| --- | ---: |
| `consent_blackbar` | 20000 |
| nav dropdowns / locale menu | 1000 |
| `.offers-modal` | 1000 |
| `global-navigation` | 900 |
| `.global-navigation__launchpad` | 999 |

## Build order

1. Shared primitives — `Cta`, `Headline`, `Reveal` wrapper.
2. `SiteHeader`, `SiteFooter` (largest, most reusable).
3. Sections 00→11, each independent.
4. `page.tsx` assembly.
