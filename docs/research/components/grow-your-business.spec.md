# GrowYourBusinessSection Specification

## Overview
- **Target file:** `src/components/sections/grow-your-business-section.tsx`
- **Screenshots:** `docs/design-references/desktop-1440-03-grow-your-business.png`,
  `mobile-390-02-grow-your-business.png`
- **Ground-truth CSS:** `docs/research/css/grow-your-business.css`,
  `king-carousel.css`, `pills.css`, `controls.css`, `paging-indicator.css`
- **Ground-truth DOM:** `docs/research/html/03-grow-your-business.html` (575 lines)
- **Interaction model:** **click-driven** — 8 pills map 1:1 onto 8 carousel
  cards. Clicking a pill slides the carousel to that card. The carousel also
  auto-advances and has a pause/play toggle.
- **Geometry:** y 1375, height 1091 @1440 (932 @390). Background `#fff`, text `#000`.

## Structure

```
section#grow-your-business.grow-your-business
  .headline.headline--centered
    h2   "Grow your business"
    p    "You deserve a website that can do it all."
  .pills-container
    ul.pills                    style="--background-color: rgba(0,0,0,0.05)"
      li.pills__pill-container × 8  →  button.cta.cta--inline.pills__pill
      .pills__pill-indicator        the sliding highlight
  .king-carousel
    .king-carousel__cards
      .king-carousel__card × 8
        a.king-carousel__card-cta
          picture > img.king-carousel__card-background-image
          h3.king-carousel__card-title      Clarkson Serif
          p.king-carousel__card-body
          p.king-carousel__card-footnote    "Great for: …"
          p.king-carousel__card-arrow       →
    .controls   prev / next / pause  +  paging dots
```

## Typography (computed at 1440)

| Element | Value |
| --- | --- |
| `h2` | Clarkson 400, 40px / 43.2px, letter-spacing **-1.6px** (-0.04em), `#000` — i.e. `.text-subtitle1` |
| body `p` | `.text-body` — 15px / 1.4 |
| card `h3` | **Clarkson Serif** 400, 26px / 28.08px, letter-spacing **-0.52px**, `#fff` — `.text-subtitle2` + `text--font-clarkson-serif` |
| card body | `.text-body`, `#fff` |
| card footnote | `.text-footnote` — 12px / 1.4 |
| card arrow | `.text-subtitle3` |

The card title is the **only serif on the page** — use `font-clarkson-serif`.

## Pills → cards (1:1, in order)

| # | Pill | Card title | href | Image basename |
| --- | --- | --- | --- | --- |
| 1 | Services | Offer services | `/services` | `services` |
| 2 | Online Store | Sell products | `/online-stores` | `online-store` |
| 3 | Invoicing | Invoice clients | `/invoicing` | `invoicing` |
| 4 | Scheduling | Get booked | see DOM | `scheduling` |
| 5 | Donations | Collect donations | see DOM | `donations` |
| 6 | Memberships | Monetize your content | see DOM | `memberships` |
| 7 | Blog | Post your ideas | see DOM | `blog` |
| 8 | Portfolio | Showcase your work | see DOM | `portfolio` |

Images live in `public/images/pages/homepage-2025/grow-your-business/` with
`-desktop` and `-mobile` variants (e.g. `services-desktop.webp`,
`services-mobile.jpg`). Confirm each exact filename against the DOM slice.

## Card copy (verbatim)

- **Offer services** — Promote your experiences and offerings, collect attendee information, and get paid for your work. · *Great for: Camps · Consultants · Event Organizers*
- **Sell products** — Merchandise your products, accept payments, manage orders and shipping, and more. · *Great for: Artisans · Retailers · Limited Releases*
- **Invoice clients** — Legitimize your business and get paid with professional proposals, contracts, and invoices. · *Great for: Contractors · Freelancers · Event Planners*
- **Get booked** — Seamless appointment booking, automated calendar management, and integrated payments. · *Great for: Beauty Professionals · Wellness Providers · Photographers*
- **Collect donations** — Create fundraising campaigns, accept donations on your website, and send donors targeted emails. · *Great for: Advocacy Groups · Non-profits · Fundraisers*
- **Monetize your content** — Offer exclusive access to your work, earn recurring revenue, and engage with your community. · *Great for: Instructors · Content Creators · Community Leaders*
- **Post your ideas** — Launch a blog, grow your readership, and add paywalls to monetize access. · *Great for: Food Writers · Wellness Coaches · Travel Influencers*
- **Showcase your work** — transcribe from the DOM slice.

## States & behaviors

### Pill indicator
`.pills__pill-indicator` is one element that **scales and slides** to match the
active label, not a per-pill background. Observed mid-transition computed value:
`transform: matrix(0.955746, 0, 0, 1, -229…, 0)` — i.e.
`scaleX(w_active / w_base)` plus `translateX(offset)`.
Measure the active pill's `offsetLeft` / `offsetWidth` and drive
`transform: translateX(Xpx) scaleX(S)`. Track background is
`--background-color: rgba(0,0,0,0.05)`.

### Carousel
- Cards are absolutely positioned with `width: 101%` and `left: -800%`,
  `-700%`, `-600%` … one step per index. Selecting index *n* shifts the track.
- `data-is-active` on `.king-carousel__card-cta` marks the current card;
  inactive cards get `tabindex="-1"` — keep that for accessibility.
- Auto-advance with a pause/play toggle using `PauseIcon` / `PlayIcon`.
- Prev/next use `ArrowLeftIcon` / `ArrowRightIcon`.
- Paging dots: the active dot is a wider pill, not a larger circle — see
  `paging-indicator.css`.

### Reveal
Headline, body and each `.pills__pill-container` are server-rendered with
`opacity: 0`. Wrap in `Reveal`.

## Responsive
- **≥1280:** one large centre card with the neighbours peeking in at the edges.
- **744–1279:** narrower centre card, same layout.
- **<744:** single card at near-full width; the pill row becomes a horizontal
  scroller; a full-width `GET STARTED` sits under the card.

## Notes
- Import `Cta`, `Reveal`, and the arrow/pause/play icons.
- Respect `prefers-reduced-motion`: stop auto-advance and drop the slide
  transition.
