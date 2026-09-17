# Behaviors — squarespace.com homepage

Findings from the scroll / click / hover / responsive sweep. Every animation
name and duration below is quoted from the site's own CSS
(`docs/research/css/*.css`), not estimated.

## Global

### Scroll reveal (used everywhere)

The single most common behavior on the page. Elements are **server-rendered**
with an inline style and cleared on intersection:

```html
<h2 style="opacity:0;transform:translateY(25px)">Grow your business</h2>
```

- **Trigger:** IntersectionObserver. It fires on programmatic scroll too, just
  asynchronously — during extraction a jumped scroll looked "dead" for a second
  before the flip landed.
- **State A:** `opacity: 0; transform: translateY(25px)`
- **State B:** `opacity: 1; transform: none`
- **Transition:** none on the element itself. The site's only declared reveal
  easing is the stats cards' `1.2s cubic-bezier(.23,1,.32,1) forwards fadeIn`,
  which the clone reuses for all reveals via the `.reveal` utility.
- **Implementation:** `useReveal()` in `src/hooks/use-reveal.ts` +
  `.reveal` / `[data-revealed]` in `globals.css`.
- Applies to: every `.headline__title`, `.headline__body`, `.faces__face`,
  `.stats__card`.

### No smooth-scroll library

Verified: no `.lenis` / `.locomotive-scroll` class, no `gsap`, `ScrollTrigger`,
`Lenis` or `Motion` on `window`, `scroll-behavior: auto`. Use native scrolling —
adding a smoothing library would be immediately noticeable as wrong.

### Reduced motion

The site ships **35** `prefers-reduced-motion` blocks. Honour it: every
animation below should be suppressed under `prefers-reduced-motion: reduce`.

### CTA hover underline

`.cta--tertiary` and `.cta--has-inline-underline` animate a two-layer
background-position sweep, not a border:

- **In:** `animation: .35s cubic-bezier(.645,.045,.355,1) forwards ctaUnderlineSlideIn`
  — `background-position: -200% 100%, -100% 100%` → `0 100%, 100% 100%`
- **Out:** `ctaUnderlineSlideOut` — `0 100%, 100% 100%` → `210% 100%, 300% 100%`

Full declarations in `docs/research/css/cta.css`.

## Header — `global-navigation`

- **Does NOT change on scroll.** Captured computed styles at scrollY 0, 300 and
  2000: `position: fixed`, `height: 80px`, `background: rgba(0,0,0,0)`,
  `border: none`, `transform: none` at all three. The class stays
  `global-navigation--not-sticky global-navigation--nav-items-visible`.
  It declares `transition: background-color .5s cubic-bezier(.165,.84,.44,1),
  top .3s cubic-bezier(.455,.03,.515,.955)` but nothing on this page triggers it.
- **Mega-menu:** PRODUCTS / SOLUTIONS / RESOURCES open a panel.
  `.global-navigation__accordion-inner` transitions
  `grid-template-rows .7s cubic-bezier(.165,.84,.44,1)` from `0fr` to `1fr`,
  plus `padding .7s` and `visibility .7s step-end`.
- **Account dropdown:** `opacity .3s, visibility .3s step-end` →
  `--is-visible` flips to `step-start`.
- **Mobile drawer:** clip-path swipe, not a slide.
  - open: `animation: .6s cubic-bezier(.165,.84,.44,1) forwards swipeIn`
    — `clip-path: polygon(101% 0%,100% 0%,101% 100%,116% 100%)` → full rect
  - close: `swipeOut` → `polygon(105% 0%,100% 0%,101% 100%,100% 100%)`
- **Launchpad:** `launchpad-fade-in` — `opacity 0 / translateY(-12px)` → `0`.

## Hero — `homepage-hero`

Two stacked behaviors.

1. **Background video carousel (time-driven).** Five business verticals —
   barber, plants, creative, tutor, wellness — each with desktop and mobile
   `.webm` + `.mp4` in `public/images/pages/homepage-2025/hero/videos/july-2026/`.
   Background fades in once with
   `animation: .4s ease-in-out forwards homepageHeroReveal` (`opacity 0 → 1`).
