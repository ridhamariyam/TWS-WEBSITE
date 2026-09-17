"use client";

import { cn } from "@/lib/utils";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import {
  HERO_SLIDES,
  HeroBackground,
  useHeroSlide,
} from "@/components/sections/hero-background";
import { HeroStats } from "@/components/sections/hero-stats";

/*
 * Hero: a cycling video wall, the headline block, a fanned row of site previews
 * and the odometer stats.
 *
 * The preview row is the same `.angled-carousel` component the showcase section
 * uses; the five cards sit at fixed offsets around a centre card, and every card
 * except the active one carries a dimming overlay. The card order matches the
 * video order, so the fan rotates in step with the background.
 */

// Verbatim from the source's inline styles on `.angled-carousel__card`.
const CARD_TRANSFORMS = [
  "translateX(-200%) translateY(10%) scale(0.8) rotate(-4deg)",
  "translateX(calc(-100% - 20px)) translateY(5%) scale(0.88) rotate(-2deg)",
  "none",
  "translateX(calc(100% + 20px)) translateY(5%) scale(0.88) rotate(2deg)",
  "translateX(200%) translateY(10%) scale(0.8) rotate(4deg)",
];

export function HeroSection() {
  const activeIndex = useHeroSlide();

  return (
    <section
      id="homepage-hero"
      className="relative bg-primitive-black"
      translate="yes"
    >
      <div className="animate-[homepageHeroReveal_0.4s_ease-in-out_forwards] opacity-0">
        <HeroBackground activeIndex={activeIndex} />
      </div>

      <div className="relative z-[1] mx-auto flex w-[calc((var(--grid-column-width)*11)+(var(--grid-gutter-width)*10))] flex-col items-center pt-40 pb-30 text-center bp744:w-full bp744:pb-18 bp1280:pb-20">
        <Reveal className="w-full">
          <h1 className="text-title3 text-primitive-white">
            <span>A website</span> makes it real
          </h1>
        </Reveal>
        <Reveal>
          <Cta
            variant="primary-subtle"
            theme="light"
            hasArrow
            href="/templates/get-started"
            className="my-6 mb-4"
          >
            Get Started
          </Cta>
        </Reveal>
        <Reveal>
          <p className="text-body text-primitive-white">
            Start for free. No credit card required.
          </p>
        </Reveal>
      </div>

      <div
        className="relative z-[1] flex h-(--card-height) w-full items-end justify-center overflow-hidden [--card-aspect-ratio:660/412] [--card-height:calc(var(--card-width)/(var(--card-aspect-ratio)))] [--card-width:calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))]"
        aria-hidden="true"
      >
        {HERO_SLIDES.map((slide, i) => {
          // Each card shows the slide that is `i - 2` steps from the active one,
          // so the fan rotates with the background rather than sitting still.
          const slideIndex =
            (activeIndex + i - 2 + HERO_SLIDES.length) % HERO_SLIDES.length;
          return (
            <div
              key={slide.id}
              className="absolute flex h-(--card-height) w-(--card-width) shrink-0 items-center justify-center overflow-hidden text-primitive-black"
              style={{ transform: CARD_TRANSFORMS[i] }}
            >
              <img
                src={HERO_SLIDES[slideIndex].card}
                alt=""
                className="absolute inset-0 h-full w-full rounded-[2px] object-cover object-center"
              />
              <div
                className={cn(
                  "absolute h-full w-full rounded-[2px] bg-[linear-gradient(rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  i !== 2 && "opacity-100",
                )}
              />
            </div>
          );
        })}
      </div>

      <HeroStats />
    </section>
  );
}
