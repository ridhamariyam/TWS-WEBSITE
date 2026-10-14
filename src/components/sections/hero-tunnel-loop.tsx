"use client";

import { useEffect, useRef } from "react";
import { beat } from "@/components/sections/hero-beat";
import {
  CYCLE,
  FRAMES,
  PUSH,
  frameBeat,
  frameVars,
} from "@/components/sections/hero-tunnel-data";
import styles from "./hero-tunnel.module.css";

/*
 * The tunnel, continuing: the hero's background for as long as it is on
 * screen. The same frames and beats as the load transition, but looping and in
 * phase with it, so the handover is invisible.
 *
 * Quieter than the opening pass, with a well of darkness in the middle for the
 * headline to sit on. The only JavaScript parks the animation once the hero is
 * scrolled away.
 */

export function HeroTunnelLoop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.paused = String(!entry.isIntersecting);
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={styles.loop}
      data-paused="false"
      aria-hidden="true"
    >
      {FRAMES.map((frame, i) => (
        <div
          key={i}
          className={`tws-beat ${styles.frame} ${frame.lime ? styles.glow : ""}`}
          style={{ ...beat(frameBeat(i), CYCLE, PUSH), ...frameVars(frame) }}
        />
      ))}

      <div className={styles.well} />
    </div>
  );
}
