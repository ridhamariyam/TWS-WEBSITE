"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/** Scroll distance (px) after which the rail fades in. */
const SHOW_AFTER = 150;
/** Height of the progress track in px. */
const TRACK_HEIGHT = 60;

/**
 * Fixed "scroll to top" rail on the right edge (>=1200px only).
 * Fades in after 150px of scroll; the white fill grows down the 60px track with
 * page progress. White + mix-blend-mode difference keeps it legible on light
 * and dark sections. Styles are written straight to refs from a rAF-throttled
 * scroll handler, so scrolling never triggers a React render.
 */
export function ScrollProgress() {
  const railRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const rail = railRef.current;
      const button = buttonRef.current;
      const fill = fillRef.current;
      if (!rail || !button || !fill) return;

      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
      const visible = scrollY > SHOW_AFTER;

      fill.style.height = `${progress * TRACK_HEIGHT}px`;
      rail.dataset.visible = visible ? "true" : "false";
      rail.setAttribute("aria-hidden", visible ? "false" : "true");
      button.tabIndex = visible ? 0 : -1;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={railRef}
      data-visible="false"
      aria-hidden="true"
      className={cn(
        "fixed right-5 top-1/2 z-[111] h-[162px] w-8 -translate-y-1/2",
        "pointer-events-none opacity-0 mix-blend-difference transition-opacity duration-300 ease-linear",
        "data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100",
        "max-xl:hidden",
      )}
    >
      <button
        ref={buttonRef}
        type="button"
        tabIndex={-1}
        onClick={scrollToTop}
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-0"
      >
        <span className="mb-[15px] rotate-180 text-[11px] leading-[32px] tracking-normal text-white uppercase [writing-mode:vertical-rl]">
          Scroll to top
        </span>
        <span aria-hidden="true" className="relative block h-[60px] w-[2px] bg-white/15">
          <span ref={fillRef} className="absolute top-0 left-0 block h-0 w-full bg-white" />
        </span>
      </button>
    </div>
  );
}
