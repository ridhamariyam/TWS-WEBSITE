"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/ui/icons";
import { industryHref } from "@/lib/site-links";
import { SIZES, fallbackSrc, srcSet } from "@/lib/images";
import { useSwipe } from "@/hooks/use-swipe";

/* The six sectors we work in, as a horizontal card carousel. */

type PlatformCard = {
  title: string;
  body: string;
  href: string;
  /** Basename in the image manifest; see src/lib/images.ts. */
  image: string;
};

const CARDS: PlatformCard[] = [
  {
    title: "Real Estate",
    body: "Property is personal. Build confidence long before the first viewing.",
    href: industryHref(),
    image: "real-estate",
  },
  {
    title: "Hospitality",
    body: "Sell the feeling before the stay. Make the experience tangible before someone books.",
    href: industryHref(),
    image: "hospitality",
  },
  {
    title: "Healthcare",
    body: "Trust starts early. Give people confidence before the first appointment.",
    href: industryHref(),
    image: "healthcare",
  },
  {
    title: "Professional Services",
    body: "Your expertise needs proof. Make your digital presence carry its weight.",
    href: industryHref(),
    image: "professional-services",
  },
  {
    title: "Startups & Technology",
    body: "Look like where you're going. Build a digital presence that matches the ambition.",
    href: industryHref(),
    image: "startups-technology",
  },
  {
    title: "E-Commerce",
    body: "Every click counts. Remove the friction between discovery and checkout.",
    href: industryHref(),
    image: "ecommerce-crop",
  },
];

/** The rail the dots, the arrows and the timer all drive. */
const RAIL_ID = "industries-rail";

/* Matches the capabilities carousel, so the two are never out of step on one
 * screen. Short enough that the pause control is doing real work. */
const AUTOPLAY_MS = 1000;

/**
 * How far the rail can travel, measured rather than assumed: how many cards
 * fit changes with the breakpoint, and a fixed count leaves the last cards
 * unreachable on anything narrower than a desktop.
 */
function pagesFor(rail: HTMLElement, total: number) {
  const first = rail.firstElementChild;
  if (!first) return 1;
  // Each card sits in a wrapper one card plus one gutter wide — the stride.
  const stride = first.getBoundingClientRect().width;
  if (stride <= 0) return 1;
  const visible = Math.max(1, Math.floor((rail.clientWidth + 1) / stride));
  return Math.max(1, total - visible + 1);
}

