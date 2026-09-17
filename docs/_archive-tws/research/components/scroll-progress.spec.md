# ScrollProgress Specification

## Overview
- **Target file:** `src/components/layout/scroll-progress.tsx` ("use client", `export function ScrollProgress()`).
- **Screenshots:** right edge of `docs/design-references/desktop-1440-sweep-03.png` … `-07.png` ("scroll to top" rail).
- **Measurements appendix:** `docs/research/components/measurements/zz-scroll-progress/desktop-1440.txt`
- **Content:** none (the label "Scroll to top" is a UI string you may hard-code).
- **Interaction model:** scroll-driven (fade-in + progress fill) + click (scroll to top).

## DOM Structure
`div.rail (fixed)` → `button` (flex-col items-center) → `span.label` (vertical text) + `span.track` → `span.fill`.

## Computed Styles
- Rail: position fixed; right 20px; top 50%; transform translateY(-50%); z-index 111; width 32px; height 162px; `mix-blend-mode: difference`; opacity 0 → 1 when `scrollY > 150`; transition opacity 0.3s linear; pointer-events none while hidden. Hidden below 1200px (`max-xl:hidden`).
- Button: display flex; flex-direction column; align-items center; justify-content center; cursor pointer; background none; border 0.
- Label: font-size 11px; line-height 32px; text-transform uppercase; color #fff; `writing-mode: vertical-rl` + `transform: rotate(180deg)` (reads bottom-to-top, 32px wide × ~87px tall); margin-bottom 15px; letter-spacing normal.
- Track: position relative; width 2px; height 60px; background `rgba(255,255,255,0.15)`.
- Fill: position absolute; top 0; left 0; width 100%; background #fff; height = `progress * 60px` where progress = `scrollY / (documentHeight - innerHeight)` clamped 0–1 (update on scroll via rAF).

## States & Behaviors
- **Visibility:** hidden (opacity 0) at the top of the page; fades in after 150px of scroll.
- **Click:** `window.scrollTo({ top: 0, behavior: "smooth" })`.
- White + `mix-blend-mode: difference` renders dark on light sections and light on the dark testimonial band.

## Responsive Behavior
- ≥1200px only; hidden below.
