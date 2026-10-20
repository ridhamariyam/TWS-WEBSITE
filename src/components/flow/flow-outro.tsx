"use client";

import { useRef } from "react";
import { ROUTES } from "@/lib/site-links";
import { DepthCards, depthTravel, placeDepthCards, type DepthItem } from "./depth-gallery";
import { FlowCta } from "./flow-cta";
import {
  clamp,
  easeOut,
  lerp,
  range,
  useScrollStage,
} from "./use-scroll-stage";
import { Swatch, toneAt } from "./swatch";
import styles from "./flow.module.css";

/*
 * The sign-off before the footer, pinned on black, then the call to action:
 *
 *   0.00–0.15  a pool of violet and blue light comes up;
 *   0.05–0.40  scattered letters fly together into "beyond ordinary" while
 *              blocks of colour drift out past them;
 *   0.80–1.00  the phrase breaks up again as the call to action (FlowCta,
 *              with the note) scrolls in over it.
 *
 * Given `cards`, the page's fly-through plays in the same stage first: the
 * camera moves through the frames (0–0.62) and the phrase gathers out of the
 * last of them (0.35–0.68), so the two read as one scene with no gap.
 *
 * The phrase is a plain lead and an italic accent: "beyond ordinary" on the
 * homepage, each page's closing line elsewhere.
 *
 * `cta={null}` leaves the call to action out, so the footer follows the phrase.
 */

/** Where letter `i` starts: deterministic, so server and client agree. */
const scatter = (i: number) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return {
    x: (a - Math.floor(a) - 0.5) * 80,
    y: (b - Math.floor(b) - 0.5) * 70,
    r: (a - Math.floor(a) - 0.5) * 90,
  };
};

/* Photographs drifting out past the phrase. */
const CHIPS = [
  { image: "healthcare", x: -34, y: -26 },
  { image: "zeen", x: 30, y: -30 },
  { image: "pen-foundation", x: -28, y: 28 },
  { image: "hospitality", x: 36, y: 22 },
];

export function FlowOutro({
  lead = "beyond",
  accent = "ordinary",
  cta = { label: "Start a project", href: ROUTES.startProject },
  note,
  cards,
  cardsTitle,
}: {
  lead?: string;
  accent?: string;
  cta?: { label: string; href: string } | null;
  /** A line of microcopy under the call to action. */
  note?: string;
  /** Frames to fly past before the phrase gathers (see DepthGallery). */
  cards?: DepthItem[];
  /** Their heading, for screen readers. */
  cardsTitle?: string;
} = {}) {
  const phrase = `${lead} ${accent}`;
  const accentFrom = lead.length + 1;
  // Words wrap as wholes; each letter keeps its index in the phrase.
  const phraseWords = phrase.split(" ").map((word, i, all) => ({
    word,
    start: all.slice(0, i).reduce((sum, w) => sum + w.length + 1, 0),
  }));
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const travel = cards ? depthTravel(cards.length) : 0;
  // With frames the phrase waits for them; without, it starts at once.
  const at = cards ? { glow: [0.3, 0.45], gather: [0.35, 0.68] } : { glow: [0, 0.15], gather: [0.05, 0.45] };

  useScrollStage(sectionRef, (p) => {
    if (cards) placeDepthCards(cardRefs.current, range(p, 0, 0.62), travel, range(p, 0, 0.03));
    if (glowRef.current)
      glowRef.current.style.opacity = range(p, at.glow[0], at.glow[1]).toFixed(3);

    const gather = easeOut(range(p, at.gather[0], at.gather[1]));
    const scatterOut = range(p, 0.8, 1);
    letterRefs.current.forEach((letter, i) => {
      if (!letter) return;
      const s = scatter(i);
      const k = 1 - gather + scatterOut * 0.6;
      letter.style.transform = `translate(${(s.x * k).toFixed(2)}vw, ${(s.y * k).toFixed(2)}svh) rotate(${(s.r * k).toFixed(1)}deg)`;
      letter.style.opacity = (clamp(gather * 3) * (1 - scatterOut)).toFixed(3);
      letter.style.filter =
        k > 0.02 ? `blur(${(k * 10).toFixed(1)}px)` : "none";
    });

    const drift = range(p, 0.05, 0.75);
    chipRefs.current.forEach((chip, i) => {
      if (!chip) return;
      const c = CHIPS[i];
      const k = lerp(0.35, 1.3, drift);
      chip.style.transform = `translate(calc(-50% + ${(c.x * k).toFixed(2)}vw), calc(-50% + ${(c.y * k).toFixed(2)}svh))`;
      chip.style.opacity = (
        range(drift, 0, 0.2) *
        (1 - range(drift, 0.7, 1))
      ).toFixed(3);
    });
  });

  return (
    <>
      <section
        ref={sectionRef}
        className={styles.outroSection}
        // The frames take about half a screen of scrolling each, then the phrase its own.
        style={cards ? { height: `${Math.round((40 + cards.length * 50) / 0.62)}svh` } : undefined}
        aria-label={phrase}
      >
        <div className={cards ? `${styles.mStage} ${styles.outroDepth}` : styles.mStage}>
          <span ref={glowRef} className={styles.outroGlow} aria-hidden="true" />

          {cards && (
            <>
              <DepthCards items={cards} cardRefs={cardRefs} />
              {cardsTitle && <h2 className="sr-only">{cardsTitle}</h2>}
            </>
          )}

          {!cards && CHIPS.map((chip, i) => (
            <div
              key={chip.image}
              ref={(node) => {
                chipRefs.current[i] = node;
              }}
              className={styles.mChip}
              aria-hidden="true"
            >
              <Swatch tone={toneAt(i)} />
            </div>
          ))}

          <h2 className="sr-only">{phrase}</h2>
          <p className={styles.mLine} aria-hidden="true">
            <span className={styles.mPhrase}>
              {phraseWords.map(({ word, start }) => (
                <span key={start} className={styles.mPhraseWord}>
                  {[...word].map((ch, j) => {
                    const i = start + j;
                    return (
                      <span
                        key={i}
                        ref={(node) => {
                          letterRefs.current[i] = node;
                        }}
                        className={i >= accentFrom ? styles.mSerif : undefined}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          </p>
        </div>
      </section>
      {cta && <FlowCta cta={cta} note={note} />}
    </>
  );
}
