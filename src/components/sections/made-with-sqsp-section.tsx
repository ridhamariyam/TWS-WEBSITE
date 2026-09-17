"use client";

import { useEffect, useRef, useState } from "react";

/*
 * "Made with Squarespace".
 *
 * On the live site the tilted wall of customer sites is a WebGL scene — the
 * section contains a `.scene__canvas`, not DOM images, so there is no markup or
 * texture set to clone. What ships here is Squarespace's own degradation path:
 * the `made-with-sqsp__fallback` still image they serve when the scene can't
 * run, with a light scroll-linked parallax so it still drifts as you pass it.
 *
 * The screen-reader list is not a fallback — it exists on the live page
 * alongside the canvas, because the wall itself is decorative. It stays
 * off-screen until focused, exactly as the source does.
 */

const DIR = "/images/pages/homepage-2025/made-with-sqsp";

const SHOWCASE_LINKS = [
  { label: "samfresquez.com", href: "https://www.samfresquez.com" },
  { label: "andamirobk.com", href: "https://www.andamirobk.com/" },
  { label: "noraventura.com", href: "https://www.noraventura.com/" },
  { label: "yarzatwins.com", href: "https://www.yarzatwins.com" },
  { label: "myrtlegreen.org", href: "https://www.myrtlegreen.org" },
  { label: "littleripper.la", href: "https://www.littleripper.la" },
  { label: "breathpod.com", href: "https://www.breathpod.com" },
  { label: "franklygoodcoffee.com", href: "https://www.franklygoodcoffee.com" },
  { label: "thedial.world", href: "https://www.thedial.world/" },
  { label: "shopmemor.com", href: "https://www.shopmemor.com" },
  { label: "abathhouse.com", href: "https://www.abathhouse.com" },
  { label: "margaretrajic.com", href: "https://www.margaretrajic.com" },
  { label: "thesorrygirls.com", href: "https://www.thesorrygirls.com" },
  { label: "onemag.us", href: "https://www.onemag.us" },
  { label: "fatchoynyc.com", href: "https://www.fatchoynyc.com" },
  { label: "samuelsparrow.com", href: "https://www.samuelsparrow.com" },
  { label: "camptowncatskills.com", href: "https://camptowncatskills.com" },
  { label: "shopnotworkrelated.com", href: "https://www.shopnotworkrelated.com" },
  { label: "stretchsquared.com", href: "https://www.stretchsquared.com" },
  { label: "notcrispyenough.com", href: "https://www.notcrispyenough.com" },
];

export function MadeWithSqspSection() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0.5);

  // Scroll progress through the section, 0 -> 1, used for the parallax drift.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const span = rect.height + window.innerHeight;
        setProgress(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="made-with-sqsp"
      className="relative overflow-hidden bg-primitive-black"
    >
      <div className="relative h-[80svh] min-h-[560px] w-full" aria-hidden="true">
        <picture>
          <source media="(min-width: 1020px)" srcSet={`${DIR}/fallback-desktop.webp`} />
          <source media="(min-width: 744px)" srcSet={`${DIR}/fallback-tablet.webp`} />
          <img
            src={`${DIR}/fallback-mobile-1.webp`}
            alt=""
            loading="lazy"
            className="h-full w-full scale-110 object-cover will-change-transform"
            style={{ transform: `scale(1.12) translateY(${(progress - 0.5) * -6}%)` }}
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_60%,rgba(0,0,0,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[100] flex flex-col items-center justify-center">
          <h2 className="type-title2 text-center text-primitive-white">
            <span className="block font-clarkson font-normal">Made with</span>
            <span className="block font-clarkson font-normal">Squarespace</span>
          </h2>
        </div>
      </div>

      {/*
        Off-screen until focused, matching `.made-with-sqsp__accessible-list`:
        1px box at left:-10000px that expands on :focus-within.
      */}
      <div
        role="region"
        aria-label="Websites made with Squarespace"
        className="absolute top-auto -left-[10000px] z-[-1] size-px overflow-hidden bg-primitive-black p-3 focus-within:top-0 focus-within:left-0 focus-within:z-[1000] focus-within:h-full focus-within:w-auto focus-within:overflow-auto"
      >
        <h2 className="sr-only">Websites made with Squarespace</h2>
        <p className="sr-only">
          This section contains a list of websites created using Squarespace.
          Each link will open the website in a new tab.
        </p>
        <ul className="grid grid-cols-1 gap-3">
          {SHOWCASE_LINKS.map((site) => (
            <li key={site.href}>
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--inline inline-block text-primitive-white"
              >
                {site.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
