# OnePlatformSection Specification

## Overview
- **Target file:** `src/components/sections/one-platform-section.tsx`
- **Screenshot:** `docs/design-references/desktop-1440-04-one-platform.png`,
  `mobile-390-03-one-platform.png`
- **Ground-truth CSS:** `docs/research/css/one-platform.css`,
  `card-carousel.css`, `card-carousel-card.css`, `controls.css`,
  `paging-indicator.css`
- **Ground-truth DOM:** `docs/research/html/04-one-platform.html` (251 lines)
- **Interaction model:** **click-driven** horizontal card carousel — prev/next
  arrows plus a paging indicator. No pills, no autoplay toggle.
- **Geometry:** y 2466, height 776 @1440 (757 @390). Background `#fff`, text `#000`.

## Structure

```
section#one-platform.one-platform
  .headline                       (left-aligned on desktop, body sits right)
    h2  "Everything you need on one platform"
    p   "Power your day-to-day with all the tools and AI guidance you need to
         manage your business, seamlessly integrated in one place."
  .card-carousel
    .card-carousel__cards  →  .card-carousel-card × 9
    .card-carousel__controls   prev / next  +  paging dots
```

## Typography

| Element | Value |
| --- | --- |
| `h2` | Clarkson 400, 40px / 43.2px, letter-spacing -1.6px, `#000` (`.text-subtitle1`) |
| body | `.text-body`, `#000` |
| card title | `.text-subtitle3` — 18px→20px, weight 500, `#fff` |
| card body | `.text-body`, `#fff` |

The headline block is two columns on desktop: title left, body right
(see the `.headline` rules and `--grid-column-width` spans).

## Cards (verbatim, in DOM order)

| Title | Body | Media |
| --- | --- | --- |
| Website Editing | Easily customize every design detail with our next-generation drag-and-drop editor. | `website-editing.webp` |
| Design Intelligence | Your AI creative partner to generate designs, images, and content tailored just for you. | **`design-intelligence-3.mp4`** (video) |
| Business Email | Make your business official with Business Email from Google Workspace. | `business-email.jpg` |
| Domains | Register your dream domain. Free WHOIS privacy, SSL, and premium DNS included. | `domains.webp` |
| Extensions | Streamline shipping, inventory, marketing, and finance with powerful third-party extensions. | `extensions.webp` |
| Squarespace Payments | Accept multiple payment options, manage transactions, and accelerate payouts. | `payment-2.webp` |
| Squarespace Capital | Fast, flexible financing to expand your team, boost inventory, and more. | `capital.webp` |
| Analytics | Track your website's performance with key traffic and ecommerce metrics. | `analytics.webp` |
| Search & AI Optimization | Increase traffic from search and AI platforms with built-in SEO and AI site auditing tools. | `ai-seo.webp` |

All media is in `public/images/components/card-carousel/`.

> **Design Intelligence is a video, not an image.** Render a `<video autoplay
> muted loop playsInline>` with `design-intelligence-3.webp` as the poster. Do
> not rebuild its contents as HTML.
>
> `payment-2` exists only as `.webp` — the `.jpg` variant 404s on Squarespace's
> own CDN. Use the webp directly.

## Card anatomy

- Dark card, `border-radius` per `card-carousel-card.css`.
- Title + body stacked at the top with padding; media fills the lower area.
- `ArrowRightIcon` bottom-right (`.card-carousel-card__arrow`), each card links
  to its product page — hrefs are in the DOM slice.

## Controls
- Prev: `ChevronDownIcon` rotated (the site reuses the 16×16 chevron,
  `.card-carousel__control--prev`, `aria-label="Previous slide"`).
- Next: `.card-carousel__control--next`, `aria-label="Next slide"`.
- Paging dots sit centre-left of the control row; the active dot is a wide pill.

## Responsive
- **≥1280:** 4 cards visible.
- **744–1279:** ~2.5 cards visible.
- **<744:** 1 card, swipeable; controls move below.

## Notes
- Import `ArrowRightIcon`, `ChevronDownIcon` from `@/components/icons`,
  `Reveal` from `@/components/ui/reveal`.
- Headline and body carry inline `opacity: 0` in the source — wrap in `Reveal`.
