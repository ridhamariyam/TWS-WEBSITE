# HeroSection Specification

## Overview
- **Target file:** `src/components/sections/hero-section.tsx`
- **Screenshots:** `docs/design-references/desktop-1440-01-hero-top.png`,
  `desktop-1440-02-hero-carousel.png`, `mobile-390-01-hero.png`
- **Ground-truth CSS:** `docs/research/css/homepage-hero.css`, `stats.css`,
  `dynamic-background.css`, `video-base.css`
- **Ground-truth DOM:** `docs/research/html/01-hero.html` (404 lines)
- **Interaction model:** time-driven. A background video carousel cycles on a
  timer; the stats odometers spin once on reveal.
- **Height:** 1375px @1440, 979px @390. Background `#000`.

## Structure

```
section#homepage-hero.homepage-hero
  .homepage-hero__background          full-bleed video, animates in
  h1.text--display                    "A website" / "makes it real"
  Cta  GET STARTED                    .cta--primary.cta--light
  p                                   "Start for free. No credit card required."
  .homepage-hero__cards               the tilted site-preview row
  .homepage-hero__stats
    .homepage-hero__stats-header-text "Join millions of entrepreneurs who run their business on Squarespace."
    .stats  →  3 × .stats__card
```

## Typography (computed at 1440)

| Element | Value |
| --- | --- |
| `h1` | Clarkson **300**, 64px / 66.56px (1.04), letter-spacing **-3.84px** (-0.06em), `#fff` |
| hero `p` | Clarkson 400, 15px / 21px, letter-spacing -0.015px, `#fff` |
| `GET STARTED` | Clarkson 500, 14px / 14px, uppercase, black on white |
| stat number | `.text--title3` — see `globals.css` `.text-title3` |
| stat label | `.text--footnote` — 12px / 1.4 |

`h1` is two hard-broken lines: `A website` / `makes it real`.

## Background video carousel

Five verticals, each with desktop + mobile sources, in
`public/images/pages/homepage-2025/hero/videos/july-2026/`:

| Slide | Files |
| --- | --- |
| barber | `barber-desktop.{webm,mp4}`, `barber-mobile.{webm,mp4}` |
| plants | `plants-desktop.{webm,mp4}`, `plants-mobile.{webm,mp4}`, poster `plants-desktop-poster.webp` |
| creative | `creative-desktop.{webm,mp4}`, `creative-mobile.{webm,mp4}` |
| tutor | see `docs/research/html/01-hero.html` for the exact `<source>` list |
| wellness | ditto |

- Serve `webm` first with `mp4` fallback, exactly as the site does.
- `autoplay muted loop playsInline`.
- First paint: `animation: .4s ease-in-out forwards homepageHeroReveal`
  (`opacity: 0 → 1`) on `.homepage-hero__background`.
- Read the cycle interval and crossfade out of `homepage-hero.css`; do not guess.

## Stats — odometer reels (the tricky part)

Three `.stats__card`. Final values come from each counter's `aria-label`:

| Value | Label | Notes |
| --- | --- | --- |
| **14M+** | Entrepreneurs Served | |
| **$36B+** | Earned by Entrepreneurs | |
| **200+** | Countries & Territories | card also has `stats__card--mobile-hide` |

Mechanism:
- `.stats__counter` contains `.stats__digit` columns.
- Each digit is a vertical reel of ten `.stats__number` spans, offset in **75px**
  steps — the server-rendered inline transforms run
  `translateY(225px)`, `translateY(300px)`, `translateY(375px)`,
  `translateY(-300px)` … down to `transform: none`.
- The reel animates to land on the final digit, so it reads as a count-up.
- A sibling `.stats__counter--static` holds the plain value; it is the
  no-JS / reduced-motion fallback. Keep it and swap on
  `prefers-reduced-motion: reduce`.

**Do not read the values off a screenshot** — mid-spin frames show 17M+/19M+/
$10B+/173+, which are not the real numbers.

Card reveal is staggered:
`.stats__card--reveal-one|two|three { animation: 1.2s cubic-bezier(.23,1,.32,1) forwards fadeIn }`.
`fadeIn` is already defined in `globals.css`.

## Content (verbatim)

- `A website` / `makes it real`
- `GET STARTED`
- `Start for free. No credit card required.`
- `Join millions of entrepreneurs who run their business on Squarespace.`

## Responsive
- **1440:** h1 at the `.text--display` ≥1440 step; three stat cards in a row.
- **390:** height 979px, mobile video sources, **third stat card hidden**
  (`stats__card--mobile-hide`), preview cards become a horizontal scroller.

## Notes
- The preview-card row ("BOTANICA", "BOROUGH BARBER", "Balance", "AGENCY") uses
  images under `public/images/auto/` and `public/images/pages/showcase-2025/`;
  enumerate them from the DOM slice rather than guessing.
- Import `Cta` from `@/components/ui/cta` and `Reveal` from `@/components/ui/reveal`.
