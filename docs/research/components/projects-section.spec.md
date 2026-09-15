# ProjectsSection Specification

## Overview
- **Target files:** `src/components/sections/projects-section.tsx` (`export function ProjectsSection()`), `src/components/sections/project-card.tsx` (`export function ProjectCard(...)`). `id="projects"` on the section.
- **Screenshots:** `docs/design-references/desktop-1440-05-8c4f346.png`, `tablet-768-05-8c4f346.png`, `mobile-390-05-8c4f346.png`.
- **Measurements appendix:** `docs/research/components/measurements/05-8c4f346/*.txt`
- **Content:** `import { projects } from "@/lib/content"` → `backgroundWord`, `badgeText`, `link`, `items: Project[]` (8).
- **Shared components:** `Parallax`, `Reveal`, `RotatingBadge` (`@/components/ui/rotating-badge`), `DotLink`, `HeartIcon`, `next/image`.
- **Interaction model:** scroll-driven parallax (giant word + per-card vertical offsets), time-driven badge rotation, entrance scale on badge, hover on cards.

## DOM Structure
```
section.relative (px-[2%])
  div.top-row (px-15, mb-[82.94px])
    div.container (max-w 1220, mx-auto, flex, items-end, h-[350px])
      div.word-col (w-3/4, px-15)                       ← hidden < 768px
        Parallax(x 0 → -100) div.relative (-ml-[360px], px-15)
          span giant word
          Reveal(scale .7) div.absolute (top -10, right -85) → RotatingBadge dark 190
      div.link-col (w-1/4, px-15, text-right) → div.mt-[30px] → DotLink
  div.grid-wrap (px-15)
    ul.grid (4 columns)
      li × 8 → ProjectCard
```

## Computed Styles (1440)
### Section
- position relative; padding-inline 2% (28.8px); height 1166px (350 top row + 82.94 gap + 733 grid).
### Top row
- Container: max-width 1220px; margin-inline auto; display flex; align-items flex-end; height 350px.
- Word column: width 75% (915px); padding-inline 15px.
- Parallax wrapper: `from={{ x: 0 }} to={{ x: -100 }}`, position relative, margin-left -360px, padding-inline 15px.
- Giant word: `projects.backgroundWord`; font-size 350px; line-height 350px; font-weight 600; letter-spacing -20px; color `#beff01`; white-space nowrap (starts off-screen left; clipped by the page's `overflow-x: hidden`).
- Badge positioner: position absolute; top -10px; right -85px; 190×190; `<Reveal from={{ scale: 0.7 }} duration={600}>`; inside `<RotatingBadge size={190} tone="dark" ringText={projects.badgeText}><HeartIcon className="h-[34px] w-[34px] text-lime" /></RotatingBadge>`.
- Link column: width 25% (305px); padding-inline 15px; text-align right; inner wrapper margin-top 30px; `<DotLink href={projects.link.href} label={projects.link.label} />`.
### Grid
- Wrapper padding-inline 15px; `ul` grid with 4 equal columns (338px each at 1440), no gap (spacing comes from li padding).
- `li`: padding-inline 15px; margin-bottom 30px.
### ProjectCard
- Outer: `<Parallax from={{ y: FROM }} to={{ y: TO }}>` with offsets by index:
  - index 0, 2: 40 → -40 · index 1, 3: -40 → 40 · index 4, 6: 20 → -20 · index 5, 7: -20 → 20
  (pass `from`/`to` in as props from the section).
- Image box (`group` on the card link): position relative; border-radius 6px; overflow hidden; background `rgb(130,130,130)`; aspect-ratio 800/635 (308×245 at 1440).
- Image: `next/image` fill-width (`className="block h-auto w-full"`), `filter: saturate(0)`; transition `transform 0.4s cubic-bezier(0.37,0,0.63,1), filter 0.4s cubic-bezier(0.37,0,0.63,1)`.
- Caption: display flex; justify-content center; align-items center; padding-block 30px; text-align center.
  - Title (link): font-size 17px; line-height 32px; font-weight 600; color `#1c1d1f`.
  - Separator: inline-block 10px × 1px, background `#a8a8a8`, margin-inline 10px.
  - Category: font-size 17px; line-height 32px; color `#6f7071`.

## States & Behaviors
- **Card hover** (whole card is the hover target): image `scale(1.1)` and `saturate(1)`; 0.4s cubic-bezier(0.37,0,0.63,1). Image box keeps overflow hidden.
- **Card parallax:** see offsets above (creates the staggered columns while scrolling).
- **Word parallax:** translateX 0 → -100px; the badge moves with the word.
- **Badge:** ring rotates 8s linear infinite (built into RotatingBadge); entrance scale 0.7→1 + fade, 600ms.

## Assets
- `projects.items[i].image` → `/images/projects/project-0N.svg` (800×635).

## Responsive Behavior
- **Desktop (≥992px):** as above.
- **Tablet (768–991px):** section padding-top 53.75px, padding-inline 30.7px. Top row: word column width 2/3; word font-size 218.75px, line-height 218.75px, letter-spacing -15px, parallax wrapper margin-left -384px; badge top -75px, right -100px (still 190px); link column width 1/3, link wrapper margin-bottom 30px, right-aligned. Grid: 2 columns (368px li, 338px card), image 338×269; keep card parallax.
- **Mobile (<768px):** section padding-inline 15px, no top padding. Word column (word + badge) hidden. Link column full width, left-aligned, margin-bottom 30px (no margin-top). Grid: 1 column, card 360px wide, image 360×286; caption padding-block 20px; disable card parallax (render plain wrapper or zero offsets).
