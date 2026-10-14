"use client";

import { useEffect, useRef } from "react";

/**
 * Horizontal swipe on a carousel rail.
 *
 * Pointer events, so a pen works like a finger; a mouse is excluded, because
 * click-dragging a link is a selection, not a gesture. Callers keep
 * `touch-action: pan-y` so the browser still owns vertical scrolling, and a
 * completed swipe swallows the click that follows it in the capture phase —
 * otherwise letting go would open whichever card was under the finger.
 */

/** How far a finger has to travel before it counts as a swipe, in px. */
const THRESHOLD = 44;
/** How much more horizontal than vertical it has to be. */
const BIAS = 1.2;

export function useSwipe<T extends HTMLElement>(
  onSwipe: (direction: 1 | -1) => void,
) {
  const ref = useRef<T>(null);
  /* In a ref so the listeners attach once: a carousel's handler closes over
   * the active index, so it is a new function on every slide. */
  const handler = useRef(onSwipe);
  useEffect(() => {
    handler.current = onSwipe;
  }, [onSwipe]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointer: number | null = null;
    let startX = 0;
    let startY = 0;
    let swiped = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      pointer = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      swiped = false;
    };

    const up = (e: PointerEvent) => {
      if (pointer !== e.pointerId) return;
      pointer = null;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy) * BIAS) return;
      swiped = true;
      handler.current(dx < 0 ? 1 : -1);
    };

    const cancel = () => {
      pointer = null;
    };

    const click = (e: MouseEvent) => {
      if (!swiped) return;
      swiped = false;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("pointerdown", down, { passive: true });
    el.addEventListener("pointerup", up, { passive: true });
    el.addEventListener("pointercancel", cancel, { passive: true });
    el.addEventListener("click", click, true);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
      el.removeEventListener("click", click, true);
    };
  }, []);

  return ref;
}
