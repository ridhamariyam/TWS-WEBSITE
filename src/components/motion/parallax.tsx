"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ParallaxFrame = {
  x?: number;
  y?: number;
  scale?: number;
};

type ParallaxProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  /** Transform when the element's top edge meets the viewport bottom (skrollr `data-bottom-top`). */
  from: ParallaxFrame;
  /** Transform when the element's bottom edge meets the viewport top (skrollr `data-top-bottom`). */
  to: ParallaxFrame;
};

function documentTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Scroll-linked transform interpolated across the element's full pass through
 * the viewport, with the reference's 0.65s smoothing transition. Offsets are
 * measured with offsetTop/offsetHeight so the applied transform never feeds back.
 */
export function Parallax({ as: Tag = "div", className, children, from, to }: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = documentTop(el);
      const progress = Math.min(1, Math.max(0, (window.scrollY - (top - vh)) / (el.offsetHeight + vh)));
      const x = lerp(from.x ?? 0, to.x ?? 0, progress);
      const y = lerp(from.y ?? 0, to.y ?? 0, progress);
      const s = lerp(from.scale ?? 1, to.scale ?? 1, progress);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [from.x, from.y, from.scale, to.x, to.y, to.scale]);

  return (
    <Tag
      ref={ref}
      className={cn("transition-transform duration-[650ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform", className)}
    >
      {children}
    </Tag>
  );
}
