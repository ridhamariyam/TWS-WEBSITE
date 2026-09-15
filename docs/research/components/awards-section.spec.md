# AwardsSection Specification

## Overview
- **Target file:** `src/components/sections/awards-section.tsx` (`export function AwardsSection()`), `id="awards"`.
- **Screenshots:** `docs/design-references/desktop-1440-06-f28ba8c.png`, `tablet-768-06-f28ba8c.png` (crop from `tablet-768-full.png` if missing), `mobile-390-full.png`.
- **Measurements appendix:** `docs/research/components/measurements/06-f28ba8c/*.txt`
- **Content:** `import { awards } from "@/lib/content"` → `heading`, `tag`, `backgroundWord`, `intro`, `rows: { count, label, source, year }[]` (4), `logos: ImageAsset[]` (3, 170×30).
- **Shared:** `Reveal`, `RevealGroup`, `Parallax`, `next/image`.
- **Interaction model:** entrance animations + scroll parallax on the giant word. No hover states.

## DOM Structure
```
section
  div.container (max-w 1220, mx-auto, flex, py-[110px])
    div.left (w-5/12, px-15)
      Reveal(y30, d100) → h2
      Reveal(y30, d200) → div.mb-[49px] → span.pill
      div.word-box (relative w-[478px] h-[350px])       ← hidden < 768px
        Parallax(x 0 → -100) → Reveal(opacity only, d300) → div.word (absolute)
    RevealGroup.right (w-1/2, ml-[8.3333%], px-15, flex-col)
      Reveal → div (mt-[49.3px] mb-[40px]) → p
      Reveal → div.table → 4 × row
      Reveal → div.logos (mt-[50px])
```

## Computed Styles (1440)
### Section / container
- Section height 796px. Container: max-width 1220px; margin-inline auto; display flex; padding-block 110px.
### Left column (width 41.6667% = 508px, padding-inline 15px)
- **h2:** width 478px; margin-bottom 25px; font-size 60px; line-height 60px; font-weight 600; letter-spacing -3px; color `#1c1d1f` (wraps to 2 lines).
- **Pill tag:** wrapper margin-bottom 49px. Span: display inline-block; padding-inline 25px; font-size 12px; line-height 32px; font-weight 500; letter-spacing 0.5px; text-transform uppercase; color #fff; background `#1c1d1f`; border-radius 100px.
- **Giant word box:** position relative; width 478px; height 350px.
  - Word: position absolute; top 0; right -135px; white-space nowrap; font-size 350px; line-height 350px; font-weight 600; letter-spacing -20px; color `#beff01`; pointer-events none. It overflows leftwards past the viewport edge (clipped by page overflow-x hidden).
  - Motion: `<Parallax from={{ x: 0 }} to={{ x: -100 }}>` wraps `<Reveal from={{}} duration={600} delay={300}>` (opacity only).
### Right column (width 50% = 610px, margin-left 8.3333% = 101.66px, padding-inline 15px, flex column)
- **Intro wrapper:** margin-top 49.3px; margin-bottom 40px. `p`: max-width 493px; font-size 17px; line-height 32px; color `#6f7071`; margin-bottom 25px? → NO: keep total spacing: p margin 0, wrapper margin-bottom 40px (the extra 25px in the measurement is the p's margin-bottom collapsing into the 40px gap → use wrapper `mb-[40px]` + p `mb-[25px]`, i.e. 65px visual gap between paragraph and table).
- **Table:** full column content width (580px).
  - Row: display flex; border-top 1px solid `#1c1d1f`; the last row also has border-bottom 1px solid `#1c1d1f`. Row content height 62px.
  - Count cell: width 97px; display flex; align/justify center; text 14px / line-height 32px / weight 600 / `#1c1d1f`.
  - Label cell: flex 1 (387px); border-left 1px solid `#1c1d1f`; padding 15px 30px; display flex column; justify center. Text: font-size 17px; line-height 32px; letter-spacing -0.5px; color `#6f7071`; format `{label} - ` followed by `<span class="font-semibold text-ink">{source}</span>`.
  - Year cell: width 97px; padding-inline 15px; flex center; 14px / 32px / weight 600 / `#1c1d1f`.
- **Logos row:** margin-top 50px; `grid grid-cols-3 items-center`; first logo `justify-self-start`, second and third `justify-self-center`; each `next/image` 170×30 with `max-w-full h-auto`, wrapped in `<a href="#">` with `aria-label` = alt.

## States & Behaviors
- **Entrance:** heading `from={{ y: 30 }}` 600ms delay 100; tag `from={{ y: 30 }}` 600ms delay 200; right column children inside one `RevealGroup`: `from={{ y: 30 }}`, 600ms, delay `i * 300` (intro, table, logos).
- **Giant word:** parallax translateX 0 → -100px + fade in (600ms, delay 300).
- **Hover:** none.

## Responsive Behavior
- **992–1199px:** container 960; same structure.
- **Tablet (768–991px):** container 720px; flex-direction column; padding-block 75px.
  - Left column: full width, `items-center` (centred). h2 width auto, font-size 52.5px, line-height 52.5px, letter-spacing -3px, margin-bottom 25px, text-center. Pill wrapper margin-bottom 30px. Word box: width 100% (690px), height 219px, margin-bottom 41.4px; word centred (left 50%, translateX(-50%) on an inner wrapper — not on the Parallax element), font-size 218.75px, line-height 218.75px, letter-spacing -10px.
  - Right column: full width, margin-left 0. Intro p: max-width none, text-center, margin-bottom 25px (wrapper margin-top 0). Table rows: count cell 115px, label cell flex 1 (460px), year cell 115px.
- **Mobile (<768px):** padding-block 50px. h2 41.26px / 41.26px. Word box hidden. Intro p full width, text-center. Table: count and year cells 60px wide; label cell padding 15px 30px, text-center, label and source wrap onto two lines (render source on its own line with `max-md:block`); row height ≈ 94px. Logos: `grid-cols-2`, gap-y 20px, all centred.
