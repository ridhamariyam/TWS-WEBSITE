/**
 * Generates every placeholder image used on the homepage.
 *
 * The reference layout's photography, logo, award marks and client logos are
 * proprietary, so nothing is downloaded. These original grayscale SVG
 * compositions stand in at the exact natural sizes measured from the reference,
 * so every crop, aspect ratio and hover zoom keeps its footprint. Swap them for
 * real TWS imagery before launch.
 *
 * Run with: node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../public/images");

const INK = "#1c1d1f";
const LIME = "#beff01";

/** Deterministic pseudo-random so regenerating produces identical files. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const gray = (v) => {
  const c = Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${c},${c},${c})`;
};

function svg(w, h, body, defs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
<defs>${defs}</defs>
${body}
</svg>
`;
}

/**
 * Grayscale "studio still life": lit backdrop, floor plane, soft shadow and one
 * of a handful of simple objects (block, disc, card stack, jar, sphere).
 */
function stillLife(w, h, seed) {
  const r = rng(seed);
  const base = 200 + r() * 30;
  const angle = Math.round(r() * 60 - 30);
  const horizon = h * (0.55 + r() * 0.15);
  const cx = w * (0.38 + r() * 0.24);
  const cy = horizon + (h - horizon) * 0.25;
  const size = Math.min(w, h) * (0.26 + r() * 0.12);
  const kind = Math.floor(r() * 5);
  const id = `s${seed}`;
  const defs = `
  <linearGradient id="${id}bg" gradientTransform="rotate(${angle} .5 .5)">
    <stop offset="0" stop-color="${gray(base + 18)}"/><stop offset="1" stop-color="${gray(base - 26)}"/>
  </linearGradient>
  <linearGradient id="${id}obj" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${gray(90 + r() * 60)}"/><stop offset="1" stop-color="${gray(25 + r() * 30)}"/>
  </linearGradient>
  <radialGradient id="${id}sh"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <filter id="${id}blur"><feGaussianBlur stdDeviation="${Math.round(size * 0.05)}"/></filter>`;

  let object = "";
  if (kind === 0) {
    object = `<rect x="${cx - size * 0.7}" y="${cy - size * 0.55}" width="${size * 1.4}" height="${size * 0.7}" rx="${size * 0.12}" fill="url(#${id}obj)"/>
  <rect x="${cx - size * 0.7}" y="${cy - size * 0.55}" width="${size * 1.4}" height="${size * 0.16}" rx="${size * 0.08}" fill="#fff" opacity=".18"/>`;
  } else if (kind === 1) {
    object = `<ellipse cx="${cx}" cy="${cy - size * 0.1}" rx="${size * 0.8}" ry="${size * 0.32}" fill="url(#${id}obj)"/>
  <ellipse cx="${cx}" cy="${cy - size * 0.18}" rx="${size * 0.62}" ry="${size * 0.22}" fill="${gray(base - 40)}"/>`;
  } else if (kind === 2) {
    object = [0, 1, 2]
      .map((i) => `<rect x="${cx - size * 0.75 + i * size * 0.12}" y="${cy - size * 0.5 - i * size * 0.14}" width="${size * 1.2}" height="${size * 0.75}" rx="6" fill="${gray(235 - i * 70)}" transform="rotate(${-8 + i * 6} ${cx} ${cy})"/>`)
      .join("\n  ");
  } else if (kind === 3) {
    object = `<rect x="${cx - size * 0.4}" y="${cy - size * 1.05}" width="${size * 0.8}" height="${size * 1.05}" rx="${size * 0.14}" fill="url(#${id}obj)"/>
  <rect x="${cx - size * 0.42}" y="${cy - size * 1.2}" width="${size * 0.84}" height="${size * 0.22}" rx="${size * 0.06}" fill="${gray(40)}"/>
  <rect x="${cx - size * 0.26}" y="${cy - size * 0.72}" width="${size * 0.52}" height="${size * 0.36}" rx="4" fill="#fff" opacity=".55"/>`;
  } else {
    object = `<circle cx="${cx}" cy="${cy - size * 0.55}" r="${size * 0.55}" fill="url(#${id}obj)"/>
  <circle cx="${cx - size * 0.18}" cy="${cy - size * 0.75}" r="${size * 0.14}" fill="#fff" opacity=".22"/>`;
  }

  const body = `<rect width="${w}" height="${h}" fill="url(#${id}bg)"/>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="#000" opacity=".06"/>
  <polygon points="${w * 0.1},0 ${w * 0.45},0 ${w * 0.9},${h} ${w * 0.55},${h}" fill="#fff" opacity=".07"/>
  <ellipse cx="${cx + size * 0.2}" cy="${cy + size * 0.05}" rx="${size * 1.1}" ry="${size * 0.22}" fill="url(#${id}sh)" filter="url(#${id}blur)"/>
  ${object}`;
  return svg(w, h, body, defs);
}

