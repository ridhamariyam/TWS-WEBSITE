"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero's cycling video wall.
 *
 * Five business verticals crossfade on a timer. Each slide keeps its own
 * <video> mounted so switching is a pure opacity change — matching the site's
 * `.dynamic-background__item { transition: opacity .8s cubic-bezier(.23,1,.32,1) }`.
 * Sources are webm-first with an mp4 fallback and a `(min-width: 744px)` media
 * split, exactly as the live markup serves them.
 */

const BASE = "/images/pages/homepage-2025/hero/videos/july-2026";

export const HERO_SLIDES = [
  { id: "tutor", card: "/images/auto/f1f95a06/tutor.webp" },
  { id: "creative", card: "/images/auto/c7c32ead/creative.webp" },
  { id: "plants", card: "/images/auto/9e9d7f8d/plants.webp" },
  { id: "barber", card: "/images/auto/f2051f0f/barber.webp" },
  { id: "wellness", card: "/images/auto/b37c49fb/wellness.webp" },
] as const;

/** The centre card starts on `plants`, which is what the live page loads with. */
export const INITIAL_SLIDE = 2;
const SLIDE_MS = 6000;

export function useHeroSlide() {
  const [index, setIndex] = useState(INITIAL_SLIDE);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_SLIDES.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return index;
}

export function HeroBackground({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="absolute inset-x-0 top-0 z-0 flex min-h-[600px] w-full justify-center overflow-hidden bg-primitive-black">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute -top-px left-0 h-full w-full opacity-0 transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            i === activeIndex && "opacity-100",
          )}
        >
          <video
            className="absolute inset-0 z-[1] h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload={i === INITIAL_SLIDE ? "auto" : "metadata"}
            poster={`${BASE}/${slide.id}-desktop-poster.webp`}
          >
            <source
              src={`${BASE}/${slide.id}-desktop.webm`}
              type="video/webm"
              media="(min-width: 744px)"
            />
            <source src={`${BASE}/${slide.id}-mobile.webm`} type="video/webm" />
            <source
              src={`${BASE}/${slide.id}-desktop.mp4`}
              type="video/mp4"
              media="(min-width: 744px)"
            />
            <source src={`${BASE}/${slide.id}-mobile.mp4`} type="video/mp4" />
          </video>
        </div>
      ))}
      {/* Fades the video into the black stats block below it. */}
      <div className="absolute inset-0 z-[3] h-full w-full bg-[linear-gradient(transparent_0%_70%,#000_100%)]" />
    </div>
  );
}
