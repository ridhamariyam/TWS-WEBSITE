# SiteHeader Specification

## Overview
- **Target file:** `src/components/layout/site-header.tsx` ("use client", `export function SiteHeader()`).
- **Screenshots:** `docs/design-references/desktop-1440-01-fe11bf4.png` (top 116px), `desktop-1440-header-dropdown-open.png`, `tablet-768-header-closed.png`, `tablet-768-menu-open.png`, `mobile-390-header-closed.png`, `mobile-390-menu-open.png`.
- **Measurements appendix:** `docs/research/components/measurements/00-header/*.txt`
- **Content:** `import { header } from "@/lib/content"` → `logo` (100×112 SVG, rendered 50×56), `nav: NavItem[]` (7; "Expertise" has `children`), `cta`.
- **Shared:** `PillButton` (`@/components/ui/pill-button`), `ChevronDownIcon`, `ArrowUpRightIcon` (`@/components/icons`), `next/image`, `next/link`, `cn`.
- **Interaction model:** hover (nav colour, dropdown, CTA); click (mobile toggler + submenu toggle). Not sticky.

## DOM Structure
```
header (absolute inset-x-0 top-0 z-[99])
  div.row (flex items-center, h-[116px] px-[45px]; <992: h-[100px] bg-white)
    div.logo-col   → Link → Image
    nav.center-col → ul → li × 7 (li with children has the dropdown panel)      ← ≥992 only
    div.cta-col    → PillButton
    div.toggler-col → button (4 lines)                                            ← <992 only
  div.mobile-panel (absolute top-[100px] inset-x-0)                               ← <992 only
```

## Computed Styles

### Desktop (≥992px)
- **Header:** position absolute; top 0; left 0; right 0; z-index 99; background transparent. It overlays the hero and scrolls away with the page.
- **Row:** display flex; align-items center; height 116px; padding-inline 45px.
- **Columns** (of the 1350px inner width at 1440): logo column `basis-1/6` (225px), centre column `basis-4/6` (900px), CTA column `basis-1/6` (225px). Each column padding-inline 15px. Centre column `flex justify-center`; CTA column `flex justify-end items-center`.
- **Logo link:** display inline-block; padding-block 30px; image 50×56.
- **Nav list:** display flex; align-items center; height 116px.
- **Nav link:** display flex; height 116px; align-items center; padding 10px 20px; font-size 18px; line-height 20px; font-weight 500; color `#1c1d1f`; transition color 0.3s ease-in-out; hover color `rgba(37,37,35,0.6)`. The first item (Home) is the active page: color `rgba(37,37,35,0.6)` at rest.
- **Dropdown** (li with `children`; li `relative`):
  - Panel: position absolute; top 100% (116px); left 0; width 310px; background #fff; border-radius 5px; padding 15px 25px; box-shadow `0 0 35px rgba(0,0,0,0.1)`.
  - Hidden: `invisible opacity-0 translate-y-[15px] pointer-events-none`. Open on li hover and `focus-within`: `visible opacity-100 translate-y-0 pointer-events-auto`. Transition opacity + transform 0.5s ease (reference plays a 0.5s show/hide animation; exact keyframes unavailable — use this fade + 15px rise).
  - List width 260px. Each link: display flex; align-items center; height 71px; padding 15px 30px 15px 0; border-bottom 1px solid `rgba(23,23,23,0.1)` (none on the last); font-size 16px; line-height 28px; font-weight 600; color `#1c1d1f`; hover color `rgba(37,37,35,0.6)` 0.3s.
  - Icon before the text: 40×40 circle, background `#f4f4f4`, flex centre, `ArrowUpRightIcon` 16×16 ink; text margin-left 15px.
- **CTA:** `<PillButton href={header.cta.href} label={header.cta.label} />` (it already handles its own hover animation and the <992px padding).

### Tablet & mobile (<992px)
- **Row:** height 100px; background #fff; padding-inline 15px (tablet) / 0 (mobile <768px). Centre nav hidden.
- **Columns:** logo column `flex-1 px-[15px]`; CTA column `px-[15px] flex justify-end items-center` (button renders 150×42); toggler column `px-[15px] flex items-center`.
- **Logo link:** padding-block 22px; image 50×56.
- **Toggler:** `<button type="button" aria-label aria-expanded aria-controls>`; hit area at least 22×32; visual 22×14 made of 4 absolutely positioned 2px ink lines, transition 0.3s:
  - closed: line 1 `top:0; left:4px; width:14px`; lines 2 and 3 `top:6px; left:0; width:22px`; line 4 `top:12px; left:4px; width:14px`.
  - open: lines 1 and 4 collapse (`width:0; opacity:0; top:6px`); line 2 `rotate(45deg)`; line 3 `rotate(-45deg)` → an X.
- **Menu panel:** position absolute; top 100px; left 0; right 0; background #fff; box-shadow `0 15px 25px rgba(0,0,0,0.06)`; open/close animates height (CSS grid `grid-rows-[0fr]` → `grid-rows-[1fr]`, transition 0.35s ease, inner `overflow-hidden`).
  - `ul`: padding-block 15px.
  - Link row: display flex; height 40px; align-items center; padding 10px 15px; font-size 18px; line-height 20px; font-weight 500; color `#1c1d1f` (Home: `rgba(37,37,35,0.6)`).
  - "Expertise": a separate 40×40 toggle button absolutely positioned at the right (right 5px, top 0) with `ChevronDownIcon` 16px (rotates 180° when open, 0.3s); its children expand below: padding-left 30px, padding-bottom 10px; child links font-size 16px, line-height 28px, weight 600, padding-block 6px.
  - Clicking any link closes the menu. Close the menu automatically when the viewport becomes ≥992px (matchMedia listener).

## States & Behaviors
- **Nav link hover:** colour → muted, 0.3s ease-in-out.
- **Dropdown:** hover/focus reveal as above.
- **CTA hover:** built into PillButton.
- **Mobile toggler:** hamburger ↔ X; panel height transition.
- **Scroll:** none — the header is not sticky.

## Responsive Behavior
- **≥992px:** full nav row, 116px, transparent.
- **<992px:** 100px white bar with logo, CTA and toggler; collapsible panel.
- **<768px:** row padding-inline 0 (columns keep their 15px padding).
