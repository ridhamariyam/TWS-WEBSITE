# TestimonialsSection Specification

## Overview
- **Target files:** `src/components/sections/testimonials-section.tsx` (`export function TestimonialsSection()`, server), `src/components/sections/testimonial-carousel.tsx` ("use client", carousel + arrows + magic cursor). `id="testimonials"` on the section.
- **Screenshots:** `docs/design-references/desktop-1440-07-d5bb535.png`, `tablet-768-full.png`, `mobile-390-full.png`.
- **Measurements appendix:** `docs/research/components/measurements/07-d5bb535/*.txt`, magic cursor: `measurements/zz-magic-cursor-wrapper/desktop-1440.txt`.
- **Content:** `import { testimonials } from "@/lib/content"` → `rating`, `ratingLabel`, `background` (dot-field SVG), `items: { quote: RichText, author }[]` (3), `logos: ImageAsset[]` (5, rendered 35px tall, widths in content).
- **Shared:** `Reveal`, `RevealGroup`, `RichText`, `StarIcon`, `ArrowLeftIcon`, `ArrowRightIcon`, `ChevronDownIcon`, `next/image`.
- **Interaction model:** time-driven carousel (autoplay 3000ms, loop, pause on hover) + click arrows + pointer drag/swipe; pointer-driven magic cursor over the slides.

## DOM Structure
```
section.relative.overflow-hidden.bg-ink
  div.bg (absolute inset-0, background-image dot-field, cover, pointer-events none)
  div.container (relative, max-w 1220, mx-auto, flex-col, pt-[110px] pb-[57.6px])
    Reveal(x15, 800, d200) → div.block (relative, px-15, flex, min-h-[220px])
      div.left (w-1/2)
        div.rating (flex items-center mb-[10px]) → number + (star pill / label stack)
        [arrows are rendered by the carousel, absolutely positioned at left: 0, top: 150px]
      TestimonialCarousel (w-1/2) → slides
    div.separator (mx-15, h-px, bg-white/10, mt-[107px] mb-[71.4px])
    RevealGroup.logos (grid grid-cols-5) → 5 × Reveal(scale 1.1) → a → Image
```

## Computed Styles (1440)
### Section
- background `#1c1d1f`; height 602px; position relative; overflow hidden.
- Background layer: absolute inset 0; `background-image: url(testimonials.background)`; `background-size: cover`; `background-position: center`.
### Container
- max-width 1220px; margin-inline auto; padding-top 110px; padding-bottom 57.6px; flex column.
### Rating (left half, starts at x = container + 15px)
- Number: font-size 80px; line-height 80px; font-weight 700; color #fff; margin-right 10px.
- Stack to the right of the number (width 120px, centred text):
  - Star pill: padding 6px 20px 5px; background `#beff01`; border-radius 30px; 5 × `StarIcon` 16×16 color `#1c1d1f` inline (no gap).
  - Label: font-size 13px; line-height 32px; font-weight 500; text-transform uppercase; color #fff; text-align center.
### Arrows (inside the carousel component so they can drive it)
- Positioned relative to the block: prev at left 0 / top 150px, next at left 70px / top 150px (10px gap). Each: 60×60; border-radius 100%; background `#333436`; color #fff; display flex center; z-index 9; `ArrowLeftIcon` / `ArrowRightIcon` 15×17. Accessible labels "Previous slide" / "Next slide".
- Hover: color `rgba(255,255,255,.5)`, opacity 0.8; transition 0.3s.
### Slides (right half: starts at x = 50% of container + 15px, width 580px, overflow hidden)
- One slide visible. Slide inner content width 522px (≈90%).
- Quote: display inline-block; margin-bottom 20px; font-size 32px; line-height 42px; letter-spacing -0.5px; font-weight 400; color #fff. Render with `<RichText value={item.quote} emphasisClassName="font-medium text-white border-b-2 border-white" />` (emphasis weight 500, 2px white underline).
- Author: display inline-block; font-size 15px; line-height 22px; font-weight 600; letter-spacing 2px; text-transform uppercase; color `#beff01`.
### Separator
- margin-inline 15px; height 1px; background `rgba(255,255,255,0.1)`; margin-top 107px; margin-bottom 71.4px.
### Client logos
- `grid-cols-5`; each cell centred; logo `next/image` with the content width × 35px height; wrapped in `<a href="#" aria-label={alt}>`.

## States & Behaviors
### Carousel (build it yourself — no carousel library)
- Horizontal slide effect: a flex track translated by `-index * 100%` with `transition: transform 500ms ease`.
- Loop: seamless in both directions (e.g. render a clone of the last slide before the first and of the first after the last, jump without transition after reaching a clone).
- Autoplay every 3000ms; pause while the pointer is over the carousel block; resume on leave. Stop autoplay when `document.hidden`.
- Prev/next buttons move one slide.
- Pointer drag / touch swipe: the track follows the pointer; release past 15% of the slide width (or a fast flick) changes slide, otherwise snaps back.
### Magic cursor (pointer: fine devices only)
- While the pointer is over the slides area, hide the native cursor (`cursor: none`) and show a fixed 70×70 circle centred on the pointer: background #fff; border-radius 100%; box-shadow `0 0 50px rgba(0,0,0,0.25)`; z-index 10000; contains two ink chevrons (left and right, 20px, `ChevronDownIcon` rotated ±90°) side by side.
- Fades in/out: `opacity` transition 0.3s ease-in-out (0.1s delay). Position follows the pointer via transform on pointermove (rAF). `pointer-events: none`.
### Entrance
- The rating/carousel block: `Reveal from={{ x: 15 }} duration={800} delay={200}`.
- Logos: `RevealGroup` with each logo `Reveal from={{ scale: 1.1 }} duration={800} delay={200 + i * 300}`.

## Responsive Behavior
- **Tablet (768–991px):** container 720; padding-block 75px. Block becomes a column: rating on top (number 70px/70px); carousel full width below with padding-top 90px; arrows at top 10px of the carousel (prev left 0, next left 70px). Quote 28px / 36.75px. Separator margin 60px top / 50px bottom. Logos: flex-wrap centred, 3 on the first row and 2 on the second, row gap 30px.
- **Mobile (<768px):** padding-block 50px; number 60px/60px; carousel full width (360px), padding-top 90px; quote 24px / 31.5px. Logos: single column, centred, gap 30px. Magic cursor disabled (touch).
