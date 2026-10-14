"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { aboutHref, ROUTES, workHref } from "@/lib/site-links";
import { PROJECTS, type Project } from "@/lib/work-content";
import { SIZES, fallbackSrc, srcSet } from "@/lib/images";
import styles from "./selected-work-section.module.css";

/*
 * "The work speaks louder" — selected work.
 *
 * Two entry cards over a row of project thumbnails. The card eyebrow is a
 * clipped gradient that sweeps once on entry, staggered between the two.
 *
 * The section ends in a gradient down to black, which is what joins it to the
 * section below; the seam shows badly if those stops drift.
 */


type EntryCard = {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  video?: {
    mp4: string;
    poster: string;
  };
};

const ENTRY_CARDS: EntryCard[] = [
  {
    eyebrow: "The thinking",
    title:
      "The challenge, the insight, the move, the build — and what actually happened.",
    cta: "See how we work",
    href: aboutHref("process"),
    video: {
      mp4: "/videos/process-card.mp4",
      poster: "/videos/process-card-poster.webp",
    },
  },
  {
    eyebrow: "The output",
    title:
      "Websites, stores and platforms designed, built and shipped for businesses that had something to prove.",
    cta: "Browse selected work",
    href: ROUTES.work,
  },
];

export function SelectedWorkSection() {
  const [inView, setInView] = useState(false);
  /*
   * The card film is attached only once this section is reached, and never
   * under `prefers-reduced-motion`, which hides it anyway. In the markup it
   * costs 1.5MB on first load for something several screens down.
   */
  const [filmWanted, setFilmWanted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setFilmWanted(true);
        }
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
      id="selected-work"
      className="relative overflow-hidden bg-primitive-black text-primitive-white"
    >
      <Reveal className="page-gutter pt-20 text-center bp1020:pt-30">
        <h2 className="type-subtitle1 mx-auto max-w-[var(--span-8)] text-balance">
          The work speaks louder
        </h2>
        <p className="type-body mt-6">
          A selection of digital experiences we&rsquo;ve designed, built and
          shipped.
        </p>
      </Reveal>

      <div className="page-gutter mt-12 grid gap-6 bp1020:mx-auto bp1020:max-w-[var(--span-10)] bp1020:grid-cols-2 bp1020:gap-10">
        {ENTRY_CARDS.map((card, i) => (
          <Link
            key={card.eyebrow}
            href={card.href}
            className="group flex flex-col overflow-hidden rounded-lg bg-primitive-black text-primitive-white"
          >
            <div
              className={cn(
                "relative aspect-[4/3]",
                styles.cardSurface,
                i === 0 ? styles.cardSurfaceA : styles.cardSurfaceB,
              )}
            >
              {card.video ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:hidden"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  poster={card.video.poster}
                  src={filmWanted ? card.video.mp4 : undefined}
                  aria-hidden="true"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_50%,#000_100%)]" />
            </div>
            <div className="flex w-full flex-grow flex-col items-center gap-4 bg-primitive-black px-12 pt-4 pb-10 text-center">
              <p
                className={cn(
                  "type-subtitle2",
                  styles.eyebrow,
                  inView && (i === 0 ? styles.eyebrowInView : styles.eyebrowInViewDelayed),
                )}
              >
                {card.eyebrow}
              </p>
              <p className="type-body w-full flex-grow text-gray-500">
                {card.title}
              </p>
              <span className="type-subtitle3 inline-flex items-center gap-2">
                {card.cta}
                <ArrowRightIcon width={16} height={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="type-subtitle3 page-gutter mx-auto mt-20 mb-6 max-w-[var(--span-7)] text-center text-balance">
        We&rsquo;re not just showing you pretty screens. We show the thinking
        behind them.
      </p>

      <div className="page-gutter mt-16 flex gap-(--grid-gutter-width) overflow-x-auto pb-20 bp1020:justify-center">
        {PROJECTS.map((project) => (
          <ProjectShot key={project.slug} project={project} />
        ))}
      </div>

      <div className="page-gutter flex justify-center pb-20">
        <Cta variant="secondary" href={ROUTES.work}>
          View all work
        </Cta>
      </div>

      {/* Joins this white section to the black one below it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[360px] bg-[linear-gradient(transparent_0%,#000_100%)]" />
    </section>
  );
}

/** One piece of work: the shot, what it is, and where it stands. */
function ProjectShot({ project }: { project: Project }) {
  return (
    <figure className="w-[240px] shrink-0 bp1020:w-[calc((var(--grid-column-width)*2.5)+(var(--grid-gutter-width)*1.5))]">
      <Link
        href={workHref(project.slug)}
        className="group flex h-full flex-col overflow-hidden rounded-lg bg-primitive-black text-primitive-white"
      >
        <div className="relative aspect-[4/3]">
          <img
            src={fallbackSrc(project.image)}
            srcSet={srcSet(project.image)}
            sizes={SIZES.project}
            alt={`Screens from the ${project.name} project`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          {/* The picture fades into the card, as on the entry cards above. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_50%,#000_100%)]" />
        </div>

        <figcaption className="flex w-full flex-grow flex-col items-center gap-3 px-6 pt-4 pb-8 text-center">
          <span className="type-body w-full flex-grow text-gray-500">
            {project.category}
          </span>
          <span className="type-subtitle3 inline-flex items-center gap-2">
            View project
            <ArrowRightIcon width={16} height={16} />
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
