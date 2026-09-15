# CtaSection Specification

## Overview
- **Target file:** `src/components/sections/cta-section.tsx` (`export function CtaSection()`).
- **Screenshots:** `docs/design-references/desktop-1440-09-dc2f35d.png`, `tablet-768-full.png`, `mobile-390-full.png`.
- **Measurements appendix:** `docs/research/components/measurements/09-dc2f35d/*.txt`
- **Content:** `import { cta } from "@/lib/content"` → `darkWord`, `limeWord`, `badgeText`.
- **Shared:** `Reveal`, `RotatingBadge` (tone "light"), `ArrowUpRightIcon`.
- **Interaction model:** entrance + time-driven badge rotation. No hover.

## DOM Structure
```
section.relative.overflow-hidden
  div.container (max-w 1220, mx-auto, flex, pt-[85px], pb-[57.6px])
    Reveal(opacity, 500, d200) div.left (w-5/12 px-15 flex justify-end) → span dark word
    div.right (w-7/12 px-15 relative)
      Reveal(opacity, 500, d200) → span lime word
      div.badge (absolute top-[-80px] left-[-125px]) → Reveal(scale .5, 800, d200) → RotatingBadge
```

## Computed Styles (1440)
- Section: position relative; overflow hidden; height 493px.
- Container: max-width 1220px; margin-inline auto; display flex; padding-top 85px; padding-bottom 57.6px.
- **Left column:** width 41.6667% (508px); padding-inline 15px; display flex; justify-content flex-end (the word's right edge aligns with the column's content edge and it overflows to the left, clipped by the section).
  - Dark word: font-size 350px; line-height 350px; font-weight 600; letter-spacing -20px; color `#1c1d1f`; white-space nowrap.
- **Right column:** width 58.3333% (712px); padding-inline 15px; position relative.
  - Lime word: same type as the dark word but color `#beff01`; left-aligned; overflows right (clipped).
  - Badge positioner: position absolute; top -80px; left -125px; 295×295; z-index 1.
  - `<RotatingBadge size={295} tone="light" ringText={cta.badgeText}>` with centre: a 100×100 circle, background `#beff01`, flex centre, containing `ArrowUpRightIcon` 44×44 color `#1c1d1f`.

## States & Behaviors
- **Entrance:** each word `Reveal from={{}} duration={500} delay={200}` (fade only). Badge `Reveal from={{ scale: 0.5 }} duration={800} delay={200}`.
- **Badge:** ring rotates 8s linear infinite (built in).

## Responsive Behavior
- **Tablet (768–991px):** container 720; padding-top 70px; padding-bottom 40px. Left column width 300px; right column flex 1 (420px). Words: font-size 148.75px; line-height 148.75px; letter-spacing -10px. Badge: size 200 (pass a different size via two badges shown per breakpoint, or a wrapper `scale`), positioned top -90px, left -95px.
- **Mobile (<768px):** padding-top 30px; padding-bottom 40px; columns stack full width, both centred (`justify-center`, text-center). Words: font-size 75px; line-height 75px; letter-spacing -4px; dark word first, lime word below. Badge hidden.
