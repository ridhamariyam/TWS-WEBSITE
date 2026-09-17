# YourDomainSection Specification

## Overview
- **Target file:** `src/components/sections/your-domain-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-06-your-domain.png`, `mobile-390-04-your-domain.png`
- **Ground-truth CSS:** `docs/research/css/your-domain.css`
- **Ground-truth DOM:** `docs/research/html/06-your-domain.html` (24 lines)
- **Interaction model:** static, plus a search form.
- **Geometry:** y 4339, height 381 @1440 (328 @390). Background `#000`, text `#fff`.

## Structure

```
section#your-domain.your-domain
  .headline--centered
    h2  "Find the perfect domain" / "for your website"   (two hard-broken lines)
  form.your-domain__form
    MagnifyingGlassIcon  .your-domain__form-search-icon
    input  placeholder "Start your search here"
    button ArrowRightIcon  .your-domain__form-icon
  p  "Already have a domain?" + inline link "Transfer your domain"
```

## Typography
- `h2`: `.text-subtitle1` — Clarkson 400, 40px / 43.2px, letter-spacing -1.6px, `#fff`.
- Trailing line: `.text-body`, `#fff`; "Transfer your domain" is an inline
  underlined link (`Cta variant="inline" underline`).

## Field styling
Read exact values from `your-domain.css`. Observed: a dark pill-shaped field,
roughly 344px wide at 1440, centred, with the search icon inset left and the
submit arrow inset right. Placeholder colour is `--color-gray-500` (#898989).

## Behavior
- Form does not need to submit anywhere — this is a visual clone. Prevent
  default and leave it inert.
- Focus ring: `outline: 2px solid var(--color-focus)` with `outline-offset: 2px`
  from the base layer.

## Responsive
- **<744:** field goes near-full width inside `page-gutter`; headline wraps.

## Notes
- Icons: `MagnifyingGlassIcon`, `ArrowRightIcon` from `@/components/icons`.
- Headline carries inline `opacity: 0` in the source — wrap in `Reveal`.
