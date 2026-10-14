"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SectionHeader } from "@/components/sections/section-header";
import { Film } from "@/components/ui/film";
import { fallbackSrc, srcSet } from "@/lib/images";
import { ROUTES, workHref } from "@/lib/site-links";
import sectionStyles from "./studio-sections.module.css";
import styles from "./projects-strip-section.module.css";

/*
 * The homepage's projects, after the projects strip on steviaplease.me
 * (docs/research/steviaplease.me): an endless row of large rounded cards that
 * drifts slowly left and is pushed along by the wheel and by a drag — every
 * rate taken from the source's own engine (below). The source's arrow button
 * is left out. The source bends its cards in WebGL while they move; here
 * the bend is CSS — a perspective tilt and fluted-glass bands that come in
 * with speed — which costs nothing with films playing in the cards.
 *
 * Differences from the source, on purpose: the page around it scrolls, so the
 * wheel scrolls the page and pushes the strip at the same time (the source's
 * page does not scroll, so its wheel only moves the strip); and reduced
 * motion gets no drift, no intro sweep and no bend. Every card is a real
 * link, and a drag never counts as a click.
 */

type Item = {
  key: string;
  shape: "square" | "rectangle";
  title: string;
  desc: string;
  href: string;
  film?: { src: string; poster: string; w: number; h: number };
  image?: string;
};

/* The studio's builds, then the open slots — the same four as on /work. */
const ITEMS: Item[] = [
  {
    key: "zeen",
    shape: "square",
    title: "ZEEN",
    desc: "Commerce platform",
    href: workHref("zeen"),
    film: { src: "/videos/zeen-store.mp4", poster: "/videos/zeen-store-poster.webp", w: 1440, h: 662 },
  },
  {
    key: "pen-foundation",
    shape: "rectangle",
    title: "PEN Foundation",
    desc: "Product site",
    href: workHref("pen-foundation"),
    film: { src: "/videos/pen-desktop.mp4", poster: "/videos/pen-desktop-poster.webp", w: 1440, h: 716 },
  },
  { key: "next-store", shape: "square", title: "Your online store", desc: "Coming soon", href: ROUTES.startProject, image: "ecommerce" },
  {
    key: "next-web-application",
    shape: "rectangle",
    title: "Your web application",
    desc: "Coming soon",
    href: ROUTES.startProject,
    image: "web-applications",
  },
];

/*
 * Constants from the source's scroll engine (docs/research/steviaplease.me),
 * with `e` the frame time in ms as there:
 *   drift          x += 0.014·e
 *   wheel          target += Δ·1.1 · 1.22·0.07·e
 *   drag           target += −pointerΔx · 2·k · 0.08·e   (k: 1 desktop, 1.3 phone)
 *   ease           x += (target − x)·lerp                (lerp .12, or .07 above 65fps; 1 on phones)
 *   velocity       v = target − x (+ the intro's bonus·1.7); lerped += (v − lerped)·0.2
 *   card x         wrap(left − x + 0.3·total, total) − 0.3·total
 *   intro          x starts 4 screen widths back and eases in over 4s (expo out)
 */
const DRIFT = 0.014;
const GAP = 20;

