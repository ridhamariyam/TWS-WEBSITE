"use client";

import Link from "next/link";
import { useRef } from "react";
import { PROJECTS } from "@/lib/work-content";
import { ROUTES, workHref } from "@/lib/site-links";
import { easeInOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import styles from "./flow.module.css";

/*
 * Selected work as a pinned horizontal rail. It follows straight on from the
 * dive's type with no heading of its own: vertical scroll slides the
 * screen-tall project cards across to a card into the full archive, then the
 * whole rail falls back into the dark as the depth gallery comes up. Both
 * projects are in build, and the cards say so.
 */

/* Screen recordings of the projects themselves; see work-rail-section.tsx. */
const FILMS: Record<string, { mp4: string; poster: string }> = {
  "pen-foundation": { mp4: "/videos/pen-desktop.mp4", poster: "/videos/pen-desktop-poster.webp" },
  zeen: { mp4: "/videos/zeen-store.mp4", poster: "/videos/zeen-store-poster.webp" },
};

export function WorkRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useScrollStage(sectionRef, (p) => {
    const track = trackRef.current;
    if (!track) return;
    const travel = Math.max(0, track.scrollWidth - window.innerWidth);
    const slide = easeInOut(range(p, 0, 0.8));
    // The last stretch: the rail shrinks back and drifts left as it fades.
    const recede = range(p, 0.82, 1);
    const scale = lerp(1, 0.55, easeInOut(recede));
    const x = -slide * travel - recede * window.innerWidth * 0.12;
    track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) scale(${scale.toFixed(4)})`;
    track.style.transformOrigin = `${(slide * travel + window.innerWidth * 0.5).toFixed(1)}px 50%`;
    track.style.opacity = (1 - range(p, 0.88, 1)).toFixed(3);
  });

  return (
    <section ref={sectionRef} className={styles.railSection} aria-labelledby="work-title">
      <div className={styles.railStage}>
        <h2 id="work-title" className="sr-only">
          Selected work
        </h2>

        <div ref={trackRef} className={styles.railTrack}>
          {PROJECTS.map((project) => {
            const film = FILMS[project.slug];
            return (
              <Link key={project.slug} href={workHref(project.slug)} className={styles.railCard}>
                {film ? (
                  <video
                    src={film.mp4}
                    poster={film.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className={styles.railMedia}
                  />
                ) : null}
                <span className={styles.railMeta}>
                  <span>{project.label}</span>
                  <span>{project.status}</span>
                  <span>{project.category}</span>
                </span>
                <span className={styles.railFoot}>
                  <span className={styles.railName}>{project.name}</span>
                </span>
              </Link>
            );
          })}
          <Link href={ROUTES.work} className={`${styles.railCard} ${styles.railEnd}`}>
            <span className={styles.railFoot}>
              <span className={styles.railName}>All work</span>
              <span className={styles.railSummary}>Every project, and where each one stands.</span>
            </span>
            <span className={styles.railArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
