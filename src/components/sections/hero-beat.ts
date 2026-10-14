/**
 * The hero's clock. Timings are unitless seconds; the `.tws-beat` utility in
 * globals.css turns them into delay and duration by multiplying with
 * `--beat-rate`, the one value `prefers-reduced-motion` changes.
 */

/** One element's slot in an entrance. */
export function beat(t: number, d: number, e: string): React.CSSProperties {
  return { "--beat-t": t, "--beat-d": d, "--beat-e": e } as React.CSSProperties;
}

export const EASE = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  drift: "cubic-bezier(0.37, 0.19, 0.25, 0.98)",
  /** The curve the rest of the site reveals headlines on. */
  reveal: "cubic-bezier(0.23, 1, 0.32, 1)",
} as const;
