"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mirrors the live site's scroll reveal: elements render with `opacity: 0` and
 * flip to visible the first time they intersect the viewport, and never revert.
 *
 * Pair with the `.reveal` utility in globals.css, which owns the transition.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -15% 0px",
) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, rootMargin]);

  return { ref, revealed };
}
