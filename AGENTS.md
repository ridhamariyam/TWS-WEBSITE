<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TWS — The Web Studio

The studio's own website. Next.js App Router, React, TypeScript, Tailwind CSS v4.

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes; CSS Modules for anything with its own animation
- 2-space indentation
- Responsive: mobile-first, using the `bp*` breakpoints in `globals.css`

## Content rules
TWS opened in 2026 and is a new studio. The site must never imply otherwise.

- No invented clients, testimonials, metrics, revenue figures or awards.
- No placeholder logos standing in for clients.
- Label work for what it is, and say when something is still in build.
- A claim goes on the site only if it is true today. If there is no outcome
  yet, there is no outcome section.

## Assets
- Everything in `public/` must be TWS's own or properly licensed. The site was
  scaffolded from a website-cloning template; the copied assets, fonts and
  captured source have been removed. Do not reintroduce them.
- Fonts come from `next/font` (Inter, SIL OFL). Do not add a font without
  checking its licence.
- Masters live in `assets/images/`, which is not served. The sized
  derivatives the site loads are generated into `public/images/` by
  `scripts/generate-images.py`. Nothing goes in `public/` unless a page
  requests it by URL: it is all uploaded on every deploy.
- Image basenames are the service, industry or project id they belong to, so
  a component's `image:` field is the id of the thing it shows.
- Brand marks are generated from `public/icons/` by
  `scripts/generate-brand-assets.py`.

## Known debt
`public/videos/studio-film.mp4` is the footage behind the scroll takeover on
the homepage. It came into the repo as a motion reference, not as licensed
material, and its provenance has not been established. It needs a licence on
file or replacing with the studio's own film. Until then it stays out of git
and out of every deploy (`.gitignore`, `.vercelignore`), as does
`public/videos/refernce.webm`.

## Launch
Until launch `/` serves the holding page (`src/app/coming-soon/`) and every
other page redirects to it. To launch: settle the film above, remove the
`public/videos/` line from `.vercelignore`, set `SITE_LAUNCHED=true` in the
Vercel project's environment, and redeploy.

## Project Structure
```
src/
  app/              Routes, including /work/[slug] project pages
  components/
    layout/         Header, footer, page shell, dust run
    sections/       Homepage sections, each with its own CSS Module
    ui/             Shared primitives (cta, reveal, logo, icons, particles)
  lib/              Content data and site-wide links
  types/            Shared content shapes
  hooks/            Custom hooks
public/
  images/           Web-sized artwork the pages load
  icons/ seo/       Brand marks and OG image
  videos/           The takeover film, the card film, and their posters
assets/images/      Masters, by group: capabilities, industries, work
docs/               Content map and archived research
scripts/            Image and brand asset generation
```
