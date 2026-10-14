"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Cta } from "@/components/ui/cta";
import { ROUTES, workHref } from "@/lib/site-links";
import { fallbackSrc, srcSet } from "@/lib/images";
import styles from "./work-rail-section.module.css";

/*
 * "The work speaks louder" — the work as a rail of square cards that the page
 * scroll carries sideways.
 *
 * The section pins for one screen per card. Across that scroll the rail moves
 * from the opening pair to each card centred in turn, eased towards its target
 * each frame so the wheel's steps smooth out. On hover a white panel rises
 * out of the card with the name and its tags, its top edge swelling under the
 * pointer, while the picture pushes in.
 *
 * Under reduced motion there is no pin: the rail is a plain horizontal
 * scroller. Below 782px a card shows its panel under the picture at all times,
 * since there is no hover to reveal it.
 */

type Card = {
  key: string;
  title: string;
  tags: string[];
  href: string;
  image?: { id: string; alt: string };
  /** A layout placeholder, served by the dev-only /dev-placeholders route. */
  placeholder?: string;
  film?: { mp4: string; poster: string };
};

/*
 * The studio's own builds, each as a film of the real site in use — screen
 * recordings from the projects, cut by scripts/generate-studio-films.sh. A
 * project goes in as `{ key, title, tags, href, film }` or with an `image`
 * id from the image manifest.
 */
const CARDS: Card[] = [
  {
    key: "pen-foundation",
    title: "PEN Foundation",
    tags: ["Product site", "In build"],
    href: workHref("pen-foundation"),
    film: { mp4: "/videos/pen-desktop.mp4", poster: "/videos/pen-desktop-poster.webp" },
  },
  {
    key: "zeen",
    title: "ZEEN",
    tags: ["Commerce platform", "In build"],
    href: workHref("zeen"),
    film: { mp4: "/videos/zeen-store.mp4", poster: "/videos/zeen-store-poster.webp" },
  },
];

const PHONE = "(width < 782px)";
/** Scroll per card, in viewport heights. */
const STEP = { desktop: 1, phone: 0.55 };
/** How far the rail closes on its target each frame. */
const EASE = 0.16;

export function WorkRailSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!section || !track || !viewport || !rail) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let stops: number[] = [];
    let current = 0;
    let raf = 0;

    /*
     * Card size: two across on a desktop, one on a phone, held between a
     * floor and 720px and never taller than half the screen. The rail's
     * inset centres the opening pair (or the single card).
     */
    const layout = () => {
      const phone = window.matchMedia(PHONE).matches;
      const perView = phone ? 1 : 2;
      const width = viewport.clientWidth;
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 24;
      const edge = phone ? Math.max(12, width * 0.03) : 0;
      const peek = phone ? width * 0.06 : 0;
      const fit = (Math.max(0, width - edge * 2 - peek) - gap * (perView - 1)) / perView;
      const floor = phone ? 220 : 280;
      const cap = Math.min(720, Math.max(floor, window.innerHeight * (phone ? 0.58 : 0.5)));
      const size = Math.max(floor, Math.min(fit, cap));
      const inset = Math.max(edge, (width - (size * perView + gap * (perView - 1)) - peek) / 2);

      section.style.setProperty("--card", `${size}px`);
      section.style.setProperty("--inset", `${inset}px`);
      section.style.setProperty(
        "--travel",
        `${CARDS.length * (phone ? STEP.phone : STEP.desktop) * 100}svh`,
      );

      /* Where the rail sits to centre each card; the first is the pair. */
      stops = [...rail.children].map((child) => {
        const card = child as HTMLElement;
        return Math.max(0, card.offsetLeft - (width - card.offsetWidth) / 2);
      });
    };

    const target = () => {
      if (!motion.matches || stops.length < 2) return 0;
      const box = track.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -box.top / Math.max(1, travel)));
      const at = p * (stops.length - 1);
      const i = Math.floor(at);
      const j = Math.min(stops.length - 1, i + 1);
      return stops[i] + (stops[j] - stops[i]) * (at - i);
    };

    const tick = () => {
      raf = 0;
      const goal = target();
      current += (goal - current) * EASE;
      if (Math.abs(goal - current) < 0.5) current = goal;
      rail.style.transform = motion.matches ? `translate3d(${-current}px, 0, 0)` : "";
      if (current !== goal) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const refresh = () => {
      layout();
      current = target();
      schedule();
    };

    refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh, { passive: true });
    motion.addEventListener("change", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      motion.removeEventListener("change", refresh);
    };
  }, []);

  /* The film plays only while its card is a quarter on screen. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = [...section.querySelectorAll("video")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.preload = "auto";
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="selected-work"
      className={styles.section}
      data-pinned={CARDS.length > 0 || undefined}
    >
      <div ref={trackRef} className={styles.track}>
      <div className={styles.pin}>
        <Reveal className={styles.head}>
          <h2 className={styles.heading}>The work speaks louder</h2>
          <p className={styles.lede}>
            Explore our projects and work in progress.
          </p>
        </Reveal>

        <a className={styles.skip} href="#selected-work-after">
          Skip the work
        </a>

        <div className={styles.projectsRow}>
        <div ref={viewportRef} className={styles.viewport}>
          <ul ref={railRef} className={styles.rail}>
            {CARDS.map((card) => (
              <li key={card.key} className={styles.item}>
                <WorkCard card={card} />
              </li>
            ))}
            <li className={`${styles.item} ${styles.moreItem}`}>
              <Cta href={ROUTES.work} variant="secondary" theme="dark" hasArrow className={styles.moreButton}>
                See more
              </Cta>
            </li>
          </ul>
        </div>
        </div>
      </div>
      </div>

      {/* Breathing room after the pinned rail, before the next section. */}
      <div id="selected-work-after" className={styles.tail} />
    </section>
  );
}

function WorkCard({ card }: { card: Card }) {
  const ref = useRef<HTMLAnchorElement>(null);

  /* The panel's swell follows the pointer across the card. */
  const follow = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--wx", `${((e.clientX - box.left) / box.width) * 100}%`);
  };

  return (
    <Link ref={ref} href={card.href} className={styles.card} onPointerMove={follow}>
      <span className={styles.media}>
        {card.image ? (
          <img
            className={styles.visual}
            src={fallbackSrc(card.image.id)}
            srcSet={srcSet(card.image.id)}
            sizes="(min-width: 782px) 50vw, 90vw"
            alt={card.image.alt}
            loading="lazy"
            draggable={false}
          />
        ) : null}
        {card.placeholder ? (
          <>
            <img
              className={styles.visual}
              src={card.placeholder}
              alt=""
              loading="lazy"
              draggable={false}
            />
          
          </>
        ) : null}
        {card.film ? (
          <video
            className={styles.visual}
            src={card.film.mp4}
            poster={card.film.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        ) : null}
      </span>

      <span className={styles.panel}>
        <svg
          className={styles.wave}
          viewBox="0 0 300 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 24 L0 24 L110 24 C130 24 136 0 150 0 C164 0 170 24 190 24 L300 24 L300 24 Z" />
        </svg>
        <span className={styles.info}>
          <h3 className={styles.title}>{card.title}</h3>
          <ul className={styles.tags}>
            {card.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </span>
      </span>
    </Link>
  );
}
