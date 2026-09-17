# Behaviors — Web Agency homepage

All values extracted with getComputedStyle / hover diffs in headless Chrome (1440, 768, 390) and live inspection.

## Global
- **Smooth scroll:** none (native scrolling).
- **Header:** `position:absolute; top:0; z-index:99`, 116px tall at ≥992px, transparent. Not sticky — scrolls away. <992px: 100px tall, white background, hamburger toggler.
- **Body grid lines:** static background (see topology).
- **Scroll rail (`.scroll-progress`):** fixed `right:20px; top:450px`, `mix-blend-mode:difference`, opacity 0 at top → 1 once scrolled (transition 0.3s linear). Vertical label 11px uppercase white rotated 180° (reads bottom-to-top), 15px gap, then a 2×60px track `rgba(255,255,255,.15)` whose white fill height = scroll progress. Click scrolls to top. Hidden below 1200px.
- **Magic cursor:** over the testimonial carousel the native cursor is replaced by a 70px white circle (`box-shadow: 0 0 50px rgba(0,0,0,.25)`) with ‹ › arrow glyphs 20px ink; fades in/out 0.3s ease-in-out.

## Entrance animations (anime.js on appear, run once)
Easing `easeOutQuad` = cubic-bezier(0.25,0.46,0.45,0.94). Stagger 300ms between targets unless noted.
| Element | From | Duration | Delay |
|---|---|---|---|
| Hero background word | opacity 0, translateX 50px | 600 | 0 |
| Hero headline (per line) | opacity 0, translateY 30px | 600 | 500 (+300/line) |
| Feature strip children | opacity 0, translateX 15px | 800 | 200 (+300 each) |
| About right column children | opacity 0, translateX 15px | 800 | 200 (+300 each) |
| About giant word | opacity 0, translateY 1px | 600 | 300 |
| Process step items | opacity 0, translateY 40px | 800 | 200 (+300 each) |
| Projects badge | opacity 0, scale 0.7 | 600 | 0 |
| Awards heading / tag | opacity 0, translateY 30px | 600 | 100 / 200 |
| Awards giant word | opacity 0 | 600 | 300 |
| Awards right column children | opacity 0, translateY 30px | 600 | 0 (+300 each) |
| Testimonial block | opacity 0, translateX 15px | 800 | 200 |
| Client logo row children | opacity 0, scale 1.1 | 800 | 200 (+300 each) |
| Blog cards | opacity 0, translateY -15px | 800 | 200 (+300 each) |
| CTA words | opacity 0 | 500 | 200 |
| CTA badge | opacity 0, scale 0.5 | 800 | 200 |

## Scroll-linked parallax (skrollr: element top at viewport bottom → element bottom at viewport top)
Skrollable elements carry `transition: transform 0.65s cubic-bezier(0.23,1,0.32,1)` smoothing.
- About image: scale 1.1 → 1.
- About giant word, Projects giant word row, Awards giant word: translateX 0 → -100px.
- Projects grid columns: col 1 & 3 row 1 `translateY(40px → -40px)`, col 2 & 4 row 1 `(-40px → 40px)`; row 2 cols 1 & 3 `(20px → -20px)`, cols 2 & 4 `(-20px → 20px)`.

## Time-driven
- **Hero ray circle:** 100 bars, 2px × 24vh, lime, `transform-origin: 50% 100%`, `margin-top:-18vh`, bar i at `rotate(3.6i deg) translateY(-50%)`, centred on the section's vertical midline. Every 60ms the next bar plays a 600ms easeInOutSine pulse to `rotate(+10deg) translateY(-40%) scale(1.25)` and back (alternate). Whole loop = 6000ms, infinite.
- **Hero particles:** canvas, 3 dots, colours #000000 / #BEFF01, radius random ≤4px, speed 6, direction random, bounce off edges, no link lines, opacity 1.
- **Rotating badges** (Projects, CTA): ring rotates 360° every 8s, linear, infinite.
- **Testimonial carousel:** Swiper slide effect, 1 slide, loop, autoplay 3000ms, pause on hover, speed 500ms, drag/swipe enabled, prev/next buttons.

## Hover states (1440)
- Header nav link: color `#1c1d1f` → `rgba(37,37,35,.6)`, 0.3s ease-in-out. Active item (Home) is `rgba(37,37,35,.6)` at rest.
- "Expertise" nav item: dropdown panel appears below the header (top 116px), 310×313 panel containing a 260px-wide link list, rows 71px.
- Header CTA pill: lifts 2px; label slides up out (-39px, 0.65s cubic-bezier(0.15,0.85,0.31,1)), duplicate label rises in (opacity 0→1 0.5s, transform 0.8s).
- Dot links ("About", "Explore", "Explore all"): 50px lime circle width → 100% of link, 0.3s.
- Process step: outlined number `scale(1.1) translateX(20px)`, 0.5s cubic-bezier(0.5,1,0.89,1).
- Portfolio card: image `scale(1.1)` and `saturate(0) → saturate(1)`, 0.4s cubic-bezier(0.37,0,0.63,1).
- Blog card: image `scale(1.07)`, 0.6s cubic-bezier(0.37,0,0.63,1).
- Testimonial arrows: color white → `rgba(255,255,255,.5)`, opacity 1 → .8, 0.3s.

## Click
- Mobile/tablet toggler (<992px): 22×14 icon of 3 lines → X (two lines rotate ±45°); menu panel drops below header: absolute top 100px, full width, white, padding 15px 0, links 18px/20px weight 500, 40px rows, padding-left 15px; "Expertise" has a chevron toggle (40×40) on the right that expands its children.

## Responsive summary
- ≥1200: layout as measured at 1440.
- 992–1199 (container 960): same structure, tighter.
- 768–991 (tablet, container 720): header → toggler; hero headline wraps to 3 lines; strip wraps 2+1; about image full-width above text; process 2 columns; projects 2-column grid, badge/link beside shortened word; awards stack (heading centred, word below, table full width); testimonials stack, logos wrap 3+2; blog 2 columns; footer 2 columns.
- <768 (mobile): single column everywhere; giant words shrink; strip items stack centred; separators hidden.
