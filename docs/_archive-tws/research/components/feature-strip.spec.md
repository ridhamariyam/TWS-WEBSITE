# FeatureStrip Specification

## Overview
- **Target file:** `src/components/sections/feature-strip.tsx` (`export function FeatureStrip()`).
- **Screenshots:** `docs/design-references/desktop-1440-02-0f4579f.png`, `tablet-768-02-0f4579f.png`, `mobile-390-02-0f4579f.png`.
- **Measurements appendix:** `docs/research/components/measurements/02-0f4579f/*.txt`
- **Content:** `import { features } from "@/lib/content"` → `FeatureItem[]` (`icon: "badge" | "pin" | "heart"`, `label`).
- **Interaction model:** static + entrance stagger.

## DOM Structure
`section` → centred row (max-width 1220px, `mx-auto`) → `[item, separator, item, separator, item]` (separators between items only).

## Computed Styles
### Row (≥992px)
- display flex; justify-content center; align-items center; height 32px; no vertical padding.
### Item
- padding-inline 15px; display flex; align-items center.
- Icon: 15×15px, color `#1c1d1f`, margin-right 5px. Map `badge → BadgeCheckIcon`, `pin → MapPinIcon`, `heart → HeartIcon` from `@/components/icons`.
- Label: font-size 14px; line-height 32px; font-weight 600; text-transform uppercase; color `#1c1d1f`; letter-spacing normal; white-space nowrap.
### Separator
- padding-inline 15px; inner line width 100px, height 1px, background `#1c1d1f`, vertically centred.

## States & Behaviors
- **Entrance:** wrap the row in `<RevealGroup>`; each of the 5 children is `<Reveal from={{ x: 15 }} duration={800} delay={200 + i * 300}>`.
- **Hover:** none.

## Assets
Icons from `src/components/icons.tsx` only.

## Responsive Behavior
- **Desktop (≥992px):** single row as above.
- **Tablet (768–991px):** `flex-wrap`, `justify-center`, each child margin-bottom 10px (last item of the set drops to a centred second row when it doesn't fit).
- **Mobile (<768px):** flex-direction column, items centred, each row 32px tall with 10px gap; separators hidden.
