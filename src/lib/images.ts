import manifest from "./image-manifest.json";

/**
 * Responsive `srcset` for the studio's artwork.
 *
 * `scripts/generate-images.py` writes a width ladder per master and records it
 * in image-manifest.json; reading srcset from that file means a width can
 * never be referenced that was not generated. `w` descriptors rather than
 * fixed widths, so the browser picks on viewport and pixel ratio both.
 */

const DIR = "/images";

const WIDTHS: Record<string, number[]> = manifest;

/** Every generated width for `name`, as a `srcset`. */
export function srcSet(name: string) {
  const widths = WIDTHS[name];
  if (!widths) throw new Error(`No generated media for "${name}"`);
  return widths.map((w) => `${DIR}/${name}-${w}.webp ${w}w`).join(", ");
}

/** The middle of the ladder, for the `src` a browser without srcset uses. */
export function fallbackSrc(name: string) {
  const widths = WIDTHS[name];
  if (!widths) throw new Error(`No generated media for "${name}"`);
  return `${DIR}/${name}-${widths[Math.min(2, widths.length - 1)]}.webp`;
}

/**
 * How wide each card renders, as `sizes`. `sizes` cannot read a custom
 * property, so these are the sections' spans written as viewport units.
 */
export const SIZES = {
  /** Capabilities: full bleed on a phone, a span of 8 from 1020px. */
  capability: "(min-width: 1020px) 63vw, 100vw",
  /** Industries: a span of 3 at 1280, 4 at 1020, 5 at 744, full below. */
  industry:
    "(min-width: 1280px) 22vw, (min-width: 1020px) 30vw, (min-width: 744px) 37vw, 92vw",
  /** Work thumbnails: a fixed 240px strip on a phone, a span of 2.5 above. */
  project: "(min-width: 1020px) 18vw, 240px",
} as const;
