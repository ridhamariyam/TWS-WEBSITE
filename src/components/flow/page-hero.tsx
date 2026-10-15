"use client";

import { useRef } from "react";
import { HeroPanel, type HeroAction } from "./hero-panel";
import { easeInOut, range, useScrollStage } from "./use-scroll-stage";
import { Swatch } from "./swatch";
import styles from "./flow.module.css";

/*
 * The opening of every page but the homepage: the same black panel and
 * portrait card, pinned for two screens. Scrolling fades the copy and the
 * panel, and the card squares up and opens out to fill the screen, then
 * darkens into the black section below.
 *
 *   0.00–0.12  the copy fades;
 *   0.05–0.55  the card opens out to the edges of the screen;
 *   0.10–0.40  the panel falls back and fades;
 *   0.40–0.70  the card darkens to black, so its colour never holds a
 *              whole screen on its own.
 */
export function PageHero({
  eyebrow,
  title,
  muted,
  lead,
  actions,
  footRight,
  image,
}: {
  eyebrow: string;
  title: string;
  muted?: string;
  lead: string;
  actions: HeroAction[];
  footRight: string;
  /** A stable name that determines the card's brand swatch colour. */
  image: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollStage(sectionRef, (p) => {
    const stage = stageRef.current;
    if (!stage) return;
    const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(4));
    set("--hero-copy", 1 - range(p, 0, 0.12));
    set("--hero-panel", 1 - range(p, 0.1, 0.4));
    set("--morph", easeInOut(range(p, 0.05, 0.55)));
    set("--dim", range(p, 0.4, 0.7));
  });

  return (
    <section ref={sectionRef} className={styles.pageHeroSection} aria-labelledby="page-title">
      <div ref={stageRef} className={`${styles.heroStage} ${styles.pageHeroStage}`}>
        <HeroPanel
          titleId="page-title"
          eyebrow={eyebrow}
          title={title}
          muted={muted}
          lead={lead}
          actions={actions}
          footRight={footRight}
        />
        <div className={styles.heroCard} aria-hidden="true">
          <div className={styles.heroFilm}>
            <Swatch name={image} />
          </div>
          <span className={styles.pageHeroDim} />
        </div>
      </div>
    </section>
  );
}
