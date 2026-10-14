"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Scroll progress through a tall "stage" section, 0 when its top meets the
 * top of the viewport and 1 when its bottom meets the bottom — the span over
 * which its sticky child is pinned.
 *
 * The callback runs at most once a frame and is handed the number rather than
 * stored in state, so a stage can drive its transforms through refs and CSS
 * variables without re-rendering React on every scroll event.
 */
export function useScrollStage(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  const callback = useRef(onProgress);

  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      callback.current(span > 0 ? clamp(-rect.top / span) : 0);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [ref]);
}

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** `value`'s position between `start` and `end`, clamped to 0–1. */
export const range = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
