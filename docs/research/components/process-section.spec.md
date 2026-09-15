# ProcessSection Specification

## Overview
- **Target file:** `src/components/sections/process-section.tsx` (`export function ProcessSection()`), `id="expertise"`.
- **Screenshots:** `docs/design-references/desktop-1440-04-758e0ca.png`, `tablet-768-04-758e0ca.png`, `mobile-390-04-758e0ca.png`.
- **Measurements appendix:** `docs/research/components/measurements/04-758e0ca/*.txt`
- **Content:** `import { processSteps } from "@/lib/content"` → `{ number, title, description }[]` (3 items).
- **Interaction model:** static + entrance stagger + hover on each step.

## DOM Structure
`section` → container (max-w 1220, mx-auto, pb-[80px]) → `RevealGroup` row → 3 × `Reveal` step item → [number (absolute), title, description].

## Computed Styles (1440)
### Container
- max-width 1220px; margin-inline auto; padding-bottom 80px; directly follows the About section (no top padding).
### Row
- display flex (3 equal columns, 406.67px each).
### Step item
- position relative; padding-top 48.8px; padding-inline 61px; flex column; `group` for hover.
- **Number:** position absolute; top -15px; left 25px; font-size 90px; line-height 90px; font-weight 700; color transparent; `-webkit-text-stroke: 1px <STROKE_COLOR>` (see "Stroke colour" below); transition `transform 0.5s cubic-bezier(0.5, 1, 0.89, 1)`; pointer-events none; sits behind the title (title is `relative`).
- **Title:** position relative; margin-bottom 5px; font-size 19px; line-height 32px; font-weight 600; color `#1c1d1f`.
- **Description:** `<p>` width 90% (256px of the 285px content box); font-size 17px; line-height 30px; color `#6f7071`.

### Stroke colour
- STROKE_COLOR = `#e4e4e4` (kit colour `--e-global-color-cdb4d1f`, Tailwind `silver`).

## States & Behaviors
- **Entrance:** `<Reveal from={{ y: 40 }} duration={800} delay={200 + i * 300}>` per item inside one `RevealGroup`.
- **Hover (item):** number `transform: translateX(20px) scale(1.1)`; transition 0.5s cubic-bezier(0.5, 1, 0.89, 1). Use `group-hover:`.

## Responsive Behavior
- **Desktop (≥992px):** 3 columns as above.
- **Tablet (768–991px):** container 720px; 2-column wrapping grid (360px columns), third item starts a new row with margin-top 50px (row gap 50px); item padding-top 28.8px, padding-inline 36px; number font-size 78.75px, line-height 78.75px, top -5px, left 15px.
- **Mobile (<768px):** single column; item padding-top 35px, padding-inline 30px; 60px between items; number font-size 67.5px, line-height 67.5px, top -5px, left 15px; description width 100%; section margin-bottom 20px.