/** Maps v from [a,b] to [c,d], clamped — the source's map(). */
const map = (v: number, a: number, b: number, c: number, d: number) =>
  c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Deterministic "random" timing per letter, as the source draws per hover. */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function ProjectsStripSection() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLAnchorElement | null>>([]);
  const texts = useRef<Array<HTMLSpanElement | null>>([]);
  const engine = useRef<{ velocity: () => number } | null>(null);
  const moved = useRef(false);

  useEffect(() => {
    const root = section.current;
    const box = track.current;
    if (!root || !box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(hover: none)").matches;

    let lefts: number[] = [];
    let total = 1;
    const layout = () => {
      lefts = [];
      let x = 0;
      for (const card of cards.current) {
        lefts.push(x);
        x += (card?.offsetWidth ?? 0) + GAP;
      }
      total = Math.max(1, x);
    };
    layout();

    let x = 0;
    let target = 0;
    let lerped = 0;
    let wheel = 0;
    let dragDelta = 0;
    let down: { x: number; start: number } | null = null;
    let intro = { from: 0, start: -1 };
    let bonus = 0;
    let fps = 60;
    let last = performance.now();
    let raf = 0;
    let visible = false;

    const draw = (s: number) => {
      const fade = phone ? map(Math.abs(lerped), 20, 700, 1, 0) : map(Math.abs(lerped), 20, 200, 1, 0);
      const bend = reduce ? 0 : map(Math.abs(lerped), 0, 200, 0, 1) * Math.sign(lerped);
      cards.current.forEach((card, i) => {
        if (!card) return;
        const tx = ((((lefts[i] - s + total * 0.3) % total) + total) % total) - total * 0.3;
        card.style.transform = `translate3d(${tx.toFixed(2)}px,0,0) rotateY(${(bend * 10).toFixed(2)}deg)`;
        card.style.setProperty("--flute", Math.abs(bend).toFixed(3));
        const text = texts.current[i];
        if (text) text.style.opacity = (fade < 0.03 ? 0 : fade).toFixed(3);
      });
    };

    const tick = (now: number) => {
      raf = 0;
      const e = Math.min(100, now - last);
      last = now;
      fps = fps * 0.9 + (1000 / Math.max(1, e)) * 0.1;
      const lerp = phone ? 1 : fps <= 65 ? 0.12 : 0.07;

      if (!reduce) {
        x += DRIFT * e;
        target += DRIFT * e;
      }
      target += wheel * 1.22 * e * 0.07;
      wheel = 0;
      target += -dragDelta * 2 * (phone ? 1.3 : 1) * e * 0.08;
      dragDelta = 0;
      x += (target - x) * lerp;

      // The intro sweep, and the speed it lends the bend while it runs.
      let back = 0;
      if (intro.start >= 0) {
        const t = (now - intro.start) / 4000;
        const prev = intro.from * (1 - expoOut(Math.max(0, t - e / 4000)));
        back = intro.from * (1 - expoOut(t));
        bonus = (prev - back) * 5;
        if (t >= 1) {
          intro.start = -1;
          bonus = 0;
        }
      }
      const v = target - x + bonus * 1.7;
      lerped += (v - lerped) * 0.2;
      draw(x - back + total * 200);
      if (visible) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    engine.current = { velocity: () => lerped };

    // The source listens to the whole window; here the page still scrolls,
    // and the same wheel also drives the strip while it is on screen.
    const onWheel = (ev: WheelEvent) => {
      if (!visible) return;
      let d = ev.deltaY * 1.1;
      if (ev.deltaX && Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
        d = ev.deltaX * 1.1;
        if (box.contains(ev.target as Node)) ev.preventDefault();
      }
      if (ev.deltaMode === 1) d *= 30;
      wheel = d;
    };
    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      down = { x: ev.clientX, start: ev.clientX };
      moved.current = false;
      // No pointer capture: it would retarget the click to the strip, and a
      // clean click has to reach the card's link. Moves are read on window.
      root.dataset.dragging = "";
    };
    const onMove = (ev: PointerEvent) => {
      if (!down) return;
      dragDelta += ev.clientX - down.x;
      down.x = ev.clientX;
      if (Math.abs(ev.clientX - down.start) > 4) moved.current = true;
    };
    const onUp = () => {
      down = null;
      delete root.dataset.dragging;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && intro.start < 0 && !root.dataset.played && !reduce) {
        root.dataset.played = "";
        intro = { from: window.innerWidth * 4, start: performance.now() };
      }
      if (visible) start();
    });
    observer.observe(root);
    const onResize = () => layout();

    window.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    draw(total * 200);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="selected-work" aria-labelledby="works-title">
      {/* The same header as Industries and the rest: label, display title, rule. */}
      <div className={`${sectionStyles.section} ${styles.head}`}>
        <div className={sectionStyles.inner}>
          <SectionHeader
            id="works-title"
            badge="Works"
            title="The work speaks louder"
            subtitle="Explore our projects and work in progress."
          />
        </div>
      </div>

      <div ref={section} className={styles.section}>
      <p className={styles.label}>Works</p>
      <div ref={track} className={styles.track}>
        {ITEMS.map((item, i) => (
          <Link
            key={item.key}
            ref={(el) => {
              cards.current[i] = el;
            }}
            href={item.href}
            draggable={false}
            className={`${styles.card} ${item.shape === "square" ? styles.square : styles.rectangle}`}
            onClick={(e) => {
              if (moved.current) e.preventDefault();
            }}
            onPointerEnter={(e) => {
              // The source shows a title only on a mouse hover, and not while
              // the strip is moving fast.
              if (e.pointerType !== "mouse") return;
              if (Math.abs(engine.current?.velocity() ?? 0) > 30) return;
              e.currentTarget.dataset.hover = "";
            }}
            onPointerLeave={(e) => {
              delete e.currentTarget.dataset.hover;
            }}
          >
            {item.film ? (
              <Film
                src={item.film.src}
                poster={item.film.poster}
                width={item.film.w}
                height={item.film.h}
                className={styles.media}
              />
            ) : item.image ? (
              <img
                className={styles.media}
                src={fallbackSrc(item.image)}
                srcSet={srcSet(item.image)}
                sizes="(min-width: 768px) 57vw, 116vw"
                alt=""
                loading="lazy"
                draggable={false}
              />
            ) : null}
            <span className={styles.flutes} aria-hidden="true" />
            <span
              ref={(el) => {
                texts.current[i] = el;
              }}
              className={styles.text}
            >
              <span className={styles.title} aria-label={item.title}>
                {[...item.title].map((ch, n) => (
                  <span key={n} className={styles.clip} aria-hidden="true">
                    <span
                      className={styles.char}
                      style={
                        {
                          "--d": `${(0.2 + jitter(n, i) * 0.15).toFixed(3)}s`,
                          "--delay": `${(jitter(n, i + 7) * 0.17).toFixed(3)}s`,
                        } as React.CSSProperties
                      }
                    >
                      {ch === " " ? "\u00a0" : ch}
                    </span>
                  </span>
                ))}
              </span>
              <span className={styles.desc} aria-label={item.desc}>
                {[...item.desc].map((ch, n) => (
                  <span
                    key={n}
                    className={styles.descChar}
                    aria-hidden="true"
                    style={
                      {
                        "--d": `${(0.2 + jitter(n, i + 3) * 0.15).toFixed(3)}s`,
                        "--delay": `${(jitter(n, i + 11) * 0.2).toFixed(3)}s`,
                      } as React.CSSProperties
                    }
                  >
                    {ch === " " ? "\u00a0" : ch}
                  </span>
                ))}
              </span>
            </span>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
