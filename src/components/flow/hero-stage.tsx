"use client";

import Link from "next/link";
import { useRef } from "react";
import { SERVICES, type Service } from "@/lib/services-content";
import { ROUTES, serviceHref } from "@/lib/site-links";
import { easeInOut, range, useScrollStage } from "./use-scroll-stage";
import { Swatch, toneAt } from "./swatch";
import styles from "./flow.module.css";

/*
 * The opening stage, pinned for its whole height:
 *
 *   0.00–0.22  the film the intro zooms into fills the screen as the hero;
 *              it shrinks from full bleed to the ring's card size, turning once clockwise on the way, and
 *              turns into the first service; the line of type running
 *              behind it from the start keeps going;
 *   0.22–0.27  the card hands over to the front card of a six-card ring, the
 *              three services twice over, so a neighbour shows at each side;
 *   0.27–0.80  the ring turns through the three services, settling on each;
 *   0.82–0.97  the front card darkens to black and opens out until it covers
 *              the screen, and the particle dive takes over beneath it.
 *
 * Everything is driven by CSS variables set from scroll, so nothing in React
 * re-renders while the page moves.
 */

const FILM = { mp4: "/videos/hero-film-wide.mp4", poster: "/videos/hero-film-wide-poster.webp" };

const MARQUEE = SERVICES.map((service) => service.name);

/** The ring's cards: the services twice over, so the ring is tight enough to show its neighbours. */
const RING = [...SERVICES, ...SERVICES];

/** Degrees between neighbouring cards on the ring. */
const STEP = 360 / RING.length;

/** Ring card size in px, matching the CSS --cw and --ch. */
const cardSize = (w: number, h: number) => {
  const ch = Math.max(320, h - 2 * (Math.max(28, h * 0.07) + 58));
  return { cw: Math.min(w * 0.8, ch * 0.72), ch };
};

export function HeroStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const coverRef = useRef<HTMLDivElement>(null);

  useScrollStage(sectionRef, (p) => {
    const stage = stageRef.current;
    if (!stage) return;

    const morph = easeInOut(range(p, 0.02, 0.22));
    const handover = range(p, 0.22, 0.27);
    const grow = range(p, 0.82, 0.97);
    const out = grow >= 1 ? 1 : 0;

    // Two turns for three services, each eased so the ring settles on a card.
    const turn = range(p, 0.27, 0.8) * (SERVICES.length - 1);
    const whole = Math.min(Math.floor(turn), SERVICES.length - 2);
    const ring = -(whole + easeInOut(turn - whole)) * STEP;

    const set = (name: string, value: number | string) =>
      stage.style.setProperty(name, String(value));
    set("--morph", morph.toFixed(4));
    // One full clockwise turn, ending upright to match the ring's front card.
    set("--tilt", `${(morph * 360).toFixed(2)}deg`);
    // The film hands over to the first service as the card starts to turn.
    set("--hero-face", easeInOut(range(p, 0.03, 0.12)).toFixed(3));
    set("--hero-card", (1 - handover).toFixed(3));
    set("--ring-in", handover.toFixed(3));
    set("--ring", `${ring.toFixed(2)}deg`);
    set("--marquee-x", `${(-p * 2600).toFixed(1)}px`);
    set("--cta-out", (1 - range(p, 0.8, 0.86)).toFixed(3));
    // A black panel the size of the front card fades up over it, then opens
    // out to the screen's edges, slow at first and quickening.
    const cover = coverRef.current;
    if (cover) {
      const { innerWidth: w, innerHeight: h } = window;
      const { cw, ch } = cardSize(w, h);
      const open = easeInOut(range(grow, 0.15, 1));
      const x = ((w - cw) / 2) * (1 - open);
      const y = ((h - ch) / 2) * (1 - open);
      cover.style.opacity = range(grow, 0, 0.15).toFixed(3);
      cover.style.clipPath =
        grow >= 1
          ? "none"
          : `inset(${y.toFixed(1)}px ${x.toFixed(1)}px round ${(22 * (1 - open)).toFixed(1)}px)`;
    }
    // What is hidden, and so out of the way of the pointer and the tab order.
    stage.dataset.phase =
      out >= 1 ? "out" : handover >= 1 ? "ring" : handover > 0 ? "swap" : "hero";

    // Cards turned away from the viewer fall into shadow.
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const facing = Math.cos(((i * STEP + ring) * Math.PI) / 180);
      card.style.filter = `brightness(${(0.35 + 0.65 * Math.max(0, facing)).toFixed(3)})`;
      card.tabIndex = facing > 0.9 ? 0 : -1;
    });
  });

  return (
    <section ref={sectionRef} className={styles.heroSection} aria-labelledby="hero-title">
      <div ref={stageRef} className={styles.heroStage} data-phase="hero">
        <p className={styles.marquee} aria-hidden="true">
          <span>
            {[...MARQUEE, ...MARQUEE].map((line, i) => (
              <span key={i} className={styles.marqueeItem}>
                {line}
              </span>
            ))}
          </span>
        </p>

        <div className={styles.ring}>
          <div className={styles.ringTrack}>
            {RING.map((service, i) => (
              <Link
                key={`${service.id}-${i}`}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                href={serviceHref(service.id)}
                className={styles.ringCard}
                style={{ "--i": i } as React.CSSProperties}
                aria-label={`${service.name}: ${service.title}`}
              >
                <ServiceFace service={service} index={i % SERVICES.length} />
              </Link>
            ))}
          </div>
        </div>

        <h1 id="hero-title" className="sr-only">
          Websites with a job to do
        </h1>

        {/* FlowPreloader lands its film on this card, found by data-hero-card. */}
        <div className={`${styles.heroCard} ${styles.heroCardFull}`} data-hero-card="">
          <div className={styles.heroFilm}>
            <video
              src={FILM.mp4}
              poster={FILM.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          </div>
          <div className={styles.heroServiceFace} aria-hidden="true">
            <ServiceFace service={SERVICES[0]} index={0} />
          </div>
        </div>

        <Link href={ROUTES.services} className={styles.ringCta}>
          Explore services
        </Link>

        <div ref={coverRef} className={styles.stageCover} aria-hidden="true" />
      </div>
    </section>
  );
}

function ServiceFace({ service, index }: { service: Service; index: number }) {
  const [lead, ...rest] = service.title.split(" ");
  return (
    <span className={styles.face}>
      <Swatch tone={toneAt(index)} className={styles.faceImage} />
      <span className={styles.faceTop}>
        <span>{String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}</span>
      </span>
      <span className={styles.facePill}>
        <span className={styles.facePillLabel}>{service.name}</span>
        {service.offering}
      </span>
      <span className={styles.faceTitle}>
        {lead} <strong>{rest.join(" ")}</strong>
      </span>
    </span>
  );
}
