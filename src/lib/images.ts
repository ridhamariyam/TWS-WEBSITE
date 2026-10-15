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
