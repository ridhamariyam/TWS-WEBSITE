"use client";

import { useEffect, useRef } from "react";
import { PRELOADER_DONE } from "@/components/layout/preloader";
import { fallbackSrc, srcSet } from "@/lib/images";
import styles from "./hero-scroll-section.module.css";

/*
 * Hero: an oversized headline with a film set into it, which grows out of the
 * line to fill the screen as the page scrolls.
 *
 * On load the words rise out of their own masks one after another, the
 * leaning words tip over as they land, and the film opens out of a sliver
 * between "digital" and "presence".
 *
 * From 744px the section pins the headline through the scroll sequence. Across
 * that scroll the film travels to the centre of the screen and scales until
 * it covers it, then shrinks to a centered frame as scrolling continues,
 * while the footage inside settles from a 1.5x zoom. Below
 * 744px, and under reduced motion, there is no pin: the film sits under the
 * headline as a plain square.
 *
 * The expansion is written from a scroll listener rather than a CSS
 * view-timeline so it runs the same in every browser.
 */

/*
 * The studio's own film, cut two ways. The master is
 * `assets/videos/hero-film-master.mov`: a portrait montage of six stills,
 * each held for five frames, with a black beat between cycles. Both cuts drop
 * the black beats so the loop never flashes, and keep the master's timing.
 *
 * - `wide` is for the desktop frame, which grows to cover a landscape screen.
 *   Each still is reframed to 16:9 on its subject and upscaled 4x
 *   (Real-ESRGAN) to 2560x1440, so covering the screen does not blow up a
 *   strip of the portrait frame.
 * - `tall` is the portrait cut at 1080x1920 for the square frame on a phone.
 *
 * `scripts/generate-hero-film.py` rebuilds both from the master.
 */
type Film = { mp4: string; poster: string };
const FILM: { wide: Film; tall: Film } | null = {
  wide: { mp4: "/videos/hero-film-wide.mp4", poster: "/videos/hero-film-wide-poster.webp" },
  tall: { mp4: "/videos/hero-film.mp4", poster: "/videos/hero-film-poster.webp" },
};

/*
 * Without a film of the studio's own, the frame holds a still of the
 * studio's own work. (process-card.mp4 is another studio's showreel, client
 * list and all, so it cannot stand in here.)
 */
const STILL = "pen-foundation";

/** What the frame shows: the film where there is one, the still otherwise. */
function FrameMedia({ cut }: { cut: "wide" | "tall" }) {
  return FILM ? (
    <video
      className={styles.film}
      src={FILM[cut].mp4}
      poster={FILM[cut].poster}
      muted
      loop
      playsInline
      preload="none"
    />
  ) : (
    <img
      className={styles.film}
      src={fallbackSrc(STILL)}
      srcSet={srcSet(STILL)}
      sizes="100vw"
      alt=""
      draggable={false}
    />
  );
}

/* tan(10deg): the lean shared by the italic words and the film's frame. */
const LEAN_TAN = 0.1763;

type Word = { text: string; lean?: boolean };

/* Each word's position in the whole headline sets its rise delay. */
const LINES: Word[][] = [
  [{ text: "Make" }, { text: "your" }],
  [{ text: "digital", lean: true }, { text: "presence" }],
  [{ text: "hit" }, { text: "different.", lean: true }],
];

