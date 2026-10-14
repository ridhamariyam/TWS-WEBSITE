"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from "@/components/ui/icons";
import { serviceHref } from "@/lib/site-links";
import { SIZES, fallbackSrc, srcSet } from "@/lib/images";
import { useSwipe } from "@/hooks/use-swipe";

/*
 * "We make the internet work for your business" — the capabilities, as a pill
 * rail wired 1:1 to a carousel.
 *
 * Pill n slides to card n; there is no independent scrolling. The indicator is
 * one element that slides and scales to the active label rather than a
 * per-pill background. The card footnote is hover-only, and only at >=1020px.
 */

type Card = {
  pill: string;
  title: string;
  body: string;
  footnote: string;
  href: string;
  image: string;
  /** The artwork already carries the copy, so the overlay is suppressed. */
  composed?: boolean;
};

const CARDS: Card[] = [
  {
    pill: "Web Design",
    title: "Websites with a job to do",
    body: "Custom websites designed around your business, your audience and what you need people to do next. Fast. Responsive. Built properly.",
    footnote: "Good for: Brand Sites · Launches · Redesigns",
    href: serviceHref("web-design"),
    image: "web-design",
    composed: true,
  },
  {
    pill: "E-Commerce",
    title: "Built to sell, not just look pretty",
    body: "From product discovery to checkout, we design e-commerce experiences around how people actually buy. Less friction. Better journeys. More room to grow.",
    footnote: "Good for: D2C Brands · Retailers · Subscriptions",
    href: serviceHref("ecommerce"),
    image: "ecommerce",
    composed: true,
  },
  {
    pill: "Web Applications",
    title: "Software that fits the way you work",
    body: "Custom web applications, platforms, portals and business tools built around real workflows. No template gymnastics.",
    footnote: "Good for: Portals · Dashboards · Booking Systems",
    href: serviceHref("web-applications"),
    image: "web-applications",
  },
];

/* Matches the industries carousel, so the two are never out of step on one
 * screen. Short enough that the pause control is doing real work. */
const AUTOPLAY_MS = 1000;

