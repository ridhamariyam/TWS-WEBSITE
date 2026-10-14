"use client";

import Link from "next/link";
import { useRef } from "react";
import { ROUTES } from "@/lib/site-links";
import { easeInOut, easeOut, range, useScrollStage } from "./use-scroll-stage";
import styles from "./flow.module.css";

/*
 * The last word before the footer, pinned over the violet and blue light
 * of "beyond ordinary" above it, kept moving:
 *
 *   0.00–0.15  a large glossy button comes into focus, rings of light
 *              pulsing out from behind it;
 *   0.35–0.75  the rings fade, the button settles smaller and lower, and the
 *              "thewebstudio." wordmark comes up out of a blur above it;
 *   0.65–0.85  the note under it, if there is one. All of it stays.
 *
 * The stage writes one number, --cta, from 0 to 1; the stylesheet does the
 * rest, so the button stays a plain link the whole way.
 */
export function FlowCta({
  cta = { label: "Start a project", href: ROUTES.startProject },
  note,
}: {
  cta?: { label: string; href: string };
  /** A line of microcopy under the button. */
  note?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollStage(sectionRef, (p) => {
    const stage = stageRef.current;
    if (!stage) return;
    const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(4));
    set("--cta-in", easeOut(range(p, 0, 0.15)));
    set("--cta", easeInOut(range(p, 0.35, 0.75)));
    set("--cta-note", easeOut(range(p, 0.65, 0.85)));
  });

  return (
    <section ref={sectionRef} className={styles.ctaSection} aria-labelledby="flow-cta-title">
      <div ref={stageRef} className={styles.ctaStage}>
        <div className={styles.ctaGlow} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h2 id="flow-cta-title" className="sr-only">
          {cta.label} with TWS
        </h2>

        <span className={styles.ctaMark} aria-hidden="true">
          thewebstudio.
        </span>

        <div className={styles.ctaButtonWrap}>
          <span className={styles.ctaRings} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <Link href={cta.href} className={styles.ctaButton}>
            {cta.label}
          </Link>
        </div>

        {note && <p className={styles.ctaNote}>{note}</p>}
      </div>
    </section>
  );
}
