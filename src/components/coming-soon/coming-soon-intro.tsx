"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { INTRO_SEEN } from "@/components/sections/hero-intro-flag";
import styles from "./coming-soon-intro.module.css";

/*
 * The holding page's opening: the launch announcement told as kinetic type
 * on black, then the page (whose copy is the script's last two scenes).
 *
 *   Opening         0.0s   a lime dot, then "Everything is evolving" opens
 *                          out to its left, leaving the dot, still changing
 *                          shape, as its full stop (and the full stop of
 *                          each line up to the mark); a blue
 *                          bar sweeps behind "evolving." with the line still
 *                          whole, so the word is only ever seen once;
 *   Anticipation    4.0s   "The digital world never stands still.";
 *   Transition      6.2s   a ring of blue light floods the screen and
 *                          "Neither should the way we build." settles out of
 *                          it;
 *   Brand reveal    9.2s   the TWS mark draws in, then THE WEB STUDIO and
 *                          "Designed Beyond Ordinary.";
 *   Approach       12.4s   We imagine. We design. We engineer.;
 *   What we build  15.8s   the three offers rise in while shapes in the
 *                          brand colours drift out, then "Built with
 *                          purpose…";
 *   Exit           19.2s   the overlay fades and the page's headline,
 *                          "Launching soon", plays its entrance.
 *
 * Each scene clears before the next comes in, so no two lines ever share
 * the screen. The display type is the page's: Unbounded, close to the
 * wordmark, heavy with light accents.
 *
 * A click, key or scroll skips to the end. It plays on every load, and not
 * at all for reduced motion, which CSS hides before hydration so the overlay
 * never flashes.
 */

const SCENE_STARTS = [
  0, // 1  dot
  500, // 2  "Everything"
  1100, // 3  "is evolving.", the dot morphs
  3000, // 4  the bar behind "evolving.", the line held whole
  4000, // 5  "The digital world never stands still."
  6200, // 6  the light rises
  7000, // 7  "Neither should the way we build."
  9200, // 8  the mark draws in
  10200, // 9  THE WEB STUDIO, Designed Beyond Ordinary.
  12400, // 10 We imagine.
  13300, // 11 We design.
  14200, // 12 We engineer.
  15800, // 13 the three offers
  17000, // 14 Built with purpose.
  19200, // 15 exit
];
const EXIT = SCENE_STARTS.length;
const FADE_MS = 800;
const TOTAL_MS = SCENE_STARTS[EXIT - 1];

const APPROACH = ["imagine.", "design.", "engineer."];

const OFFERS = ["Digital experiences.", "Web platforms.", "Custom software."];

/* Shapes in the brand colours, drifting out past the offers. */
const CHIPS: Array<{ kind: string; x: number; y: number }> = [
  { kind: "cube", x: -38, y: -30 },
  { kind: "triangle", x: 34, y: -32 },
  { kind: "arc", x: 38, y: 26 },
  { kind: "diamond", x: -32, y: 30 },
  { kind: "sphere", x: -46, y: 2 },
  { kind: "plus", x: 16, y: -40 },
  { kind: "pill", x: 46, y: -4 },
  { kind: "ring", x: -10, y: 40 },
];

/** The shape-changing full stop the opening lines share. */
function Stop() {
  return <span className={styles.stop} />;
}

