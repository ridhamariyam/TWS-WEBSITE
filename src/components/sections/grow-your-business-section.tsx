"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from "@/components/icons";

/*
 * "Grow your business": a pill rail wired 1:1 to a king carousel.
 *
 * Clicking pill n slides to card n — there is no independent scroll behaviour
 * here. The carousel also auto-advances, with a pause/play toggle, and the
 * pill indicator is a single element that both slides and scales to fit the
 * active label rather than a per-pill background.
 *
 * The card footnote ("Great for: …") is hidden until hover, and only at
 * >=1020px — which is why it does not appear in a plain screenshot.
 */

const IMG = "/images/pages/homepage-2025/grow-your-business";

type Card = {
  pill: string;
  title: string;
  body: string;
  footnote: string;
  href: string;
  image: string;
};

const CARDS: Card[] = [
  {
    pill: "Services",
    title: "Offer services",
    body: "Promote your experiences and offerings, collect attendee information, and get paid for your work.",
    footnote: "Great for: Camps · Consultants · Event Organizers",
    href: "/services",
    image: "services",
  },
  {
    pill: "Online Store",
    title: "Sell products",
    body: "Merchandise your products, accept payments, manage orders and shipping, and more.",
    footnote: "Great for: Artisans · Retailers · Limited Releases",
    href: "/online-stores",
    image: "online-store",
  },
  {
    pill: "Invoicing",
    title: "Invoice clients",
    body: "Legitimize your business and get paid with professional proposals, contracts, and invoices.",
    footnote: "Great for: Contractors · Freelancers · Event Planners",
    href: "/invoicing",
    image: "invoicing",
  },
  {
    pill: "Scheduling",
    title: "Get booked",
    body: "Seamless appointment booking, automated calendar management, and integrated payments.",
    footnote: "Great for: Beauty Professionals · Wellness Providers · Photographers",
    href: "/scheduling",
    image: "scheduling",
  },
  {
    pill: "Donations",
    title: "Collect donations",
    body: "Create fundraising campaigns, accept donations on your website, and send donors targeted emails.",
    footnote: "Great for: Advocacy Groups · Non-profits · Fundraisers",
    href: "/donations",
    image: "donations",
  },
  {
    pill: "Memberships",
    title: "Monetize your content",
    body: "Offer exclusive access to your work, earn recurring revenue, and engage with your community.",
    footnote: "Great for: Instructors · Content Creators · Community Leaders",
    href: "/content",
    image: "memberships",
  },
  {
    pill: "Blog",
    title: "Post your ideas",
    body: "Launch a blog, grow your readership, and add paywalls to monetize access.",
    footnote: "Great for: Food Writers · Wellness Coaches · Travel Influencers",
    href: "/websites/create-a-blog",
    image: "blog",
  },
  {
    pill: "Portfolio",
    title: "Showcase your work",
    body: "Build a portfolio website to highlight projects, share your story, and help clients get in contact.",
    footnote: "Great for: Designers · Photographers · Artists & Illustrators",
    href: "/websites/create-a-portfolio",
    image: "portfolio",
  },
];

const AUTOPLAY_MS = 6000;

