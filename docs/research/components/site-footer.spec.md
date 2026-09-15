# SiteFooter Specification

## Overview
- **Target file:** `src/components/layout/site-footer.tsx` (`export function SiteFooter()`), `id="contact"` on the `<footer>`.
- **Screenshots:** `docs/design-references/desktop-1440-99-footer.png`, `tablet-768-full.png` (bottom), `mobile-390-full.png` (bottom).
- **Measurements appendix:** `docs/research/components/measurements/99-footer/*.txt`
- **Content:** `import { footer } from "@/lib/content"` → `tagline: RichText`, `logo`, `offices: { name, lines[] }[]` (2), `phone`, `email`, `nav: LinkItem[]` (7), `copyright: RichText`.
- **Shared:** `RichText`, `next/image`, `next/link`.
- **Interaction model:** static; hover on links.

## DOM Structure
```
footer.relative
  div.top
    div.container row-1 (flex items-center justify-center pb-[34.5px])
      div (w-10/12 px-15) → h5 tagline
      div (w-2/12 px-15 flex justify-end) → a → Image logo 50×56
    div.container row-2 (flex pb-[73.2px])
      div (w-1/4 px-15) × 2 → office name + address
      div (w-1/4 ml-[25%] px-15 flex-col items-end justify-end) → phone, email
  div.bottom (border-t)
    div.container (flex items-center pt-[30px] pb-[32px])
      ul nav (w-7/12 px-15)
      div (w-5/12 px-15 flex justify-end) → copyright
```

## Computed Styles (1440)
- Footer height 357px; background transparent (page grid lines show through).
- Containers: max-width 1220px; margin-inline auto.
### Row 1
- Tagline `h5`: font-size 32px; line-height 42px; letter-spacing -1px; font-weight 400; color `#1c1d1f`. Render `<RichText value={footer.tagline} emphasisClassName="font-semibold text-ink border-b-2 border-ink" />`.
- Logo: `next/image` 50×56 (`footer.logo`), link to `/`.
### Row 2
- Office name: font-size 17px; line-height 32px; font-weight 600; letter-spacing -0.5px; color `#1c1d1f`; margin-bottom 5px.
- Address: font-size 15px; line-height 28px; color `#6f7071`; each entry of `lines` on its own line.
- Contact column (right-aligned): phone link (`tel:` href, digits only) font-size 17px; line-height 32px; color `#1c1d1f`; margin-bottom -7px. Email link (`mailto:`): font-size 17px; line-height 28px; font-weight 600; color `#1c1d1f`; border-bottom 1px solid `#1c1d1f`.
### Bottom bar
- border-top 1px solid `#e4e4e4`; height ≈ 99px.
- Nav: `ul` of inline items; link: display flex; align-items center; padding 8px 16px (first item padding-left 0, last item padding-right 0); font-size 16px; line-height 28px; font-weight 600; color `#1c1d1f`; transition color 0.3s ease-in-out; hover color `rgba(37,37,35,0.6)`.
- Copyright: font-size 15px; line-height 32px; color `#6f7071`; text-align center; `<RichText value={footer.copyright} emphasisClassName="font-medium text-ink border-b border-ink" />`.

## States & Behaviors
- Hover: nav links → `rgba(37,37,35,.6)`; phone/email → same muted colour, 0.3s.
- No entrance animations.

## Responsive Behavior
- **Tablet (768–991px):** container 720. Row 1: tagline column flex 1, h5 font-size 28px, line-height 36.75px; logo right; padding-bottom 24.5px. Row 2: three equal columns (240px) — office, office, contact (contact right-aligned, no margin-left); padding-bottom 43px. Bottom bar: stack centred — nav centred (wraps), copyright centred below, gap 10px.
- **Mobile (<768px):** Row 1 stacks centred: h5 24px / 31.5px, text-center, margin-bottom 25px; logo centred below. Row 2 stacks centred, text-center: each office block margin-bottom 25px; contact centred; padding-bottom 40px. Bottom bar: nav wraps centred (items padding 8px 12px), copyright centred below.
