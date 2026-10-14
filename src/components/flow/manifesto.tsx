"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { easeInOut, easeOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import { Swatch } from "./swatch";
import styles from "./flow.module.css";

/*
 * The manifesto: a short film played by scroll on a pinned black stage.
 *
 *   0.00–0.13  "Everything online evolved." comes into focus word by word, and
 *              a blue bar sweeps in behind "evolved";
 *   0.13–0.24  "Most websites didn't.";
 *   0.22–0.33  a glowing panel rushes at the viewer and the screen flares;
 *   0.31–0.44  "So we rethought them." settles out of the light;
 *   0.44–0.63  the camera pans across a grid of the four stages of the work;
 *   0.62–0.77  the stage goes white for "Websites", then "Web applications &
 *              E-Commerce", then
 *              fades back to black.
 *
 * The timings run to 0.77, the share of the section's scroll they fill; the
 * sign-off ("beyond ordinary", the mark and the way to start a project) is
 * in flow-outro.tsx, just before the footer.
 *
 * Every element is given a scroll range to come into focus over and another
 * to leave over; the script turns those into opacity, blur and scale.
 */

type Fx = {
  /** Scroll range it comes in over. */
  in: [number, number];
  /** Scroll range it leaves over; omitted, it stays. */
  out?: [number, number];
  /** Blur in px at either end. */
  blur?: number;
  /** Scale it comes in from, and leaves to. */
  scale?: [number, number];
  /** Vertical drift in px as it comes in. */
  y?: number;
};

const BLUR = 16;

/** A line set word by word, each word coming in a little after the last. */
function words(text: string, fx: Fx, reg: (fx: Fx) => (el: HTMLElement | null) => void) {
  const list = text.split(" ");
  const [a, b] = fx.in;
  return list.map((word, i) => {
    const start = a + ((b - a) * 0.6 * i) / Math.max(1, list.length - 1);
    return (
      <span key={i} ref={reg({ ...fx, in: [start, start + (b - a) * 0.4] })} className={styles.mWord}>
        {word}
      </span>
    );
  });
}

/* The grid the camera pans across: 5 columns by 4 rows. */
const GRID: Array<{ word?: string; image?: string }> = [
  { image: "studio-footer" }, { word: "Think" }, {}, { image: "web-design" }, {},
  {}, { image: "professional-services" }, { word: "Design" }, {}, { image: "hospitality" },
  { image: "startups-technology" }, {}, { image: "web-applications" }, { word: "Build" }, {},
  {}, { image: "real-estate" }, {}, { image: "ecommerce" }, { word: "Grow" },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<HTMLElement, Fx>());
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const reg = (fx: Fx) => (el: HTMLElement | null) => {
    if (el) items.current.set(el, fx);
  };

  useScrollStage(sectionRef, (progress) => {
    const p = progress * 0.77;
    const stage = stageRef.current;
    if (!stage) return;
    const { innerWidth: w, innerHeight: h } = window;
    const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(3));

    items.current.forEach((fx, el) => {
      const vin = easeOut(range(p, fx.in[0], fx.in[1]));
      const vout = fx.out ? easeInOut(range(p, fx.out[0], fx.out[1])) : 0;
      const blur = (fx.blur ?? BLUR) * (1 - vin + vout);
      const [s0, s1] = fx.scale ?? [1, 1];
      const scale = vout > 0 ? lerp(1, s1, vout) : lerp(s0, 1, vin);
      const opacity = vin * (1 - vout);
      el.style.opacity = opacity.toFixed(3);
      el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
      el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.transform = `translateY(${((1 - vin) * (fx.y ?? 0)).toFixed(1)}px) scale(${scale.toFixed(3)})`;
    });

    set("--m-mark", easeInOut(range(p, 0.075, 0.1)));
    // The white stage, and the glow along the bottom edge.
    set("--m-white", range(p, 0.615, 0.635) * (1 - range(p, 0.75, 0.77)));
    set("--m-glow", range(p, 0.29, 0.34) * (1 - range(p, 0.42, 0.45)));
    // The flare as the panel passes the viewer.
    set("--m-flash", range(p, 0.27, 0.305) * (1 - range(p, 0.305, 0.345)));

    const panel = panelRef.current;
    if (panel) {
      const t = range(p, 0.22, 0.32);
      panel.style.opacity = (range(t, 0, 0.25) * (1 - range(t, 0.75, 1))).toFixed(3);
      panel.style.transform = `translate(-50%, -50%) scale(${(0.25 * Math.pow(40, t)).toFixed(3)})`;
    }

    const grid = gridRef.current;
    if (grid) {
      const t = easeInOut(range(p, 0.44, 0.63));
      grid.style.opacity = (range(p, 0.44, 0.47) * (1 - range(p, 0.6, 0.63))).toFixed(3);
      grid.style.transform = `translate3d(${(-t * w).toFixed(1)}px, ${(-t * h).toFixed(1)}px, 0)`;
    }
  });

  return (
    <section ref={sectionRef} className={styles.mSection} aria-label="What TWS believes">
      <div ref={stageRef} className={styles.mStage}>
        <span className={styles.mWhite} aria-hidden="true" />
        <span className={styles.mGlow} aria-hidden="true" />

        <Line>
          {words("Everything online", { in: [0.0, 0.06], out: [0.11, 0.13] }, reg)}{" "}
          <span ref={reg({ in: [0.04, 0.075], out: [0.11, 0.13] })} className={`${styles.mWord} ${styles.mMarked}`}>
            <span className={styles.mMark} aria-hidden="true" />
            <em className={styles.mSerif}>evolved.</em>
          </span>
        </Line>

        <Line>
          <em ref={reg({ in: [0.13, 0.17], out: [0.21, 0.24], scale: [1, 1.15] })} className={`${styles.mWord} ${styles.mSerif} ${styles.mDim}`}>
            Most websites
          </em>{" "}
          <span ref={reg({ in: [0.16, 0.19], out: [0.21, 0.24], scale: [1, 1.15] })} className={`${styles.mWord} ${styles.mBlueText}`}>
            didn&rsquo;t.
          </span>
        </Line>

        <div ref={panelRef} className={styles.mPanel} aria-hidden="true" />
        <span className={styles.mFlash} aria-hidden="true" />

        <Line>
          <span ref={reg({ in: [0.31, 0.37], out: [0.41, 0.44], scale: [1.35, 1], blur: 24 })} className={`${styles.mWord} ${styles.mAnton}`}>
            So we <span className={styles.mBlueText}>rethought</span> them.
          </span>
        </Line>

        <div className={styles.mGridWrap} aria-hidden="true">
          <div ref={gridRef} className={styles.mGrid}>
            {GRID.map((cell, i) => (
              <div key={i} className={styles.mCell}>
                {cell.image && <Swatch name={cell.image} />}
                {cell.word && <span>{cell.word}</span>}
              </div>
            ))}
          </div>
        </div>

        <Line>
          <span ref={reg({ in: [0.62, 0.67], out: [0.67, 0.7], scale: [1.4, 0.7], blur: 30 })} className={`${styles.mWord} ${styles.mHuge}`}>
            Websites
          </span>
        </Line>
        <Line>
          <span ref={reg({ in: [0.69, 0.72], out: [0.74, 0.76] })} className={`${styles.mWord} ${styles.mBlueText}`}>
            Web applications &amp; <em className={styles.mSerif}>E&#8209;Commerce</em>
          </span>
        </Line>
      </div>
    </section>
  );
}

function Line({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className={styles.mLine} style={style}>
      {children}
    </p>
  );
}
