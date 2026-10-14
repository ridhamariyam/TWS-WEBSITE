"use client";

import { useRef } from "react";
import { clamp, easeInOut, easeOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import styles from "./flow.module.css";

/*
 * The studio's mark as a window, pinned on white. It opens on the film,
 * full screen, which is in fact one stroke of the W seen from very close:
 * scrolling pulls back until the whole TWS mark sits in the middle of the
 * white with the film playing inside its letters, and a line comes up under
 * it.
 *
 *   0.00–0.10  the film, full screen;
 *   0.10–0.75  the view pulls back out of the W to the whole mark;
 *   0.78–0.92  the line comes into focus under it. Both stay.
 */

const FILM = { mp4: "/videos/hero-film-wide.mp4", poster: "/videos/hero-film-wide-poster.webp" };

/** public/icons/tws-mask.svg: the logo traced, 1989 × 449. */
const MASK_RATIO = 449 / 1989;
/*
 * The deepest point inside the letters, as fractions of the mask, and the
 * radius of the largest circle around it as a fraction of the mask's width:
 * the mask is fully open once that circle covers the screen.
 */
const FOCUS = { x: 0.3429, y: 0.7906 };
const FOCUS_RADIUS = 0.0431;

export function BrandReveal({ line }: { line: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);

  useScrollStage(sectionRef, (p) => {
    const win = windowRef.current;
    if (!win) return;
    const { innerWidth: w, innerHeight: h } = window;

    // 1 is the film full screen, 0 the whole mark.
    const t = 1 - easeInOut(range(p, 0.1, 0.75));

    // Shrinks by a constant factor per step of scroll, so the zoom feels even.
    const start = Math.min(w * 0.72, 900);
    const end = (Math.hypot(w, h) / 2 + 60) / FOCUS_RADIUS;
    const size = start * Math.pow(end / start, t);
    // The point held at the middle of the screen moves from the focus to the
    // mark's centre, late, once the stroke has pulled back into a letter.
    const k = easeOut(clamp(t * 1.6));
    const fx = lerp(0.5, FOCUS.x, k);
    const fy = lerp(0.5, FOCUS.y, k);
    const x = w / 2 - fx * size;
    const y = h / 2 - fy * size * MASK_RATIO;

    if (t >= 1) {
      win.style.maskImage = "none";
      win.style.webkitMaskImage = "none";
    } else {
      win.style.maskImage = "";
      win.style.webkitMaskImage = "";
      const s = `${size.toFixed(1)}px auto`;
      const pos = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      win.style.maskSize = s;
      win.style.webkitMaskSize = s;
      win.style.maskPosition = pos;
      win.style.webkitMaskPosition = pos;
    }
    if (filmRef.current) filmRef.current.style.transform = `scale(${lerp(1, 1.35, t).toFixed(4)})`;

    const line = lineRef.current;
    if (line) {
      const v = easeOut(range(p, 0.78, 0.92));
      line.style.opacity = v.toFixed(3);
      line.style.filter = v < 0.99 ? `blur(${((1 - v) * 12).toFixed(1)}px)` : "none";
      line.style.transform = `translate(-50%, ${((1 - v) * 14).toFixed(1)}px)`;
    }
  });

  return (
    <section ref={sectionRef} className={styles.revealSection} aria-label="TWS">
      <div className={styles.revealStage}>
        <div ref={windowRef} className={styles.revealWindow} aria-hidden="true">
          <div ref={filmRef} className={styles.revealFilm}>
            <video src={FILM.mp4} poster={FILM.poster} autoPlay muted loop playsInline preload="metadata" />
          </div>
        </div>
        <p ref={lineRef} className={styles.revealLine}>
          {line}
        </p>
      </div>
    </section>
  );
}
