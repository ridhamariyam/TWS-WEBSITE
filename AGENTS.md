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
- Image basenames are the capability or project id they belong to.
  Flow colour swatches use stable names and do not load image files.
- Brand marks are generated from `assets/brand/tws-logo-source.png` by
  `scripts/generate-brand-assets.py`.

## Launch
Until launch `/` serves the holding page (`src/app/coming-soon/`) and every
other page redirects to it. All videos remain excluded from deployment.
To launch: verify usage rights for the remaining films, remove the
`public/videos/` line from `.vercelignore`, set `SITE_LAUNCHED=true` in the
Vercel project's environment, and redeploy. Work, portfolio, blog and FAQ
routes stay hidden until removed from `HIDDEN_PAGES` in `next.config.ts`.

The old unlicensed reference films, third-party layout placeholders and
template research have been removed. Do not reintroduce them.

## Project Structure
```
src/
  app/              Routes, including /work/[slug] project pages
  components/
    coming-soon/    Holding page intro
    flow/           Scroll stages and shared flow page components
    layout/         Navigation, footer, page shells and site controls
    portfolio/      Full-screen portfolio viewer
    sections/       Work grid and shared FAQ/blog sections
    ui/             Shared primitives (cta, reveal, rich text, logo, icons)
    work/           Project cards and case-study controls
  lib/              Content, links, metadata and email logic
  types/            Shared content shapes
  hooks/            Custom hooks
public/
  images/           Web-sized artwork the pages load
  icons/ seo/       Brand marks and OG image
  videos/           Hero and project films with their posters
assets/
  brand/            Source logo
  images/           Capability and project image masters
  videos/           Source films and project recordings
docs/               Content map, email setup and brand kit
scripts/            Image, brand and film generation
```