export function IndustriesSection() {
  const [page, setPage] = useState(0);
  /* The rail advances on its own; these three decide when it should not. */
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  /* Hovering or tabbing in stops it (WCAG 2.2.2), and for a keyboard user it
   * matters more than that: the focused card would slide out from under them. */
  const [interacting, setInteracting] = useState(false);
  /*
   * How many cards are on screen at this width. Anything outside that window
   * is inert: a card slid out of view is still a link, and tabbing to one
   * scrolls the clipping box across to reveal it, leaving the dots, the
   * arrows and the rail disagreeing about which page you are on.
   */
  const [visible, setVisible] = useState(1);
  /* Seeded with the desktop count so the controls render before the rail has
   * been measured; the effect corrects it on mount. */
  const [pages, setPages] = useState(3);
  const railRef = useRef<HTMLDivElement>(null);
  const swipeRef = useSwipe<HTMLDivElement>((d) =>
    setPage((p) => Math.min(pages - 1, Math.max(0, p + d))),
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      const next = pagesFor(rail, CARDS.length);
      setPages(next);
      setVisible(CARDS.length - next + 1);
      // Never leave the rail parked past its new end.
      setPage((p) => Math.min(p, next - 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  /* A rail nobody can see has no reason to keep turning. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  /*
   * One timer for the life of the run, advancing through a functional update
   * so it never closes over a stale page. It wraps at the end rather than
   * stopping, stops when the section leaves the screen, when the tab does,
   * when the reader is in it, and when the reader asks it to.
   */
  useEffect(() => {
    if (!playing || !onScreen || interacting || pages < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id = 0;
    const tick = () => setPage((current) => (current + 1) % pages);
    const run = () => {
      window.clearInterval(id);
      if (document.hidden) return;
      id = window.setInterval(tick, AUTOPLAY_MS);
    };
    run();
    document.addEventListener("visibilitychange", run);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", run);
    };
  }, [playing, onScreen, interacting, pages]);

  const onRailKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: page + 1,
      ArrowLeft: page - 1,
      Home: 0,
      End: pages - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPage(Math.min(pages - 1, Math.max(0, next)));
  };

  return (
    <section
      id="industries"
      className="bg-primitive-black pb-20 text-primitive-white bp1020:pb-30"
      aria-roledescription="carousel"
      aria-label="Sectors we work in"
      /*
       * Mouse only. iOS synthesises `mouseenter` on a tap but frequently never
       * sends the matching `mouseleave`, so a single tap latched `interacting`
       * on and the rail stopped for the rest of the visit. Touch has no hover
       * to pause for; focus below still covers the keyboard.
       */
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setInteracting(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setInteracting(false);
      }}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setInteracting(false);
        }
      }}
    >
      <Reveal className="page-gutter grid gap-6 pt-20 bp1020:grid-cols-2 bp1020:gap-10 bp1020:pt-30">
        <h2 className="type-subtitle1 text-balance bp1020:max-w-[var(--span-5)]">
          Digital matters more when the decision matters
        </h2>
        <p className="type-body measure bp1020:max-w-[var(--span-5)]">
          We work with businesses where the website isn&rsquo;t just another
          channel. It&rsquo;s where people decide.
        </p>
      </Reveal>

      <div className="flex w-full flex-col gap-10 overflow-hidden pt-20">
        <div
          ref={(el) => {
            railRef.current = el;
            swipeRef.current = el;
          }}
          id={RAIL_ID}
          role="group"
          aria-live="polite"
          aria-label={`Sectors, showing ${page + 1} to ${Math.min(page + visible, CARDS.length)} of ${CARDS.length}`}
          tabIndex={-1}
          onKeyDown={onRailKey}
          style={{ touchAction: "pan-y" }}
          className="relative ml-(--grid-gutter-width) flex h-(--card-height) gap-(--grid-gutter-width) [--card-aspect-ratio:107/79] [--card-height:calc(var(--card-width)*var(--card-aspect-ratio))] [--card-width:var(--span-10)] [perspective:1000px] bp744:[--card-aspect-ratio:187/138] bp744:[--card-width:var(--span-5)] bp1020:[--card-aspect-ratio:418/309] bp1020:[--card-width:var(--span-4)] bp1280:[--card-aspect-ratio:366/270] bp1280:[--card-width:var(--span-3)]"
        >
          {CARDS.map((card, i) => (
            <PlatformCardView
              key={card.title}
              card={card}
              offset={i - page}
              hidden={i < page || i >= page + visible}
            />
          ))}
        </div>

        <div className="page-gutter flex items-center justify-between">
          {/*
            * Plain buttons, not tabs: there is no panel per dot, they all move
            * the one rail. `aria-current` is read off `page`, so a dot cannot
            * show a position the rail is not in.
            */}
          <div className="flex items-center gap-1" aria-label="Carousel pages">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === page ? "true" : undefined}
                aria-controls={RAIL_ID}
                aria-label={`Page ${i + 1} of ${pages}`}
                onClick={() => setPage(i)}
                /*
                  * The dot is drawn by ::before so the button can be a full
                  * 44px target without the indicator growing with it.
                  */
                className={cn(
                  "flex h-11 items-center justify-center before:block before:h-1 before:rounded-full before:transition-all before:duration-300 before:content-['']",
                  i === page
                    ? "w-8 before:w-6 before:bg-primitive-black"
                    : "w-6 before:w-1 before:bg-white/25",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={playing ? "Pause carousel" : "Play carousel"}
              aria-pressed={!playing}
              onClick={() => setPlaying((value) => !value)}
              className="flex size-11 items-center justify-center rounded-full border border-white/10"
            >
              {playing ? (
                <PauseIcon width={8} height={10} />
              ) : (
                <PlayIcon width={6} height={10} />
              )}
            </button>
            <button
              type="button"
              aria-label="Previous sectors"
              aria-controls={RAIL_ID}
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 disabled:opacity-30"
            >
              <ChevronDownIcon className="rotate-90" width={16} height={16} />
            </button>
            <button
              type="button"
              aria-label="Next sectors"
              aria-controls={RAIL_ID}
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 disabled:opacity-30"
            >
              <ChevronDownIcon className="-rotate-90" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformCardView({
  card,
  offset,
  hidden,
}: {
  card: PlatformCard;
  offset: number;
  /** Slid outside the window the rail is showing. */
  hidden: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      inert={hidden}
      className="absolute top-0 w-[calc(var(--card-width)+var(--grid-gutter-width))] transition-transform duration-500 ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
      style={{
        transform: `translateX(calc(${offset} * (var(--card-width) + var(--grid-gutter-width))))`,
      }}
    >
      <Link
        href={card.href}
        /* Mouse only, for the same reason the rail's hover is — a tap would
         * otherwise leave the card zoomed for good. */
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHovered(false);
        }}
        className="relative flex h-(--card-height) w-(--card-width) shrink-0 flex-col items-start justify-between overflow-hidden rounded-lg bg-surface-raised p-6 text-ink transition-shadow duration-300"
      >
        <div className="relative z-[1] flex w-full flex-col gap-2">
          <h3 className="type-subtitle3">{card.title}</h3>
          <p className="type-body">{card.body}</p>
        </div>

        <div className="absolute inset-0 z-0 h-full w-full">
          <img
              src={fallbackSrc(card.image)}
              srcSet={srcSet(card.image)}
              sizes={SIZES.industry} 
              alt=""
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-transform duration-500",
                  hovered && "scale-105",
                )}
            />

          {/*
            * A white wash keeps the artwork light, with extra coverage
            * behind the dark copy and the bottom-right arrow.
            */}
          <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.82)_35%,rgba(255,255,255,0.25)_65%,rgba(255,255,255,0.65)_100%)]" />
        </div>

        <ArrowRightIcon
          className="absolute right-6 bottom-6 z-[1]"
          width={22}
          height={22}
        />
      </Link>
    </div>
  );
}
