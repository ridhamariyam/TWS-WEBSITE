# AboutSection Specification

## Overview
- **Target file:** `src/components/sections/about-section.tsx` (`export function AboutSection()`), `id="about"` on the section.
- **Screenshots:** `docs/design-references/desktop-1440-03-69da39c.png`, `tablet-768-03-69da39c.png`, `mobile-390-03-69da39c.png`.
- **Measurements appendix:** `docs/research/components/measurements/03-69da39c/*.txt`
- **Content:** `import { about } from "@/lib/content"` → `heading`, `body: RichText`, `link`, `backgroundWord`, `image`.
- **Shared components:** `Parallax`, `Reveal`, `RevealGroup` (`@/components/motion/*`), `DotLink` (`@/components/ui/dot-link`), `RichText` (`@/components/ui/rich-text`), `next/image`.
- **Interaction model:** scroll-driven parallax (image scale, giant word translate) + entrance stagger + hover on link (handled by DotLink).

## DOM Structure
```
section.relative.isolate.overflow-hidden
  div.container (max-w 1220, mx-auto) flex items-center py-[110px]
    div.left  (w-1/2, px-15, relative)
      Parallax(scale 1.1 → 1)
        div (-ml-[288px], w-[calc(100%+288px)])  → Image (945×785, block, w-full h-auto)
    RevealGroup.right (w-5/12, ml-[8.333%], px-15, flex-col)
      Reveal → div (w-[478px]) → h2 (-ml-[216px] w-[calc(100%+216px)])
      Reveal → p (w-[444px])
      Reveal → div.mt-[30px] → DotLink
  div.giant-word (absolute, z-[-1]) → Parallax(x 0 → -100) → Reveal(y 1) → span word
```

## Computed Styles (1440)
### Section
- position relative; overflow hidden; `isolate` (so the z-[-1] word stays above the page background). Height 941px = 110 + 721 + 110.
### Container
- max-width 1220px; margin-inline auto; display flex; align-items center; padding-block 110px.
### Left column
- width 50% (610px); padding-inline 15px → content box 580×721px.
- Parallax wrapper: `from={{ scale: 1.1 }} to={{ scale: 1 }}` (transform-origin center, default).
- Image box: margin-left -288px; width calc(100% + 288px) (868px); image aspect 945/785 → 868×721. The image bleeds off the left edge of the viewport (section clips it). No border radius.
### Right column
- width 41.6667% (508px); margin-left 8.3333% (101.66px); padding-inline 15px; flex column.
- **Heading wrapper:** width 478px.
  - `<h2>`: margin-left -216px (overlaps the image); width calc(100% + 216px) (694px); margin-bottom 40px; font-size 80px; line-height 80px; font-weight 600; letter-spacing -3px; color `#1c1d1f`.
- **Paragraph:** width 444px; font-size 17px; line-height 34px; color `#6f7071`; weight 400. Render `about.body` with `<RichText value={about.body} />` (emphasis = 17px/34px, weight 600, `#1c1d1f`, border-bottom 1px solid currentColor — the component's default).
- **Link wrapper:** margin-top 30px; `<DotLink href={about.link.href} label={about.link.label} />` (172×49 at the reference label length).
### Giant background word
- position absolute; left 61.18% (881px at 1440); bottom 60px; height 300px; z-index -1; white-space nowrap; pointer-events none.
- Text: font-size 300px; line-height 300px; font-weight 600; letter-spacing -20px; color `#beff01`. It overflows the right edge (clipped by the section).
- Motion: `<Parallax from={{ x: 0 }} to={{ x: -100 }}>` wrapping `<Reveal from={{ y: 1 }} duration={600} delay={300}>`.

## States & Behaviors
- **Image parallax:** scale 1.1 when the section top enters at the viewport bottom → 1.0 when the section bottom leaves the viewport top (Parallax component handles progress + 0.65s smoothing).
- **Word parallax:** translateX 0 → -100px over the same range.
- **Entrance:** right column children `from={{ x: 15 }}`, duration 800, delay `200 + i * 300` (i = 0 heading, 1 paragraph, 2 link) inside one `RevealGroup`.
- **Link hover:** built into DotLink (lime dot expands to full width, 0.3s).

## Assets
- `about.image` → `/images/about/workspace.svg` (945×785). Use `next/image` with `width`/`height` from content and `className="block h-auto w-full"`, `sizes="(max-width: 991px) 100vw, 60vw"`.

## Responsive Behavior
- **1200–1399px:** same as 1440.
- **992–1199px:** container 960px; keep the two-column structure; reduce heading to 70px/70px and the overlap to -120px; paragraph width 100%.
- **Tablet (768–991px):** container 720px, flex-direction column, align-items center, padding-block 75px.
  - Left column full width (px-15) → image 690×573 with **no** negative margin (width 100%) and no parallax scale (render the image without Parallax below 992px, or pass identical from/to — simplest: wrap desktop-only behaviour with `max-lg:` classes and a plain wrapper).
  - Right column: full width, margin-top 35px, margin-left 0. Heading: margin-left 0, width 100%, font-size 70px, line-height 70px, letter-spacing -3px, margin-bottom 25px. Paragraph width 100%.
  - Giant word: position absolute, right 25px, bottom 0 (top ≈ section height − 175), font-size 175px, line-height 175px, letter-spacing -10px, left auto.
- **Mobile (<768px):** padding-block 50px; image 360px wide (full width minus 15px gutters); heading 52.5px/52.5px, letter-spacing -3px; giant word hidden.
