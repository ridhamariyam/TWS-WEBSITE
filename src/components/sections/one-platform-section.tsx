"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";

/*
 * "Everything you need on one platform": a nine-card horizontal carousel.
 *
 * Two details that are easy to get wrong:
 *  - Design Intelligence is a video card. It shows a poster until hover, then
 *    crossfades to the clip — that is the site's own
 *    `--background-video--has-hovered { opacity: 1 }` behaviour, not autoplay.
 *  - Squarespace Payments only exists as .webp; the .jpg variant 404s on
 *    Squarespace's own CDN.
 */

const MEDIA = "/images/components/card-carousel";

type PlatformCard = {
  title: string;
  body: string;
  href: string;
  image: string;
  video?: string;
};

const CARDS: PlatformCard[] = [
  {
    title: "Extensions",
    body: "Streamline shipping, inventory, marketing, and finance with powerful third-party extensions.",
    href: "/extensions/home",
    image: "extensions.webp",
  },
  {
    title: "Squarespace Payments",
    body: "Accept multiple payment options, manage transactions, and accelerate payouts.",
    href: "/payments",
    image: "payment-2.webp",
  },
  {
    title: "Squarespace Capital",
    body: "Fast, flexible financing to expand your team, boost inventory, and more.",
    href: "/capital",
    image: "capital.webp",
  },
  {
    title: "Analytics",
    body: "Track your website’s performance with key traffic and ecommerce metrics.",
    href: "/websites/analytics",
    image: "analytics.webp",
  },
  {
    title: "Website Editing",
    body: "Easily customize every design detail with our next-generation drag-and-drop editor.",
    href: "/website-design",
    image: "website-editing.webp",
  },
  {
    title: "Design Intelligence",
    body: "Your AI creative partner to generate designs, images, and content tailored just for you.",
    href: "/design-intelligence",
    image: "design-intelligence-3.webp",
    video: "design-intelligence-3.mp4",
  },
  {
    title: "Business Email",
    body: "Make your business official with Business Email from Google Workspace.",
    href: "/professional-email",
    image: "business-email.webp",
  },
  {
    title: "Domains",
    body: "Register your dream domain. Free WHOIS privacy, SSL, and premium DNS included.",
    href: "https://domains.squarespace.com",
    image: "domains.webp",
  },
  {
    title: "Search & AI Optimization",
    body: "Increase traffic from search and AI platforms with built-in SEO and AI site auditing tools.",
    href: "/marketing/seo",
    image: "ai-seo.webp",
  },
];

/** Cards visible at once, per breakpoint — drives how many pages the dots show. */
const PAGES = 6;

export function OnePlatformSection() {
  const [page, setPage] = useState(0);

  return (
    <section
      id="one-platform"
      className="bg-primitive-white pb-20 text-primitive-black bp1020:pb-30"
    >
      <Reveal className="page-gutter grid gap-6 pt-20 bp1020:grid-cols-2 bp1020:gap-10">
        <h2 className="text-subtitle1 max-w-[calc((var(--grid-column-width)*5)+(var(--grid-gutter-width)*4))] text-balance">
          Everything you need on one platform
        </h2>
        <p className="text-body max-w-[calc((var(--grid-column-width)*5)+(var(--grid-gutter-width)*4))]">
          Power your day-to-day with all the tools and AI guidance you need to
          manage your business, seamlessly integrated in one place.
        </p>
      </Reveal>

      <div className="flex w-full flex-col gap-10 overflow-hidden pt-20">
        <div className="relative ml-(--grid-gutter-width) flex h-(--card-height) gap-(--grid-gutter-width) [--card-aspect-ratio:107/79] [--card-height:calc(var(--card-width)*var(--card-aspect-ratio))] [--card-width:calc((var(--grid-column-width)*10)+(var(--grid-gutter-width)*9))] [perspective:1000px] bp744:[--card-aspect-ratio:187/138] bp744:[--card-width:calc((var(--grid-column-width)*5)+(var(--grid-gutter-width)*4))] bp1020:[--card-aspect-ratio:418/309] bp1020:[--card-width:calc((var(--grid-column-width)*4)+(var(--grid-gutter-width)*3))] bp1280:[--card-aspect-ratio:366/270] bp1280:[--card-width:calc((var(--grid-column-width)*3)+(var(--grid-gutter-width)*2))]">
          {CARDS.map((card, i) => (
            <PlatformCardView key={card.title} card={card} offset={i - page} />
          ))}
        </div>

        <div className="page-gutter flex items-center justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Carousel pages">
            {Array.from({ length: PAGES }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setPage(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === page ? "w-6 bg-primitive-black" : "w-1 bg-black/25",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex size-11 items-center justify-center rounded-full border border-black/10 disabled:opacity-30"
            >
              <ChevronDownIcon className="rotate-90" width={16} height={16} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              disabled={page >= PAGES - 1}
              onClick={() => setPage((p) => Math.min(PAGES - 1, p + 1))}
              className="flex size-11 items-center justify-center rounded-full border border-black/10 disabled:opacity-30"
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
}: {
  card: PlatformCard;
  offset: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute top-0 w-[calc(var(--card-width)+var(--grid-gutter-width))] transition-transform duration-500 ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none"
      style={{
        transform: `translateX(calc(${offset} * (var(--card-width) + var(--grid-gutter-width))))`,
      }}
    >
      <Link
        href={card.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex h-(--card-height) w-(--card-width) shrink-0 flex-col items-start justify-between overflow-hidden rounded-lg bg-surface-raised p-6 text-primitive-white transition-shadow duration-300"
      >
        <div className="relative z-[1] flex w-full flex-col gap-2">
          <h3 className="text-subtitle3">{card.title}</h3>
          <p className="text-body">{card.body}</p>
        </div>

        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src={`${MEDIA}/${card.image}`}
            alt=""
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-500",
              hovered && (card.video ? "opacity-0 duration-300" : "scale-105"),
            )}
          />
          {card.video ? (
            <video
              className={cn(
                "relative z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)]",
                hovered && "opacity-100",
              )}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
            >
              <source src={`${MEDIA}/${card.video}`} type="video/mp4" />
            </video>
          ) : null}
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
