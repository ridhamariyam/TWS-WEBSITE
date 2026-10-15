# Content map

The holding page is served at `/` until `SITE_LAUNCHED=true`. The full site
remains in the App Router for development and launch preparation.

| Route | Components and content |
| --- | --- |
| `/` before launch | `app/coming-soon/`, `components/coming-soon/`, `lib/social-profiles.ts` |
| `/` after launch | `components/flow/`: `FlowPreloader`, `HeroStage`, `ParticleDive`, `Manifesto`, `StudioScenes`, `FlowOutro` |
| `/about` | Flow components; `lib/studio-content.ts`, `lib/process-content.ts`, `lib/team-content.ts` |
| `/services` | Flow components; `lib/services-content.ts` |
| `/services/[slug]` | Flow components; `lib/service-pages.ts` |
| `/contact` | Flow components; `lib/site-links.ts`, `lib/studio-location.ts`, `lib/social-profiles.ts` |
| `/contact/start-a-project` | Colocated form and server action; `lib/contact-schema.ts`, `lib/contact-mail.ts` |
| `/work`, `/work/[slug]` | Work components; `lib/work-content.ts` |
| `/portfolio` | `components/portfolio/`; real projects from `lib/work-content.ts` |
| `/blogs` | Shared section components; `lib/insights-content.ts` |
| `/faq` | Shared section components; `lib/faq-content.ts` |

`/work`, its project pages, `/portfolio`, `/blogs` and `/faq` redirect to `/`
in both launch states. They are intentionally retained routes, not unused
components. `next.config.ts` controls the redirects.

Navigation destinations and studio contact details live in
`lib/site-links.ts`. Page metadata and structured data live in `lib/seo.ts`;
the sitemap and robots handlers live in `app/`.

Artwork requested by a page uses `lib/images.ts` and its generated manifest.
The flow's named colour swatches are generated in CSS; their names do not
refer to image files. See the root README for asset generation.

The contact form sends enquiries through SMTP, with a composed-email fallback
when delivery is unavailable. Setup is in [contact-email.md](contact-email.md).

TWS opened in 2026. Do not invent clients, testimonials, metrics, awards or
outcomes. Projects must retain their current status until it changes.
