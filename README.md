# TWS — The Web Studio

The studio website, built with Next.js App Router, React, TypeScript and
Tailwind CSS v4.

## Development

Use Node.js 24 (`.nvmrc`), install dependencies with `npm ci`, then run
`npm run dev`. Copy `.env.example` to `.env.local` for local SMTP settings.
See [contact email setup](docs/contact-email.md).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, including unused locals and parameters |
| `npm run check` | Lint, typecheck and production build |

## Structure

```text
src/
  app/                  Routes, metadata, global styles and the contact form
  components/
    coming-soon/        Holding page intro
    flow/               Scroll stages and shared flow page components
    layout/             Navigation, footer, page shells and site controls
    portfolio/          Full-screen portfolio viewer
    sections/           Work grid and shared FAQ/blog sections
    ui/                 Buttons, links, rich text, icons, logo and reveals
    work/               Project cards and case-study controls
  hooks/                Shared hooks
  lib/                  Content, links, metadata and email logic
  types/                Shared content types
assets/
  brand/                Source logo
  images/               Capability and project image masters
  videos/               Source films and project recordings
public/
  icons/                Logo and mask requested by components
  images/               Generated responsive WebP images
  seo/                  Browser icons and share image
  videos/               Requested films and posters
scripts/                Media generation
docs/                   Content map, email setup and brand kit
```

The [content map](docs/content-map.md) connects each route to its content.
The [brand kit](docs/brand-kit.pdf) is retained as a source document.

## Assets

Keep masters in `assets/`, outside the publicly served directory. Only files
requested by a page belong in `public/`. Commit generated media together with
the code that requests it; image filenames use their capability or project ID.
CSS colour swatches do not require corresponding image files.

| Generator | Input | Output | Requirements |
| --- | --- | --- | --- |
| `python3 scripts/generate-images.py` | `assets/images/` | `public/images/`, `src/lib/image-manifest.json` | Pillow |
| `python3 scripts/generate-brand-assets.py` | `assets/brand/tws-logo-source.png` | Logo, favicon and SEO images | Pillow, fonttools, brotli; run a build first for the site font |
| `bash scripts/generate-studio-films.sh` | Project recordings in `assets/videos/` | PEN desktop and ZEEN films with posters | ffmpeg |
| `python3 scripts/generate-hero-film.py` | `assets/videos/hero-film-master.mov` | Landscape hero film and poster | ffmpeg, NumPy, Pillow, torch, spandrel, einops, safetensors |

The hero generator downloads model weights into an ignored cache on first run.
Generators run locally; Vercel receives the committed derivatives and excludes
masters, scripts and documentation.

## Launch

`SITE_LAUNCHED` defaults to false. `/` serves the holding page and the main
site routes redirect there. Keep `public/videos/` excluded in `.vercelignore`
while preparing the launch. Before enabling the full site, verify the remaining
films' usage rights, remove that exclusion, set `SITE_LAUNCHED=true` in the
deployment environment and redeploy.

Work, portfolio, blog and FAQ routes remain hidden in both states until their
entries are removed from `HIDDEN_PAGES` in `next.config.ts`.