export function ComingSoonIntro() {
  const [scene, setScene] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Marks the page for its entrance; nothing is stored, so a reload replays.
    const finish = () => {
      html.dataset.intro = INTRO_SEEN;
      setDone(true);
    };

    if (html.dataset.intro === INTRO_SEEN || reduced) {
      finish();
      return;
    }

    const timers: number[] = [];
    const clear = () => timers.forEach((id) => window.clearTimeout(id));
    const exit = () => {
      clear();
      setScene(EXIT);
      timers.push(window.setTimeout(finish, FADE_MS));
    };

    SCENE_STARTS.forEach((at, i) => {
      timers.push(window.setTimeout(() => setScene(i + 1), at));
    });
    timers.push(window.setTimeout(exit, TOTAL_MS));

    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    const skip = () => {
      events.forEach((name) => window.removeEventListener(name, skip));
      exit();
    };
    events.forEach((name) => window.addEventListener(name, skip, { passive: true }));

    return () => {
      clear();
      events.forEach((name) => window.removeEventListener(name, skip));
    };
  }, []);

  if (done) return null;

  /** Whether the current scene is in [from, to). */
  const on = (from: number, to = EXIT) => scene >= from && scene < to;

  return (
    <div
      className={cn(styles.root, scene === EXIT && styles.leaving)}
      role="presentation"
      aria-hidden="true"
    >
      {/* 6+: the light along the bottom, and the flood that brings it. */}
      <span className={cn(styles.floor, on(6) && styles.on)} />
      <span className={cn(styles.flood, on(6) && styles.play)} />
      <span className={cn(styles.halo, on(6) && styles.play)} />

      {/*
        Opening: the dot alone, then the line opens out to its left, so the
        dot ends up as its full stop. It stays the full stop of every line
        until the mark, whose own dot takes over.
      */}
      <p className={cn(styles.line, on(1, 5) && styles.on)}>
        <span className={cn(styles.fold, on(2, 5) && styles.open)}>Everything&nbsp;</span>
        <span className={cn(styles.fold, on(3, 5) && styles.open)}>is&nbsp;</span>
        <span className={cn(styles.fold, on(3, 5) && styles.open)}>
          <em className={cn(styles.accent, styles.mark, on(4, 5) && styles.marked)}>evolving</em>
        </span>
        <Stop />
      </p>

      {/* Anticipation. */}
      <p className={cn(styles.line, styles.wrap, styles.focus, on(5, 6) && styles.on)}>
        <span>
          The digital world{" "}
          <em className={cn(styles.accent, styles.dim)}>
            never stands <span className={styles.nowrap}>still<Stop /></span>
          </em>
        </span>
      </p>

      {/* Transition, out of the light. */}
      <p className={cn(styles.line, styles.wrap, styles.focus, styles.fromLight, on(7, 8) && styles.on)}>
        <span>
          Neither should{" "}
          <em className={styles.accent}>
            the way we <span className={styles.nowrap}>build<Stop /></span>
          </em>
        </span>
      </p>

      {/* Brand reveal. */}
      <div className={cn(styles.brand, on(8, 10) && styles.on)}>
        <img src="/icons/tws-logo.png" alt="" className={cn(styles.logo, styles.draw)} />
        <p className={cn(styles.label, on(9, 10) && styles.shown)}>The Web Studio</p>
        <p className={cn(styles.tagline, on(9, 10) && styles.shown)}>
          <em className={styles.accent}>Designed Beyond Ordinary.</em>
        </p>
      </div>

      {/* Approach. */}
      <div className={cn(styles.stack, on(10, 13) && styles.on)}>
        {APPROACH.map((verb, i) => (
          <p key={verb} className={cn(styles.row, on(10 + i, 13) && styles.shown)}>
            We <em className={styles.accent}>{verb}</em>
          </p>
        ))}
      </div>

      {/* What we're building. */}
      <div className={cn(styles.stack, styles.offers, on(13, 15) && styles.on)}>
        {CHIPS.map((chip, i) => (
          <span
            key={i}
            className={cn(styles.chip, styles[chip.kind])}
            style={
              {
                "--x": `${chip.x}vw`,
                "--y": `${chip.y}vh`,
                "--d": `${i * 60}ms`,
              } as CSSProperties
            }
          />
        ))}
        {OFFERS.map((offer, i) => (
          <p
            key={offer}
            className={cn(styles.row, on(13, 15) && styles.shown)}
            style={{ transitionDelay: `${i * 160}ms` }}
          >
            {offer}
          </p>
        ))}
        <p className={cn(styles.sub, on(14, 15) && styles.shown)}>
          Built with purpose. <em className={styles.accent}>Designed for what&rsquo;s next.</em>
        </p>
      </div>

      <span className={styles.progress} style={{ animationDuration: `${TOTAL_MS}ms` }} />
      <span className={styles.hint}>Click or press any key to skip</span>
    </div>
  );
}
