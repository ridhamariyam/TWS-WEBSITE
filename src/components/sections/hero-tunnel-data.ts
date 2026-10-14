/**
 * The hero tunnel's geometry and clock, shared by the two layers that draw it:
 * the one-shot overlay and the loop behind the copy. Both run the same frames
 * on the same beats, so the handover is in phase and cannot be seen.
 *
 * No directive: the overlay is a server component, the loop a client one.
 */

/** Seconds for one frame to travel the full depth of the tunnel. */
export const CYCLE = 2.4;

/**
 * Gap between frames entering. Exactly `CYCLE / FRAMES.length`, which is what
 * keeps the tunnel evenly populated and the loop seamless.
 */
export const STAGGER = Number((CYCLE / 12).toFixed(4));

/**
 * When the wall opens, and for how long. The intro is budgeted, not styled:
 * closed for 0.7s, open by 1.5s, last line landed at 1.99s. Nothing is
 * withheld longer than `INTRO_SECONDS`.
 */
export const OPEN_AT = 0.7;
export const OPEN_FOR = 0.8;

/** The whole intro's length. `HeroIntro` waits this long before marking it seen. */
export const INTRO_SECONDS = 2;

/**
 * One frame's slot. A whole cycle early on purpose: a negative delay starts
 * the animation part way through, so the first painted frame is already a full
 * travelling tunnel rather than an empty rectangle.
 *
 * Both layers share it, which is what keeps them in phase — they differ by a
 * whole number of cycles and the loop repeats forever.
 */
export const frameBeat = (i: number) => Number((i * STAGGER - CYCLE).toFixed(4));

/** The curve of a camera moving at a steady rate: distance accelerates. */
export const PUSH = "cubic-bezier(0.55, 0, 0.85, 0.36)";
/** The handover: gathers pace, then eases as the frame clears the viewport. */
export const OPEN = "cubic-bezier(0.66, 0, 0.2, 1)";

export const LIME = "#c7ff2f";
export const SECONDARY = "rgba(255,255,255,0.15)";

export type Frame = {
  /** Width and height in vmin. */
  fw: number;
  fh: number;
  /** Corner radius, as a share of the box. */
  rad: number;
  /** Centre drift in vmin: near-concentric, not exactly so. */
  ox: number;
  oy: number;
  rot: number;
  op: number;
  lime: boolean;
};

/*
 * Deterministic, so server and client agree. The variation is small on
 * purpose: enough that the nest is not perfect, not enough to read as wobble.
 */
export const FRAMES: Frame[] = [
  { fw: 30, fh: 42, rad: 28, ox: 0.0, oy: 0.0, rot: 0.0, op: 0.5, lime: true },
  { fw: 31, fh: 43, rad: 30, ox: -0.6, oy: 0.4, rot: -0.4, op: 0.15, lime: false },
  { fw: 29, fh: 41, rad: 27, ox: 0.5, oy: -0.5, rot: 0.5, op: 0.62, lime: true },
  { fw: 32, fh: 44, rad: 31, ox: 0.2, oy: 0.7, rot: 0.2, op: 0.15, lime: false },
  { fw: 30, fh: 42, rad: 29, ox: -0.9, oy: -0.3, rot: -0.6, op: 0.42, lime: true },
  { fw: 31, fh: 40, rad: 26, ox: 0.7, oy: 0.2, rot: 0.3, op: 0.68, lime: true },
  { fw: 29, fh: 43, rad: 30, ox: -0.3, oy: -0.7, rot: -0.2, op: 0.15, lime: false },
  { fw: 32, fh: 41, rad: 28, ox: 0.4, oy: 0.5, rot: 0.6, op: 0.35, lime: true },
  { fw: 30, fh: 44, rad: 32, ox: -0.5, oy: 0.1, rot: -0.3, op: 0.56, lime: true },
  { fw: 31, fh: 42, rad: 27, ox: 0.8, oy: -0.4, rot: 0.4, op: 0.15, lime: false },
  { fw: 29, fh: 40, rad: 29, ox: -0.2, oy: 0.6, rot: -0.5, op: 0.46, lime: true },
  { fw: 32, fh: 43, rad: 31, ox: 0.3, oy: -0.2, rot: 0.2, op: 0.28, lime: true },
];

/** The inline custom properties one frame needs, in either layer. */
export function frameVars(frame: Frame): React.CSSProperties {
  return {
    "--fw": `${frame.fw}vmin`,
    "--fh": `${frame.fh}vmin`,
    "--rad": `${frame.rad}%`,
    "--ox": `${frame.ox}vmin`,
    "--oy": `${frame.oy}vmin`,
    "--rot": `${frame.rot}deg`,
    "--op": frame.op,
    "--stroke": frame.lime ? LIME : SECONDARY,
  } as React.CSSProperties;
}
