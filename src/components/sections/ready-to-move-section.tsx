"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Film } from "@/components/ui/film";
import { fallbackSrc, srcSet } from "@/lib/images";
import { ROUTES } from "@/lib/site-links";
import styles from "./ready-to-move-section.module.css";

/*
 * "Ready to move forward?", after the closing carousel block on
 * waverunmedia.com (docs/research/waverunmedia.com): the mark, the question,
 * one button, and a wheel of twelve cards whose top arc shows under them.
 *
 * As there, the wheel turns from 0 to 80 degrees across the scroll that
 * carries it through the screen, lagging the scroll by about three seconds
 * (the source's GSAP `scrub: 3`), and a card lifts under the pointer. The
 * cards are the studio's own: its builds, its films and its capability and
 * sector art. Films play only while they are on screen.
 */

type Slide = { image: string } | { film: { src: string; poster: string; w: number; h: number } };

const SLIDES: Slide[] = [
  { image: "web-design" },
  { film: { src: "/videos/zeen-store.mp4", poster: "/videos/zeen-store-poster.webp", w: 1440, h: 662 } },
  { image: "real-estate" },
  { film: { src: "/videos/pen-mobile.mp4", poster: "/videos/pen-mobile-poster.webp", w: 408, h: 810 } },
  { image: "ecommerce" },
  { image: "hospitality" },
  { film: { src: "/videos/brand-collage.mp4", poster: "/videos/brand-collage-poster.webp", w: 640, h: 360 } },
  { image: "web-applications" },
  { image: "healthcare" },
  { film: { src: "/videos/pen-desktop.mp4", poster: "/videos/pen-desktop-poster.webp", w: 1440, h: 716 } },
  { image: "professional-services" },
  { image: "startups-technology" },
];

const WORDS = [["Ready", "to", "Move"], ["Forward?"]];

export function ReadyToMoveSection() {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const el = wheel.current;
    if (!root || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Entrance: once, as the section's top reaches the bottom of the screen.
    const enter = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        root.dataset.in = "";
        enter.disconnect();
      }
    });
    enter.observe(root);

    // The wheel: 0 → 80deg while it crosses the screen, eased like scrub 3.
    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return 80 * Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };
    let angle = target();
    let raf = 0;
    let last = performance.now();
    let near = false;
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const goal = target();
      angle = reduce ? goal : angle + (goal - angle) * (1 - Math.exp(-dt / 0.6));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      if (near && (Math.abs(goal - angle) > 0.01 || !reduce)) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && near) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const watch = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        start();
      },
      { rootMargin: "50% 0px" },
    );
    watch.observe(el);
    window.addEventListener("scroll", start, { passive: true });
    el.style.transform = `rotate(${angle}deg)`;
    return () => {
      cancelAnimationFrame(raf);
      enter.disconnect();
      watch.disconnect();
      window.removeEventListener("scroll", start);
    };
  }, []);

  let n = 0;
  return (
    <section ref={section} className={styles.section} aria-labelledby="ready-title">
      <img
        className={`${styles.logo} ${styles.fade}`}
        src="/icons/tws-logo.png"
        alt="TWS"
        width={121}
        height={48}
      />
      <h2 id="ready-title" className={styles.title} aria-label="Ready to Move Forward?">
        {WORDS.map((line, l) => (
          <span key={l} className={styles.line} aria-hidden="true">
            {line.map((word, w) => (
              <span key={w}>
                <span className={styles.word} style={{ "--i": n++ } as React.CSSProperties}>
                  {word}
                </span>
                {w < line.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <Link
        href={ROUTES.contact}
        className={`${styles.button} ${styles.fade}`}
        style={{ "--delay": "0.2s" } as React.CSSProperties}
      >
        Let&rsquo;s talk
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 66 20" fill="none">
            <path d="M0 9.35352L64 9.35352" stroke="currentColor" />
            <path d="M56.0991 18.9565L62.5722 12.4835C64.1343 10.9214 64.1343 8.3887 62.5722 6.8266L56.0991 0.353516" stroke="currentColor" />
          </svg>
        </span>
      </Link>

      <div className={styles.window} aria-hidden="true">
        <div ref={wheel} className={styles.wheel}>
          {SLIDES.map((slide, i) => (
            <div key={i} className={styles.slide} style={{ "--n": i } as React.CSSProperties}>
              {"film" in slide ? (
                <Film
                  src={slide.film.src}
                  poster={slide.film.poster}
                  width={slide.film.w}
                  height={slide.film.h}
                  className={styles.media}
                />
              ) : (
                <img
                  className={styles.media}
                  src={fallbackSrc(slide.image)}
                  srcSet={srcSet(slide.image)}
                  sizes="16vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
