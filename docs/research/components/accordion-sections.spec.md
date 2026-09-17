# AccordionSection Specification (how-to · faq · support)

## Overview
- **Target files:**
  - `src/components/sections/accordion-section.tsx` (the reusable block)
  - consumed three times from `page.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-09-accordions.png`
- **Ground-truth CSS:** `docs/research/css/accordion-headline.css`,
  `faq.css`, `steps.css`, `support.css`
- **Ground-truth DOM:** `docs/research/html/09-how-to.html`,
  `10-faq.html`, `11-support.html`
- **Interaction model:** **click-driven**, all three **collapsed on load**.
- **Geometry:** three stacked blocks at y 5847 / 5970 / 6093, **123px each**
  @1440 (76px @390), background `#000`, text `#fff`.

## Structure

```
section#homepage-how-to | #homepage-faq | #homepage-support
  .accordion-headline
    button.accordion-headline__title   aria-expanded, aria-controls
      h2.text.text--subtitle1.text--light
      .accordion-headline__icon  →  TogglePlusIcon
    .accordion-headline__content       id matches aria-controls
```

Each block has a hairline separator; they read as one list.

## Typography
- `h2`: Clarkson 400, 40px / 43.2px, letter-spacing -1.6px, `#fff`
  (`.text-subtitle1`) — confirmed by `getComputedStyle`.
- Body copy: `.text-body`.

## Behavior

- **Trigger:** click the `button.accordion-headline__title`.
- **Open/close:** the same `grid-template-rows: 0fr → 1fr` technique the nav
  accordion uses. Transition:
  `grid-template-rows .7s cubic-bezier(.165,.84,.44,1),
   padding .7s cubic-bezier(.165,.84,.44,1),
   visibility .7s step-end` (`step-start` when opening).
- **Icon:** `TogglePlusIcon` carries an inline `transform: rotate(0deg)` that
  rotates to `45deg` (plus → ×) or `90deg` (plus → minus) on open — read the
  exact value from `faq.css` before choosing.
- Keep `aria-expanded` / `aria-controls` wired correctly.
- Multiple panels may be open at once — this is not a single-select accordion.

## Content (verbatim)

### 1. `homepage-how-to` — "How to build a website"
Three numbered steps (`steps.css`):
1. **Start your free website trial** — To create your own website, choose a professionally designed *website template* or use Squarespace's *AI website builder* to get started in minutes. No credit card required.
2. **Customize your website design** — Make it yours with Squarespace's intuitive *drag-and-drop website platform*. Quickly edit layouts, update fonts and colors, and add your own images and branding.
3. **Add pages and features to your website** — Whether you're building a portfolio or blog, setting up an online store, or promoting professional services and experiences, choose from pre-built page layouts or create your own to fit your content needs.

*Italicised fragments are inline links* — use `Cta variant="inline" underline`.
Hrefs are in the DOM slice.

### 2. `homepage-faq` — "Frequently asked questions"
Four Q&A entries, each itself a nested accordion. Full answer text (with inline
links) is in `docs/research/html/10-faq.html` — transcribe verbatim, do not
summarise:
- How do I create a website with Squarespace?
- Do I need to know how to code to build a website?
- What is a website builder and which one is best for me?
- How much does it cost to create a website?

### 3. `homepage-support` — "24/7 Support"
Link cards with a trailing arrow:
- **Help Center** — Get help from our award-winning Customer Care team.
- **Webinars** — Free online sessions to learn the basics and refine your skills.
- plus any further entries in the DOM slice (Forum, Hire an Expert…).

`.support__links-cta-arrow--hovered` runs
`animation: 1.1s linear infinite supportHoverArrow` — a ±2px horizontal jitter:
`0% translate(0)`, `20%,30% translate(2px)`, `70%,80% translate(-2px)`,
`to translate(0)`. Add the keyframes to the component or `globals.css`.

## Responsive
- **≥744:** title and `+` on one row, generous padding, content indented to the
  grid.
- **<744:** 76px collapsed height, tighter padding, content full width.

## Notes
- Build one `AccordionSection` component taking `{ id, title, children }` and
  render the three variants from `page.tsx`.
- Use `TogglePlusIcon` from `@/components/icons` and `Cta` for links.
- Suppress the transition under `prefers-reduced-motion: reduce`.
