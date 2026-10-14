"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./keep-in-touch-section.module.css";

/*
 * "Keep in touch": three shapes that merge into one capsule and separate again.
 *
 * The morph is geometry, not a swap — see the stylesheet. One piece of state
 * drives all of it, so hover, keyboard focus and the touch demo below are the
 * same visual state by construction rather than three sets of CSS kept in
 * agreement.
 */

/** How long the merged state holds when it plays itself on a touch device. */
const DEMO_HOLD = 1900;

export function KeepInTouchSection() {
  const [merged, setMerged] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  /*
   * Touch has no hover, so the interaction introduces itself once on a coarse
   * pointer: merge, hold, separate. Tapping is still just the link.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: none)").matches) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timers.push(window.setTimeout(() => setMerged(true), 420));
        timers.push(window.setTimeout(() => setMerged(false), 420 + DEMO_HOLD));
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return (
    <section id="keep-in-touch" className={styles.section}>
      <Link
        ref={ref}
        href="/contact"
        aria-label="Keep in touch"
        className={styles.stage}
        data-merged={merged}
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") setMerged(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") setMerged(false);
        }}
        onFocus={() => setMerged(true)}
        onBlur={() => setMerged(false)}
      >
        <span className={styles.inner}>
          {/* The shapes carry no text, so they can move on their own path. */}
          <span className={`${styles.shape} ${styles.keep}`} aria-hidden="true" />
          <span className={`${styles.shape} ${styles.in}`} aria-hidden="true" />
          <span className={`${styles.shape} ${styles.touch}`} aria-hidden="true" />

          <span className={`${styles.word} ${styles.wKeep}`} aria-hidden="true">
            Keep
          </span>
          <span className={`${styles.word} ${styles.wIn}`} aria-hidden="true">
            In
          </span>
          <span className={`${styles.word} ${styles.wTouch}`} aria-hidden="true">
            Touch
          </span>
        </span>
      </Link>
    </section>
  );
}