const HEADLINE = LINES.flat()
  .map((w) => w.text)
  .join(" ");

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);

  /* Play whichever film is on screen; the other one never loads. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = [...section.querySelectorAll("video")];
    const pick = () => {
      for (const v of videos) {
        if (v.offsetParent !== null) {
          v.preload = "auto";
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    };
    pick();
    window.addEventListener("resize", pick, { passive: true });
    return () => window.removeEventListener("resize", pick);
  }, []);

  /* The scroll-driven expansion. */
  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const slot = slotRef.current;
    const frame = frameRef.current;
    if (!section || !sticky || !slot || !frame) return;

    const pinned = window.matchMedia(
      "(width >= 744px) and (prefers-reduced-motion: no-preference)",
    );
    let raf = 0;
    /* Where the film rests, measured from the untransformed slot. */
    let rest = { dx: 0, dy: 0, w: 1, h: 1 };

    const measure = () => {
      const s = sticky.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      rest = {
        dx: s.left + s.width / 2 - (r.left + r.width / 2),
        dy: s.top + s.height / 2 - (r.top + r.height / 2),
        w: r.width,
        h: r.height,
      };
    };

    const clear = () => {
      frame.style.transform = "";
      frame.style.clipPath = "";
      frame.style.removeProperty("--zoom");
      section.style.removeProperty("--copy-opacity");
    };

    const draw = () => {
      raf = 0;
      if (!pinned.matches) {
        clear();
        return;
      }
      const box = section.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -box.top / Math.max(1, travel)));

      const { dx, dy, w, h } = rest;
      const vw = sticky.clientWidth;
      const vh = sticky.clientHeight;
      const cover = Math.max(vw / w, vh / h);
      const expand = Math.min(1, p / 0.45);
      const shrink = Math.min(1, Math.max(0, (p - 0.55) / 0.45));
      const easedShrink = shrink * shrink * (3 - 2 * shrink);
      // Finish at 68% of the viewport width, keeping the film's own aspect.
      const finalScale = Math.min(vw * 0.68 / w, vh * 0.72 / h);
      const scale = lerp(lerp(1, cover, expand), finalScale, easedShrink);

      /* The frame's own box, in percent: at rest a leaning parallelogram,
       * at full size the part of it that the screen shows. */
      const lean = ((LEAN_TAN * h) / w) * 100 * (1 - expand);
      const insetX = ((1 - vw / w / cover) / 2) * 100 * expand * (1 - easedShrink);
      const insetY = ((1 - vh / h / cover) / 2) * 100 * expand * (1 - easedShrink);

      frame.style.transform = `translate(${dx * expand}px, ${dy * expand}px) scale(${scale})`;
      frame.style.clipPath = `polygon(${insetX + lean}% ${insetY}%, ${100 - insetX}% ${insetY}%, ${100 - insetX - lean}% ${100 - insetY}%, ${insetX}% ${100 - insetY}%)`;
      frame.style.setProperty("--zoom", String(lerp(1.5, 1, expand)));
      section.style.setProperty("--copy-opacity", String(1 - Math.min(1, expand * 2)));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    /*
     * The film opens on load; the scroll only takes over once it has. Behind
     * the preloader the entrance is held, so the clock starts when it lifts.
     */
    let start = 0;
    const begin = () => {
      start = window.setTimeout(() => {
        measure();
        section.dataset.settled = "true";
        draw();
      }, 1400);
    };
    if (document.querySelector("[data-preloader]")) {
      window.addEventListener(PRELOADER_DONE, begin, { once: true });
    } else {
      begin();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    pinned.addEventListener("change", onResize);
    return () => {
      window.clearTimeout(start);
      window.removeEventListener(PRELOADER_DONE, begin);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      pinned.removeEventListener("change", onResize);
    };
  }, []);

  let index = 0;

  return (
    <section ref={sectionRef} id="hero" className={styles.section}>
      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {/* One sentence for a screen reader; the words below are visual. */}
            <span className="sr-only">{HEADLINE}</span>
            {LINES.map((line, l) => (
              <span key={l} className={styles.line} aria-hidden="true">
                {line.map((word, w) => {
                  const i = index++;
                  const node = (
                    <span
                      key={word.text}
                      className={word.lean ? `${styles.mask} ${styles.lean}` : styles.mask}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span className={styles.word}>{word.text}</span>
                    </span>
                  );
                  /* The film sits between the two words of the middle line. */
                  if (l === 1 && w === 0) {
                    return [
                      node,
                      <span
                        key="film"
                        ref={slotRef}
                        className={styles.slot}
                        aria-hidden="true"
                      >
                        <span ref={frameRef} className={styles.frame}>
                          <FrameMedia cut="wide" />
                        </span>
                      </span>,
                    ];
                  }
                  return node;
                })}
              </span>
            ))}
          </h1>

          <p className={styles.description}>
            <span>
              Your website is where most people meet your business. We make
              that first impression count.
            </span>
          </p>
        </div>
      </div>

      {/* Below 744px the film is a square under the headline instead. */}
      <div className={styles.filmFull} aria-hidden="true">
        <FrameMedia cut="tall" />
      </div>
    </section>
  );
}
