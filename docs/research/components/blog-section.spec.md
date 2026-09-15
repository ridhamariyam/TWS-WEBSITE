# BlogSection Specification

## Overview
- **Target files:** `src/components/sections/blog-section.tsx` (`export function BlogSection()`), `src/components/sections/blog-card.tsx` (`export function BlogCard(...)`). `id="blog"`.
- **Screenshots:** `docs/design-references/desktop-1440-08-de3dbf9.png`, `tablet-768-full.png`, `mobile-390-full.png`.
- **Measurements appendix:** `docs/research/components/measurements/08-de3dbf9/*.txt`
- **Content:** `import { blog } from "@/lib/content"` → `heading`, `link`, `posts: { category, date, title, href, image }[]` (4, images 597×430).
- **Shared:** `RevealGroup`, `Reveal`, `DotLink`, `next/image`, `next/link`.
- **Interaction model:** entrance stagger + hover image zoom.

## DOM Structure
```
section
  div.container (max-w 1220, mx-auto, pt-[110px], flex-col)
    div.header-row (flex items-center mb-[61px])
      div (w-1/2 px-15) → h2
      div (w-1/2 px-15 flex justify-end) → DotLink
    RevealGroup(as ul).grid (flex / 4 columns)
      li × 4 (px-15 mb-[15px]) → Reveal(y -15) → BlogCard
```

## Computed Styles (1440)
### Container
- max-width 1220px; margin-inline auto; padding-top 110px; no bottom padding (section height 602px).
### Header row
- display flex; align-items center; margin-bottom 61px.
- h2: font-size 60px; line-height 60px; font-weight 600; letter-spacing -3px; color `#1c1d1f`.
- Link column: flex; justify-content flex-end; `<DotLink href={blog.link.href} label={blog.link.label} />`.
### Grid
- 4 equal columns (305px); li padding-inline 15px; margin-bottom 15px.
### BlogCard (`group`)
- Image box: position relative; border-radius 6px; overflow hidden; aspect-ratio 597/430 (275×198). Image: `filter: grayscale(1)`; `transition: transform 0.6s cubic-bezier(0.37, 0, 0.63, 1)`; hover `scale(1.07)`. Whole image is a link to `href`.
- Details: padding-block 30px.
  - Meta row: display flex; flex-wrap wrap; align-items center; margin-bottom 10px; text-transform uppercase.
    - Category (link): font-size 14px; line-height 32px; font-weight 700; color `#1c1d1f`.
    - Dot separator: 4×4px circle, background `rgba(111,112,113,0.7)`, margin-inline 10px.
    - Date: font-size 14px; line-height 32px; font-weight 500; color `#6f7071`.
  - Title (link): display block; max-width 95%; font-size 17px; line-height 28px; font-weight 600; color `#1c1d1f`; transition color 0.3s ease-in-out; hover color `rgba(37,37,35,0.6)`.

## States & Behaviors
- **Entrance:** `RevealGroup` around the list; each card `Reveal from={{ y: -15 }} duration={800} delay={200 + i * 300}`.
- **Hover (card):** image scale 1.07 over 0.6s cubic-bezier(0.37,0,0.63,1). Image box keeps overflow hidden and radius.

## Responsive Behavior
- **Tablet (768–991px):** container 720; padding-top 75px; header row margin-bottom 36px; h2 52.5px / 52.5px. Grid 2 columns (360px li), li margin-bottom 30px; image 330×238.
- **Mobile (<768px):** padding-top 50px; header row stacks centred: h2 41.26px / 41.26px, margin-bottom 20px, then the link centred; header margin-bottom 19.5px. Grid 1 column; li margin-bottom 30px; image 360×259; details padding-block 20px; title max-width 100%.
