"use client";

import { useEffect, useRef, useState } from "react";
import { easeInOut, easeOut, lerp, range } from "./use-scroll-stage";
import { prefersReducedMotion } from "./three-kit";
import styles from "./flow.module.css";

/*
 * The homepage's opening, played over the page on white:
 *
 *   0.15–0.85s  the TWS mark rises into the middle with the film playing
 *               inside its letters;
 *   0.55–1.15s  the tagline comes into focus under it, holds, and goes
 *               (1.90–2.20s);
 *   2.20–3.70s  the mark swells from its very middle until the film fills
 *               the screen;
 *   3.75–4.65s  the white falls away and the film settles into the hero's
 *               card (on the homepage, the whole screen), which plays the
 *               same film, so the opening lands on the hero with nothing in
 *               between;
 *   4.55–4.80s  the overlay fades over the card and is gone.
 *
 * A click, key or scroll skips to the landing. It plays on a full load of the
 * homepage, not when coming back to it within the site, and not at all for
 * anyone who asks for reduced motion. Its markup is in the server render, so
 * the page never shows before it; <noscript> hides it without JavaScript.
 */

const FILM = { mp4: "/videos/hero-film-wide.mp4", poster: "/videos/hero-film-wide-poster.webp" };

/** public/icons/tws-mask.svg: the logo traced, 1989 × 449. */
const MASK_RATIO = 449 / 1989;
/*
 * The mark's middle is solid: the largest circle around it inside the
 * letters has this radius, as a fraction of the mask's width, so the mask is
 * fully open once that circle covers the screen.
 */
const MIDDLE_RADIUS = 0.034;

const T = {
  rise: [0.15, 0.85],
  lineIn: [0.55, 1.15],
  lineOut: [1.9, 2.2],
  zoom: [2.2, 3.7],
  land: [3.75, 4.65],
  fade: [4.55, 4.8],
} as const;

/* Set once it has played, so navigating back to the homepage does not replay it. */
let played = false;

export function FlowPreloader({ line }: { line: string }) {
  const [shown, setShown] = useState(() => !played);
  const rootRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const shadeRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!shown) return;
    played = true;
    if (prefersReducedMotion()) {
      setShown(false);
      return;
    }

    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const start = performance.now();
    let offset = 0;
    const skip = () => {
      const now = (performance.now() - start) / 1000 + offset;
      if (now < T.land[0]) offset += T.land[0] - now;
    };
    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((name) => window.addEventListener(name, skip, { passive: true }));

    let frame = requestAnimationFrame(function tick() {
      const s = (performance.now() - start) / 1000 + offset;
      draw(s);
      if (s < T.fade[1]) frame = requestAnimationFrame(tick);
      else setShown(false);
    });

    // Where the hero's card sits, measured when the landing starts.
    let card: DOMRect | null = null;
    let cardRadius = 14;

    function draw(s: number) {
      const win = windowRef.current;
      const root = rootRef.current;
      if (!win || !root) return;
      const { innerWidth: w, innerHeight: h } = window;

      const rise = easeOut(range(s, ...T.rise));
      const t = easeInOut(range(s, ...T.zoom));
      // Grows by a constant factor per moment, so the zoom feels even.
      const from = Math.min(w * 0.72, 900);
      const to = (Math.hypot(w, h) / 2 + 60) / MIDDLE_RADIUS;
      const size = from * Math.pow(to / from, t);
      const x = w / 2 - size / 2;
      const y = h / 2 - (size * MASK_RATIO) / 2 + (1 - rise) * h * 0.35;

      if (t >= 1) {
        win.style.maskImage = "none";
        win.style.webkitMaskImage = "none";
      } else {
        const sz = `${size.toFixed(1)}px auto`;
        const pos = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        win.style.maskSize = sz;
        win.style.webkitMaskSize = sz;
        win.style.maskPosition = pos;
        win.style.webkitMaskPosition = pos;
      }
      win.style.opacity = rise.toFixed(3);
      if (filmRef.current) filmRef.current.style.transform = `scale(${lerp(1.35, 1, t).toFixed(4)})`;

      const tagline = lineRef.current;
      if (tagline) {
        const v = easeOut(range(s, ...T.lineIn)) * (1 - range(s, ...T.lineOut));
        tagline.style.opacity = v.toFixed(3);
        tagline.style.filter = v < 0.99 ? `blur(${((1 - v) * 12).toFixed(1)}px)` : "none";
        tagline.style.transform = `translate(-50%, ${((1 - v) * 14 + (1 - rise) * h * 0.35).toFixed(1)}px)`;
      }

      // The landing: the film's frame closes in on the hero card.
      const land = easeInOut(range(s, ...T.land));
      if (land > 0) {
        if (!card) {
          const hero = document.querySelector<HTMLElement>("[data-hero-card]");
          card = hero?.getBoundingClientRect() ?? new DOMRect(w * 0.3, h * 0.15, w * 0.4, h * 0.7);
          if (hero) cardRadius = parseFloat(getComputedStyle(hero).borderTopLeftRadius) || 0;
          // Start the hero's copy of the film where this one is, so the cut is invisible.
          const heroVideo = hero?.querySelector("video");
          if (heroVideo && videoRef.current) heroVideo.currentTime = videoRef.current.currentTime;
        }
        win.style.left = `${(card.left * land).toFixed(1)}px`;
        win.style.top = `${(card.top * land).toFixed(1)}px`;
        win.style.width = `${lerp(w, card.width, land).toFixed(1)}px`;
        win.style.height = `${lerp(h, card.height, land).toFixed(1)}px`;
        win.style.borderRadius = `${(cardRadius * land).toFixed(1)}px`;
      }
      root.style.backgroundColor = `rgb(255 255 255 / ${(1 - range(s, T.land[0], T.land[0] + 0.35)).toFixed(3)})`;
      if (shadeRef.current) shadeRef.current.style.opacity = land.toFixed(3);
      root.style.opacity = (1 - range(s, ...T.fade)).toFixed(3);
    }

    return () => {
      cancelAnimationFrame(frame);
      events.forEach((name) => window.removeEventListener(name, skip));
      html.style.overflow = overflow;
    };
  }, [shown]);

  if (!shown) return null;

  return (
    <div ref={rootRef} className={styles.preloader} data-flow-preloader="" data-lenis-prevent="" aria-hidden="true">
      <noscript>
        <style>{"[data-flow-preloader]{display:none}"}</style>
      </noscript>
      <div ref={windowRef} className={styles.preloaderWindow}>
        <div ref={filmRef} className={styles.revealFilm}>
          <video ref={videoRef} src={FILM.mp4} poster={FILM.poster} autoPlay muted loop playsInline preload="auto" />
        </div>
        <span ref={shadeRef} className={styles.preloaderShade} />
      </div>
      <p ref={lineRef} className={styles.preloaderLine}>
        {line}
      </p>
    </div>
  );
}