/** Wide grayscale "workspace" scene for the about section: window light, desk, soft bokeh. */
function workspace(w, h, seed) {
  const r = rng(seed);
  const bokeh = Array.from({ length: 14 }, () => {
    const rad = 30 + r() * 120;
    return `<circle cx="${Math.round(r() * w)}" cy="${Math.round(r() * h * 0.6)}" r="${Math.round(rad)}" fill="${gray(150 + r() * 100)}" opacity="${(0.15 + r() * 0.35).toFixed(2)}"/>`;
  }).join("\n  ");
  const defs = `
  <linearGradient id="ws-bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${gray(70)}"/><stop offset=".55" stop-color="${gray(215)}"/><stop offset="1" stop-color="${gray(240)}"/></linearGradient>
  <filter id="ws-blur"><feGaussianBlur stdDeviation="18"/></filter>`;
  const body = `<rect width="${w}" height="${h}" fill="url(#ws-bg)"/>
  <g filter="url(#ws-blur)">
  ${bokeh}
  <rect x="${w * 0.62}" y="0" width="${w * 0.3}" height="${h * 0.7}" fill="#fff" opacity=".5"/>
  </g>
  <rect x="0" y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="${gray(55)}"/>
  <rect x="0" y="${h * 0.74}" width="${w}" height="10" fill="${gray(120)}"/>
  <rect x="${w * 0.36}" y="${h * 0.46}" width="${w * 0.3}" height="${h * 0.26}" rx="10" fill="${gray(30)}"/>
  <rect x="${w * 0.375}" y="${h * 0.475}" width="${w * 0.27}" height="${h * 0.2}" rx="4" fill="${gray(185)}"/>
  <rect x="${w * 0.33}" y="${h * 0.72}" width="${w * 0.36}" height="16" rx="6" fill="${gray(90)}"/>
  <circle cx="${w * 0.8}" cy="${h * 0.69}" r="${h * 0.05}" fill="${gray(235)}"/>
  <rect x="${w * 0.79}" y="${h * 0.6}" width="${w * 0.02}" height="${h * 0.09}" fill="${gray(200)}"/>`;
  return svg(w, h, body, defs);
}

/** Original TWS monogram: ink disc, white "T" stem-and-bar glyph, lime accent dot. */
function brandMark(color = INK, glyph = "#fff") {
  const body = `<circle cx="50" cy="62" r="50" fill="${color}"/>
  <rect x="26" y="40" width="44" height="12" rx="6" fill="${glyph}"/>
  <rect x="42" y="40" width="12" height="48" rx="6" fill="${glyph}"/>
  <circle cx="80" cy="20" r="12" fill="${LIME}"/>`;
  return svg(100, 112, body);
}

/** Neutral text wordmark on a transparent canvas. */
function wordmark(w, h, text, { color = INK, weight = 700, size = 0.72, glyph = "circle", tracking = -0.5 } = {}) {
  const fs = Math.round(h * size);
  const g = glyph === "circle"
    ? `<circle cx="${h * 0.45}" cy="${h / 2}" r="${h * 0.34}" fill="${color}"/>`
    : glyph === "square"
      ? `<rect x="${h * 0.11}" y="${h * 0.16}" width="${h * 0.68}" height="${h * 0.68}" rx="${h * 0.16}" fill="${color}"/>`
      : `<path d="M${h * 0.1} ${h * 0.82} L${h * 0.45} ${h * 0.18} L${h * 0.8} ${h * 0.82} Z" fill="${color}"/>`;
  const body = `${g}
  <text x="${h * 1.05}" y="${h * 0.74}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${fs}" font-weight="${weight}" letter-spacing="${tracking}" fill="${color}">${text}</text>`;
  return svg(w, h, body);
}

/** Dotted "globe" texture for the dark testimonial band: dots fade out toward the edges. */
function dotField(w, h, seed) {
  const r = rng(seed);
  const step = 9;
  const dots = [];
  const blobs = Array.from({ length: 6 }, () => [r() * w, r() * h, 120 + r() * 260]);
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      const inside = blobs.some(([bx, by, br]) => (x - bx) ** 2 + ((y - by) * 1.4) ** 2 < br ** 2);
      if (inside && r() > 0.18) dots.push(`<circle cx="${x}" cy="${y}" r="1.6"/>`);
    }
  }
  return svg(w, h, `<g fill="#ffffff" opacity=".22">${dots.join("")}</g>`);
}

const files = {
  "brand/tws-mark.svg": brandMark(),
  "brand/tws-mark-white.svg": brandMark("#ffffff", INK),
  "about/workspace.svg": workspace(945, 785, 7),
  "testimonials/dot-field.svg": dotField(1440, 601, 5),
};

for (let i = 0; i < 8; i++) {
  files[`projects/project-0${i + 1}.svg`] = stillLife(800, 635, 101 + i * 37);
}
for (let i = 0; i < 4; i++) {
  files[`blog/post-0${i + 1}.svg`] = stillLife(597, 430, 503 + i * 41);
}

[
  ["Honorline", "circle"],
  ["Pixelboard", "square"],
  ["Studiorank", "triangle"],
].forEach(([name, glyph], i) => {
  files[`awards/award-0${i + 1}.svg`] = wordmark(170, 30, name, { glyph, weight: 700, size: 0.66 });
});

// Client logos keep the reference's rendered aspect ratios at 35px tall.
[
  ["Northwind", 146, "circle"],
  ["Globex", 128, "square"],
  ["Initech", 104, "triangle"],
  ["Vandelay", 150, "circle"],
  ["Umbra", 116, "square"],
].forEach(([name, width, glyph], i) => {
  files[`clients/client-0${i + 1}.svg`] = wordmark(width * 4, 140, name, { color: "#ffffff", glyph, weight: 800, size: 0.62 });
});

await Promise.all(
  Object.entries(files).map(async ([name, contents]) => {
    const target = resolve(outDir, name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents, "utf8");
  }),
);

console.log(`Wrote ${Object.keys(files).length} placeholder images to public/images/`);
