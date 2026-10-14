# Content map

Where each part of the TWS copy deck lives, in page order. Section IDs are the
DOM ids on the homepage.

| # | Section | DOM id | Copy deck |
| --- | --- | --- | --- |
| 1 | `hero-section.tsx` + `hero-stats.tsx` | `hero` | Hero |
| 2 | `grow-your-business-section.tsx` | `capabilities` | 02 — Capabilities |
| 3 | `one-platform-section.tsx` | `industries` | 05 — Industries |
| 5 | `get-started-section.tsx` | `selected-work` | 04 — Selected work |
| 6 | `your-domain-section.tsx` | `proposition` | 01 — The point |
| 7 | `keep-in-touch-section.tsx` | `keep-in-touch` | — (interaction) |
| 8 | `customers-served-section.tsx` | `studio` | 03 — Why TWS |
| 9 | `video-takeover-section.tsx` | `studio-in-motion` | — (scroll takeover) |
| 10 | `homepage-accordions.tsx` | `homepage-process` | 06 — The process |
| 11 | `homepage-accordions.tsx` | `homepage-insights` | 09 — Insights |
| 12 | `homepage-accordions.tsx` | `homepage-studio` | 07 — The studio |
| 13 | `conversion-cta-section.tsx` | `start-a-project` | 10 — Start something |
| 14 | `site-footer.tsx` | `footer` | Footer |

Inner pages: `/work` and `/work/[slug]` (project pages), `/services`,
`/about`, `/contact` (enquiry form + server action).

Content data lives in `src/lib/`: `work-content.ts`, `services-content.ts`,
`nav-content.ts`, `footer-content.ts`, `process-content.ts`,
`insights-content.ts`, `contact-form.ts`.

## Rules this content follows

TWS opened in 2026. Nothing on the site may imply a longer history:
no invented clients, testimonials, metrics or awards, no placeholder logos,
and no outcome section for work that has not launched. Projects are labelled
for what they are and say when they are still in build.

## Placeholders to replace

- Social URLs in `footer-content.ts` are guesses.
- Budget bands on `/contact` are placeholders, not a pricing decision.
- `/contact` has no mail service behind it: the action validates and screens
  submissions, then hands the enquiry to the sender's own mail client. Set
  `CONTACT_WEBHOOK_URL` to deliver for real.
- Inner routes under `/services#…` and `/industries/…` referenced from the
  navigation resolve to anchors on existing pages, not to new routes.
