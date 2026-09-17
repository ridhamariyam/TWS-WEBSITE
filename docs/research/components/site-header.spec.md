# SiteHeader Specification

## Overview
- **Target file:** `src/components/layout/site-header.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-01-hero-top.png`, `mobile-390-01-hero.png`
- **Ground-truth CSS:** `docs/research/css/global-navigation.css` (285 blocks — the authority)
- **Ground-truth DOM:** `docs/research/html/00-header.html` (3235 lines)
- **Interaction model:** hover/click mega-menu on desktop; click drawer on mobile. **Not scroll-driven.**

## Structure

```
header#global-navigation.global-navigation
  a.global-navigation__skip-link          (visually hidden until focused)
  div.global-navigation__header           position: absolute, height 80px
    SquarespaceWordmark  (desktop)  /  SquarespaceMark (mobile)
    nav  — PRODUCTS / SOLUTIONS / RESOURCES, each with ChevronDownIcon
    LOG IN  +  GET STARTED (cta--primary cta--light)
  div.global-navigation__mobile-menu      position: fixed, drawer
  div.global-navigation__desktop-menu     mega-menu panel
```

## Key measurements

- `position: fixed`, `z-index: 900`, `background: transparent` at **all** scroll positions.
- Height is `var(--global-nav-height)`: 64 → 68 (≥375) → 72 (≥600) → **80px** (≥1280).
- Link/label colour is inherited — it is black over the white sections and white
  over the black ones. Do not add a scroll listener; the sections own the colour.
- Nav labels: Clarkson 500, 14px, uppercase (`.cta--tertiary`-like).
- `GET STARTED`: `.cta--primary.cta--light` → white bg, black text, radius 4px,
  padding 23px 28px.

## States & behaviors

### Mega-menu open
- **Trigger:** click/hover on PRODUCTS, SOLUTIONS or RESOURCES.
- **Mechanism:** `.global-navigation__accordion-inner` animates
  `grid-template-rows: 0fr → 1fr`.
- **Transition:** `grid-template-rows .7s cubic-bezier(.165,.84,.44,1),
  padding .7s cubic-bezier(.165,.84,.44,1), visibility .7s step-end`
  (`step-start` when opening).
- The caret (`ChevronDownIcon`) rotates 180°.

### Mobile drawer (<1020px)
- **Trigger:** hamburger button.
- **Open:** `animation: .6s cubic-bezier(.165,.84,.44,1) forwards swipeIn`
  — `clip-path: polygon(101% 0%,100% 0%,101% 100%,116% 100%)` → `polygon(0% 0%,101% 0%,101% 101%,0% 101%)`
- **Close:** `swipeOut` → `polygon(105% 0%,100% 0%,101% 100%,100% 100%)`
- Drawer is `position: fixed`, `background: #000`, full viewport.
- Inside, the three nav groups become accordions using the same
  `grid-template-rows` technique.

### Account dropdown
- `opacity .3s, visibility .3s step-end`; `--is-visible` → `step-start`, `opacity: 1`.
- `background-color: #1a1a1a`, `border-radius: 8px`, `width: 184px`, `padding: 8px`,
  anchored `right: 16px; top: calc(var(--global-nav-height) + 8px)`.

### Hover
- Nav items use the `.cta--tertiary` double-underline sweep — see the
  `ctaUnderlineSlideIn/Out` keyframes already in `globals.css`.

## Content (verbatim)

Top level: `PRODUCTS`, `SOLUTIONS`, `RESOURCES`, `LOG IN`, `GET STARTED`.

Submenu contents are in `docs/research/html/00-header.html` — read the
`.global-navigation__*-submenu` blocks and transcribe every label and href
exactly. Do not invent or abbreviate entries.

## Responsive
- **≥1020px:** full nav row, wordmark logo.
- **<1020px:** wordmark → `SquarespaceMark` glyph, nav collapses to hamburger,
  LOG IN hidden, GET STARTED stays.
- Horizontal padding follows `page-gutter` (16 / 24 / 40px).

## Notes
- Skip link is `.cta--primary.cta--light` positioned absolutely; it must become
  visible on focus.
- Use `SquarespaceWordmark`, `SquarespaceMark`, `ChevronDownIcon`,
  `AccordionArrowIcon` from `@/components/icons`.
- Use `Cta` from `@/components/ui/cta` for every button/link.
