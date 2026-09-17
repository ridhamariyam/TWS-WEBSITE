"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/icons";
import styles from "./get-started-section.module.css";

/*
 * "Getting started has never been easier with AI".
 *
 * Two entry cards, each a looping video with a black content block beneath it,
 * then the template picker. The card eyebrow is not plain white text — it is a
 * clipped gradient that sweeps once when the card enters view
 * (`gradient-animation`, 1.8s / 2.2s staggered), so it reads as a shimmer.
 *
 * The section ends in `linear-gradient(transparent 85%, #000 100%)`, which is
 * what joins it to the black domain section below; that seam is very visible if
 * the stops drift.
 */

const DIR = "/images/pages/homepage-2025/get-started";
const TEMPLATES_DIR = "/images/mpp-starting-points/en";

const ENTRY_CARDS = [
  {
    eyebrow: "Blueprint AI Builder",
    title: "Answer a few questions and let our AI website builder do the rest.",
    cta: "Build with AI",
    href: "/templates/custom-website-templates",
    video: "blueprint-ai",
    badge: true,
  },
  {
    eyebrow: "Professional Templates",
    title: "Crafted by our designers, customized by AI—just for your business.",
    cta: "Browse website templates",
    href: "/templates/get-started",
    video: "templates",
    badge: false,
  },
];

const TEMPLATES = [
  { name: "Alta Loma", image: "altaloma" },
  { name: "Reseda", image: "reseda" },
  { name: "Rotate", image: "rotate" },
];

export function GetStartedSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="get-started"
      className="relative overflow-hidden bg-primitive-white text-primitive-black"
    >
      <Reveal className="page-gutter pt-20 text-center bp1020:pt-30">
        <h2 className="text-subtitle1 mx-auto max-w-[calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))] text-balance">
          Getting started has never been easier with AI
        </h2>
        <p className="text-body mt-6">No experience required.</p>
      </Reveal>

      <div className="page-gutter mt-12 grid gap-6 bp1020:mx-auto bp1020:max-w-[calc((var(--grid-column-width)*10)+(var(--grid-gutter-width)*9))] bp1020:grid-cols-2 bp1020:gap-10">
        {ENTRY_CARDS.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col overflow-hidden rounded-lg bg-primitive-black text-primitive-white"
          >
            <div className="relative aspect-[4/3]">
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              >
                <source src={`${DIR}/${card.video}.webm`} type="video/webm" />
                <source src={`${DIR}/${card.video}.mp4`} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_50%,#000_100%)]" />
              {card.badge ? (
                <div className="absolute top-4 left-4 z-[2] flex h-[90px] w-[66px] items-center justify-center gap-4 rounded-lg bg-white/20 p-4 backdrop-blur-[50px]">
                  <img
                    src={"/images/pages/flagship/blueprint-ai/design-partner/time-logo.png"}
                    alt="TIME Best Inventions 2025"
                    className="w-full object-contain"
                  />
                </div>
              ) : null}
            </div>
            <div className="flex w-full flex-grow flex-col items-center gap-4 bg-primitive-black px-12 pt-4 pb-10 text-center">
              <p
                className={cn(
                  "text-subtitle2",
                  styles.eyebrow,
                  inView && (i === 0 ? styles.eyebrowInView : styles.eyebrowInViewDelayed),
                )}
              >
                {card.eyebrow}
              </p>
              <p className="text-body w-full flex-grow text-gray-500">
                {card.title}
              </p>
              <span className="text-subtitle3 inline-flex items-center gap-2">
                {card.cta}
                <ArrowRightIcon width={16} height={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-footnote page-gutter mt-10 text-center">
        Blueprint AI, one of TIME&rsquo;s Best Inventions of 2025*
      </p>

      <Reveal className="page-gutter mt-20 text-center">
        <h2 className="text-subtitle1 mx-auto max-w-[calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))] text-balance">
          Start with a website template designed for your business
        </h2>
      </Reveal>

      <div className="page-gutter mt-10 flex gap-(--grid-gutter-width) overflow-x-auto pb-20 bp1020:justify-center">
        {TEMPLATES.map((template) => (
          <Link
            key={template.image}
            href="/templates"
            className="group w-[260px] shrink-0 bp1020:w-[calc((var(--grid-column-width)*3)+(var(--grid-gutter-width)*2))]"
          >
            <img
              src={`${TEMPLATES_DIR}/${template.image}.webp`}
              alt={template.name}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-lg object-cover"
            />
            <span className="text-subtitle3 mt-4 inline-flex items-center gap-2">
              Start with this template
              <ArrowRightIcon width={16} height={16} />
            </span>
          </Link>
        ))}
      </div>

      <div className="page-gutter flex justify-center pb-20">
        <Cta variant="secondary" href="/templates">
          Browse templates
        </Cta>
      </div>

      {/* Joins this white section to the black one below it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(transparent_85%,#000_100%)]" />
    </section>
  );
}