2. **Odometer stats.** `.stats__card` × 3. Each `.stats__counter` holds
   `.stats__digit` columns; each digit is a reel of ten `.stats__number` spans
   offset by **75px** steps (`translateY(225px)`, `translateY(300px)`,
   `translateY(-300px)`, … `transform: none`). The reel spins to land on the
   final digit. Accessible value is on the counter's `aria-label`.
   - Final values: **14M+** Entrepreneurs Served · **$36B+** Earned by
     Entrepreneurs · **200+** Countries & Territories.
   - Third card carries `stats__card--mobile-hide`.
   - Cards reveal staggered via `.stats__card--reveal-one/-two/-three`, all
     `animation: 1.2s cubic-bezier(.23,1,.32,1) forwards fadeIn`.
   - A `.stats__counter--static` sibling is the no-JS/reduced-motion fallback.

**Caution:** mid-spin frames read as 17M+/19M+/$10B+/173+ — those are not the
values. Use the `aria-label`.

## `grow-your-business` — pill filter + carousel

- **INTERACTION MODEL: click-driven.** Eight pills — Services, Online Store,
  Invoicing, Scheduling, Donations, Memberships, Blog, Portfolio.
- `.pills__pill-indicator` is a single sliding pill behind the active label; it
  is positioned with a `transform: matrix(scaleX, 0,0,1, translateX, 0)` — i.e.
  it scales *and* slides to fit the active label's width. Measured mid-state:
  `matrix(0.955746, 0, 0, 1, -229…)`.
- The card row below is an auto-playing carousel with prev/next arrows, a dot
  paging indicator and a **pause/play toggle** (`PauseIcon` / `PlayIcon`).
- On mobile the pills become a horizontally scrollable row.
- Card titles use **Clarkson Serif 400**, 26px/28.08px, `-0.52px` — the only
  serif on the page.

## `one-platform` — card carousel

Four cards: Website Editing, Design Intelligence, Business Email, Domains.
Prev/next arrows plus a dot indicator. Design Intelligence is a **video**
(`design-intelligence-3.mp4`), not a static image — do not rebuild it in HTML.

## `get-started`

Two black AI cards (Blueprint AI Builder, Professional Templates) over a light
gradient, then a template carousel. Footnote: "Blueprint AI, one of TIME's Best
Inventions of 2025*". Spinner uses `blueprint-ai-spin`; entry uses
`hero-blueprint-ai-in` (`opacity 0 / translateY(25px)` → `0`).

## `your-domain`

Search input with a magnifying glass and a submit arrow, placeholder
"Start your search here", plus "Already have a domain? Transfer your domain".

## `made-with-sqsp` — angled 3D wall

Columns of site thumbnails tilted in 3D, drifting as you scroll, with the
"Made with Squarespace" headline centred over them. See
`docs/research/css/angled-carousel.css`. Height is pinned to
`calc(100vh - var(--global-nav-height))` when a promo banner is present.

## Accordions — `how-to`, `faq`, `support`

Three `accordion-headline` blocks, all **collapsed on load** (123px each at
1440, 76px at 390). The `+` icon (`TogglePlusIcon`) carries an inline
`transform: rotate(0deg)` that rotates on open. Body uses the same
`grid-template-rows: 0fr → 1fr` technique as the nav accordion.

`.support__links-cta-arrow--hovered` runs
`animation: 1.1s linear infinite supportHoverArrow` — a ±2px horizontal jitter.

## `.conversion` — final CTA

"Start your free website trial today" / "No credit card required. Cancel
anytime." over a particle-sphere **video** (`conversion-centered.mp4`, with
`conversion-centered-mobile.mp4` and matching posters). Not a canvas — use the
video.

## Footer

- Desktop: five link columns, always open.
- Mobile: columns collapse into accordions —
  `.footer__column-group-list` transitions
  `height .3s cubic-bezier(.645,.045,.355,1), opacity .3s …, visibility .3s step-end`,
  with `--expanded` flipping visibility to `step-start` and height to
  `var(--footer-column-group-list-height)`.
- Locale menu: `opacity .3s / visibility .3s` with a `transform .3s` on contents.
- Badges: ICANN accredited registrar + SSL.

## Responsive

Breakpoints are the site's own: **375 / 600 / 744 / 1020 / 1280 / 1440 / 1920**.

| Token | <744 | ≥744 | ≥1280 |
| --- | --- | --- | --- |
| `--grid-gutter-width` | 16px | 24px | 40px |
| `--grid-column-width` | `(100vw-208)/12` | `(100vw-312)/12` | `(100vw-520)/12` |
| page margin | 16px | 24px | 40px |

`--global-nav-height`: 64px → **375**: 68px → **600**: 72px → **1280**: 80px.

At 390px: header collapses to logo + hamburger, hero stats drop the third card,
card rows become one-up horizontal scrollers, and footer columns become
accordions.