export function GrowYourBusinessSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const pillRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const go = useCallback(
    (next: number) => setActive((next + CARDS.length) % CARDS.length),
    [],
  );

  // The indicator is one pill that slides and resizes, so it has to be measured
  // from the live DOM rather than positioned by index.
  useLayoutEffect(() => {
    const el = pillRefs.current[active];
    if (!el) return;
    const measure = () =>
      setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, playing, go]);

  return (
    <section
      id="grow-your-business"
      className="bg-primitive-white pb-20 text-primitive-black bp1020:pb-30"
    >
      <Reveal className="page-gutter pb-6 text-center bp744:pb-8 bp1020:pb-10">
        <h2 className="type-subtitle1 mx-auto max-w-[calc((var(--grid-column-width)*10)+(var(--grid-gutter-width)*9))] text-balance">
          Grow your business
        </h2>
        <p className="type-body mt-6">You deserve a website that can do it all.</p>
      </Reveal>

      <div className="overflow-y-auto px-4 pb-6 bp744:px-6 bp744:pb-8 bp1020:flex bp1020:items-center bp1020:justify-center bp1020:pb-10">
        <ul className="relative flex h-[62px] w-fit flex-row items-center justify-center rounded-full bg-black/5 p-1">
          {indicator ? (
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 z-0 rounded-full bg-primitive-white transition-[transform,width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
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
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              className="relative px-1"
            >
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === active}
                className="type-body relative z-[1] flex cursor-pointer items-center justify-center rounded-full px-4 py-3 whitespace-nowrap select-none"
              >
                {card.pill}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex w-full flex-col gap-6 overflow-hidden [--card-aspect-ratio:3/4] [--card-height:calc(var(--card-width)/(var(--card-aspect-ratio)))] [--card-width:100vw] bp744:[--card-aspect-ratio:4/3] bp1020:gap-8 bp1020:[--card-aspect-ratio:16/10] bp1020:[--card-width:calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))]">
        <div className="relative h-(--card-height) w-(--card-width) bp1020:w-[calc(var(--card-width)+var(--grid-gutter-width))] bp1020:translate-x-[calc((var(--grid-column-width)*2)+(var(--grid-gutter-width)*3))]">
          {CARDS.map((card, i) => (
            <div
              key={card.href}
              className="absolute top-0 h-(--card-height) w-(--card-width) shrink-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none bp1020:w-[calc(var(--card-width)+var(--grid-gutter-width))]"
              style={{
                left: 0,
                transform: `translateX(calc(${i - active} * 100%))`,
              }}
            >
              <Link
                href={card.href}
                data-is-active={i === active}
                tabIndex={i === active ? undefined : -1}
                aria-hidden={i !== active}
                className="group relative flex h-full w-full flex-col gap-3 overflow-hidden p-8 px-4 text-primitive-white transition-shadow duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:shadow-[0_39px_23px_#0000000d,0_17px_17px_#00000017,0_4px_9px_#0000001a] bp744:px-6 bp1020:w-(--card-width) bp1020:rounded-lg bp1020:p-8"
              >
                <picture>
                  <source
                    media="(min-width: 1020px)"
                    srcSet={`${IMG}/${card.image}-desktop.webp`}
                  />
                  <source
                    media="(min-width: 744px)"
                    srcSet={`${IMG}/${card.image}-tablet.webp`}
                  />
                  <img
                    src={`${IMG}/${card.image}-mobile.webp`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
                <h3 className="type-subtitle2 font-clarkson-serif relative z-[1] max-w-[365px]">
                  {card.title}
                </h3>
                <p className="type-body relative z-[1] max-w-[365px]">{card.body}</p>
                <p className="type-footnote absolute bottom-8 left-8 hidden opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:opacity-100 bp1020:block">
                  {card.footnote}
                </p>
                <p className="type-subtitle3 absolute right-8 bottom-8 select-none">
                  <ArrowRightIcon width={22} height={22} />
                </p>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 px-(--grid-gutter-width)">
          <button
            type="button"
            aria-label={playing ? "Pause carousel" : "Play carousel"}
            onClick={() => setPlaying((p) => !p)}
            className="flex size-11 items-center justify-center rounded-full border border-black/10"
          >
            {playing ? (
              <PauseIcon width={8} height={10} />
            ) : (
              <PlayIcon width={6} height={10} />
            )}
          </button>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(active - 1)}
            className="flex size-11 items-center justify-center rounded-full border border-black/10"
          >
            <ArrowLeftIcon width={22} height={22} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(active + 1)}
            className="flex size-11 items-center justify-center rounded-full border border-black/10"
          >
            <ArrowRightIcon width={22} height={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
