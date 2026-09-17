# HeroSection Specification

## Overview
- **Target files:** `src/components/sections/hero-section.tsx` (server component, default export not allowed — use `export function HeroSection()`), `src/components/sections/hero-rays.tsx`, `src/components/sections/hero-particles.tsx` ("use client"), optional `src/components/sections/hero-section.module.css` for keyframes.
- **Screenshots:** `docs/design-references/desktop-1440-01-fe11bf4.png`, `tablet-768-01-fe11bf4.png`, `mobile-390-01-fe11bf4.png` (layout reference only — copy comes from content.ts).
- **Measurements appendix (exact px, all viewports):** `docs/research/components/measurements/01-fe11bf4/{desktop-1440,tablet-768,mobile-390}.txt`
- **Content:** `import { hero } from "@/lib/content"` → `hero.backgroundWord`, `hero.lines: string[]`.
- **Interaction model:** time-driven (ray loop + particles, infinite) + entrance animation on load.

## DOM Structure
```
section.relative.isolate.flex.flex-col.items-center.justify-center.overflow-hidden   (min-h-screen)
  HeroParticles        absolute inset-0 <canvas>
  HeroRays             absolute ray ring (100 bars)
  div (background word) absolute, centred, contains <Reveal> with the word
  h1 (headline)        relative, centred, one <Reveal as="span" className="block"> per line
```
The header (built elsewhere) overlays this section — do not add top padding for it.

## Computed Styles

### Section
- min-height: 100vh (900px at 1440×900); padding-inline 15px; display flex column; justify/align center; overflow hidden.
- Tablet (<992px): min-height 600px. Mobile (<768px): min-height 450px; padding 60px 0.

### Particles (`hero-particles.tsx`, client)
- `<canvas>` absolutely filling the section; size it to the section with a ResizeObserver, scale for `devicePixelRatio`.
- 3 particles. Each: colour randomly `#000000` or `#BEFF01`; radius `Math.random() * 4` (clamp min 0.6); opacity 1; start at random position.
- Motion: per animation frame `x += vx * 3; y += vy * 3` with `vx, vy = Math.random() - 0.5` fixed per particle; bounce (invert velocity) at canvas edges. No connecting lines.
- Pause the rAF loop when the canvas is off-screen (IntersectionObserver). Respect `prefers-reduced-motion` (draw once, no loop).

### Ray ring (`hero-rays.tsx`, can be a server component + CSS module)
Geometry (verified from computed transforms):
- Wrapper: `absolute left-1/2 top-1/2 h-screen w-px -translate-y-1/2 flex items-center` (height 100vh, vertically centred on the section, 1px wide at horizontal centre).
- 100 bars (`i = 0..99`). Each bar: `position:absolute; right:-1px; width:2px; height:24vh; margin-top:-18vh; background:#beff01; transform-origin:50% 100%; transform: rotate(3.6i deg) translateY(-50%)`.
  Result: ring centred at (50%, 50% + 3vh) of the wrapper, inner radius 12vh, outer radius 36vh.
- Animation (reproduce with CSS keyframes, no JS library): each bar runs a 6000ms infinite animation with `animation-delay: i * 60ms`:
  - 0%: `rotate(θ) translateY(-50%) scale(1)`
  - 10% (600ms): `rotate(θ + 10deg) translateY(-40%) scale(1.25)`
  - 20% (1200ms): back to 0% values
  - 20%–100%: hold at rest
  - segment easing `cubic-bezier(0.37, 0, 0.63, 1)` (easeInOutSine) — set `animation-timing-function` inside the 0% and 10% keyframes.
  - Pass θ per bar via a CSS custom property (e.g. `--ray-angle: 36deg`) set in the `style` prop, and use `rotate(calc(var(--ray-angle) + 10deg))` in the peak keyframe.
- Under `prefers-reduced-motion` the global stylesheet already shortens animations; nothing extra needed.

### Background word
- Positioner: `absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none` with an inner block offset `margin-left:-100px` (the word's centre sits ~50px left of section centre).
- Text: `hero.backgroundWord`; font-size 650px; line-height 32px (the 32px line box is vertically centred, glyphs overflow it); font-weight 600; letter-spacing -40px; color `#beff01`; text-align center; white-space nowrap.
- Entrance: `<Reveal from={{ x: 50 }} duration={600} delay={0}>` (opacity 0→1, translateX 50px→0, easeOutQuad).
- Tablet (<992px): font-size 260px; letter-spacing -15px; no margin offset needed (centre it).
- Mobile (<768px): hidden.

### Headline
- `<h1>`: width 1098px max (`max-w-[1098px] w-full`), text-align center, font-size 120px, line-height 110px, font-weight 600, letter-spacing -4px, color `#1c1d1f`, position relative (above rays/word).
- Each entry of `hero.lines` is a block-level span wrapped in `<Reveal as="span" className="block" from={{ y: 30 }} duration={600} delay={500 + i * 300}>`.
- Tablet (<992px): font-size 105px; line-height 96.25px; letter-spacing -4px; max-width 684px.
- Mobile (<768px): font-size 75px; line-height 75px; letter-spacing -4px; padding-inline 15px.

## States & Behaviors
- **Ray pulse wave:** time-driven, see keyframes above (6s loop, 60ms stagger around the ring).
- **Particles:** continuous drift + bounce.
- **Entrance:** background word slides in 50px from the right; headline lines fade up 30px, 500ms then 800ms.
- **Hover:** none.

## Assets
- None (no images). Colours: lime `#beff01` (Tailwind `bg-lime`/`text-lime`), ink `#1c1d1f` (`text-ink`).

## Text Content
- From `hero` in `src/lib/content.ts` only.

## Responsive Behavior
- **Desktop (≥992px):** as above.
- **Tablet (768–991px):** min-height 600px; word 260px; headline 105px/96.25px, wraps to 3 lines within 684px.
- **Mobile (<768px):** min-height 450px, padding 60px 0; word hidden; headline 75px/75px.
- Ray ring always uses vh units (it scales with viewport height).
