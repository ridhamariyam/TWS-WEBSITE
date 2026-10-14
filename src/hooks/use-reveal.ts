"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Scroll reveal: content rises 25px into place the first time it reaches the
 * viewport, and never reverts.
 *
 * Only what starts below the fold is hidden, and only before paint. Hiding
 * everything up front blocked LCP until hydration and left readers without
 * JavaScript on a page of invisible text.
 *
 * Pairs with the `.reveal` utility in globals.css, which owns the transition
 * and the `[data-reveal-pending]` state this sets.
 */

/** Layout effects run before paint; the server has no layout phase. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -15% 0px",
) {
  const ref = useRef<T>(null);

  useBeforePaint(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen: leave it alone. It has painted, which is the point.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.revealPending = "";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        delete el.dataset.revealPending;
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref };
}