export function CapabilitiesSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  /* Hovering or tabbing in stops it advancing (WCAG 2.2.2). For a keyboard
   * user it is worse than annoying: focus goes with the card. */
  const [interacting, setInteracting] = useState(false);
  const pillRefs = useRef<Array<HTMLLIElement | null>>([]);
  /** The pill rail's own horizontal scroller — never the page. */
  const railScrollRef = useRef<HTMLDivElement>(null);
  /** The first render positions the indicator; it must not scroll anything. */
  const firstSlide = useRef(true);
  const railRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const go = useCallback(
    (next: number) => setActive((next + CARDS.length) % CARDS.length),
    [],
  );

  const swipeRef = useSwipe<HTMLDivElement>((d) => go(active + d));

  /* The rail announces itself as a tablist, so it has to answer arrow keys:
   * the roving selection moves and the carousel follows. */
  const onTablistKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: CARDS.length - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const index = (next + CARDS.length) % CARDS.length;
    setActive(index);
    pillRefs.current[index]?.querySelector("button")?.focus();
  };

  // The indicator slides and resizes, so it is measured from the live DOM
  // rather than positioned by index.
  useLayoutEffect(() => {
    const el = pillRefs.current[active];
    if (!el) return;
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth });

    /*
     * On a phone the rail is wider than the screen, so a slide has to bring
     * its pill with it or the indicator moves to a pill nobody can see.
     *
     * Scrolled directly, not with `scrollIntoView`: that walks up every
     * scrollable ancestor and scrolls the document, carrying the reader off
     * the hero. Nothing outside the rail moves.
     */
    if (firstSlide.current) {
      firstSlide.current = false;
      return;
    }
    const rail = railScrollRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth + 1) return;
    const railBox = rail.getBoundingClientRect();
    const pill = el.getBoundingClientRect();
    rail.scrollBy({
      left: pill.left + pill.width / 2 - (railBox.left + railBox.width / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  /* Its own effect: hung off the one above, the listener would be torn down
   * and re-added on every slide. */
  useEffect(() => {
    const measure = () => {
      const el = pillRefs.current[active];
      if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    };
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  /* A carousel nobody can see has no reason to keep turning. */
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
   * One timer for the life of the run, advancing through a functional update:
   * keying it on `active` would restart it on every slide. It stops when the
   * section leaves the screen, when the tab does, and on request.
   */
  useEffect(() => {
    if (!playing || !onScreen || interacting) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id = 0;
    const tick = () =>
      setActive((current) => (current + 1) % CARDS.length);
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
  }, [playing, onScreen, interacting]);

  return (
    <section
      id="capabilities"
      className="bg-primitive-black pt-20 pb-20 text-primitive-white bp1020:pt-30 bp1020:pb-30"
      aria-roledescription="carousel"
      aria-label="What we do"
      /*
       * Mouse only. iOS synthesises `mouseenter` on a tap but frequently never
       * sends the matching `mouseleave`, so a single tap latched `interacting`
       * on and the carousel stopped for the rest of the visit. Touch has no
       * hover to pause for; focus below still covers the keyboard.
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
      <Reveal className="page-gutter pb-6 text-center bp744:pb-8 bp1020:pb-10">
        <h2 className="type-subtitle1 mx-auto max-w-[var(--span-10)] text-balance">
          We make the internet work for your business
        </h2>
        <p className="type-body measure mx-auto mt-6">
          From first idea to final interaction, we bring strategy, design and
          engineering into the same room.
        </p>
      </Reveal>

      <div
        ref={railScrollRef}
        className="page-gutter flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bp744:pb-8 bp1020:justify-center bp1020:pb-10"
      >
        <ul
          role="tablist"
          aria-label="Capabilities"
          onKeyDown={onTablistKey}
          className="relative mx-auto flex h-[62px] w-fit shrink-0 flex-row items-center justify-center rounded-full bg-white/5 p-1"
        >
          {indicator ? (
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 z-0 rounded-full bg-white/15 transition-[transform,width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
              style={{
                width: indicator.w - 8,
                transform: `translateX(${indicator.x + 4}px)`,
                left: 0,
              }}
            />
          ) : null}
          {CARDS.map((card, i) => (
            <li
              key={card.pill}
              /* A listitem is not allowed inside a tablist. */
              role="presentation"
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              className="relative px-1"
            >
              <button
                type="button"
                role="tab"
                id={`capability-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`capability-panel-${i}`}
                /* Roving tabstop: the rail is one stop, arrows move inside it. */
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                className="type-body relative z-[1] flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 py-3 whitespace-nowrap select-none"
              >
                {card.pill}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/*
        * One aspect at every width, and it is the artwork's own 3:2.
        * A portrait card on a phone cropped the composed art to half its
        * width — the headline survived because the art is pinned left, and
        * the product shot beside it was simply gone. The card is shorter on a
        * phone than it was; what is in it is the whole picture.
        */}
      <div className="relative flex w-full flex-col gap-6 overflow-hidden [--card-aspect-ratio:3/2] [--card-height:calc(var(--card-width)/(var(--card-aspect-ratio)))] [--card-width:100vw] bp1020:gap-8 bp1020:[--card-width:var(--span-8)]">
        <div
          ref={(el) => {
            railRef.current = el;
            swipeRef.current = el;
          }}
          /* Vertical scrolling stays the browser's; only across is ours. */
          style={{ touchAction: "pan-y" }}
          className="relative h-(--card-height) w-(--card-width) bp1020:w-[calc(var(--card-width)+var(--grid-gutter-width))] bp1020:translate-x-[calc((var(--grid-column-width)*2)+(var(--grid-gutter-width)*3))]">
          {CARDS.map((card, i) => (
            <div
              key={card.href}
              role="tabpanel"
              id={`capability-panel-${i}`}
              aria-labelledby={`capability-tab-${i}`}
              /*
                * Everything but the current card is inert, which is what stops
                * Tab landing on a card translated off screen and dragging the
                * rail sideways to reveal it.
                */
              inert={i !== active}
              className="absolute top-0 h-(--card-height) w-(--card-width) shrink-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none bp1020:w-[calc(var(--card-width)+var(--grid-gutter-width))]"
              style={{
                left: 0,
                transform: `translateX(calc(${i - active} * 100%))`,
              }}
            >
              <Link
                href={card.href}
                data-is-active={i === active}
                className="group relative flex h-full w-full flex-col gap-3 overflow-hidden p-8 px-4 text-primitive-white transition-shadow duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:shadow-[0_39px_23px_#0000000d,0_17px_17px_#00000017,0_4px_9px_#0000001a] bp744:px-6 bp1020:w-(--card-width) bp1020:rounded-lg bp1020:p-8"
              >
                <img
              src={fallbackSrc(card.image)}
              srcSet={srcSet(card.image)}
              sizes={SIZES.capability} 
              alt=""
                    loading="lazy"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover",
                      // Composed art is 3:2 with its type down the left; a
                      // portrait card would crop the headline in half.
                      card.composed && "object-left",
                    )}
            />

                {/*
                  * Backing for the white copy, on the cards that print any.
                  * Deliberately short — strong where the title sits, clear by
                  * 44% — so the lower half of the art keeps full strength.
                  * Measured on the art in use: 7.0:1 at worst.
                  */}
                {card.composed ? null : (
                  <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.7)_30%,rgba(17,17,17,0)_44%)]" />
                )}

                {/*
                  * Where the art already carries the copy the heading stays in
                  * the document and only leaves the screen: a link whose whole
                  * name is a background image announces as nothing.
                  */}
                <h3
                  className={cn(
                    "type-subtitle2 relative z-[1] max-w-[365px]",
                    card.composed && "sr-only",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "type-body relative z-[1] max-w-[365px]",
                    card.composed && "sr-only",
                  )}
                >
                  {card.body}
                </p>
                {/*
                  * The footnote sits in the part the top scrim deliberately
                  * clears, where white type fell to 1.8:1 on the lighter art.
                  * This scrim arrives with it, so a card at rest is unchanged.
                  */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-[linear-gradient(0deg,rgba(17,17,17,0.78)_0%,rgba(17,17,17,0.45)_45%,rgba(17,17,17,0)_100%)] opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:opacity-100 bp1020:block"
                />
                <p className="type-footnote absolute bottom-8 left-8 z-[1] hidden opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:opacity-100 bp1020:block">
                  {card.footnote}
                </p>
                <p className="type-subtitle3 absolute right-8 bottom-8 select-none">
                  <ArrowRightIcon width={22} height={22} />
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/*
          * What slide we are on, for a screen reader. The cards cannot carry
          * this: only one is in the accessibility tree at a time, so there is
          * nothing to announce a change against.
          */}
        <p className="sr-only" aria-live="polite">
          {`${CARDS[active].pill}, ${active + 1} of ${CARDS.length}`}
        </p>

        <div className="flex items-center justify-end gap-2 px-(--grid-gutter-width)">
          <button
            type="button"
            aria-label={playing ? "Pause carousel" : "Play carousel"}
            aria-pressed={!playing}
            onClick={() => setPlaying((p) => !p)}
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
            aria-label="Previous capability"
            onClick={() => go(active - 1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/10"
          >
            <ArrowLeftIcon width={22} height={22} />
          </button>
          <button
            type="button"
            aria-label="Next capability"
            onClick={() => go(active + 1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/10"
          >
            <ArrowRightIcon width={22} height={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
