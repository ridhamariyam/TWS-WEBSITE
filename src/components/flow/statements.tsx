"use client";

import { Fragment, useId, useRef } from "react";
import { easeInOut, easeOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import styles from "./flow.module.css";

/*
 * A run of short lines played by scroll on a pinned black stage, in the
 * manifesto's type: each line comes into focus word by word, holds, and blurs
 * away before the next. A line can turn the stage white (its type goes blue),
 * and a word can carry the violet-to-blue bar the manifesto sweeps in.
 *
 * Every line gets an equal share of the section's scroll.
 */

type StatementPart =
  | string
  | { text: string; serif?: boolean; blue?: boolean; dim?: boolean; mark?: boolean };

type StatementLine = { parts: StatementPart[]; white?: boolean };

type Word = { text: string; serif?: boolean; blue?: boolean; dim?: boolean; mark?: boolean };

/** A line's parts as words, each keeping its part's styling. A marked part stays whole. */
const toWords = (parts: StatementPart[]): Word[] =>
  parts.flatMap((part) => {
    const p = typeof part === "string" ? { text: part } : part;
    if (p.mark) return [p];
    return p.text.split(" ").filter(Boolean).map((text) => ({ ...p, text }));
  });

const BLUR = 16;

export function Statements({ lines, title }: { lines: StatementLine[]; /** For screen readers. */ title: string }) {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<Array<HTMLSpanElement | null>>>(lines.map(() => []));
  const words = lines.map((line) => toWords(line.parts));

  useScrollStage(sectionRef, (p) => {
    const stage = stageRef.current;
    if (!stage) return;
    const n = lines.length;
    let white = 0;

    lines.forEach((line, k) => {
      const a = k / n;
      const b = (k + 1) / n;
      const w = b - a;
      const count = words[k].length;
      const out = k === n - 1 ? range(p, b - w * 0.12, b) : range(p, b - w * 0.22, b - w * 0.04);
      if (line.white) white = Math.max(white, range(p, a, a + w * 0.12) * (1 - out));

      wordRefs.current[k].forEach((el, i) => {
        if (!el) return;
        // Words come in one after another over the first ~40% of the line's share.
        const start = a + w * 0.02 + ((w * 0.28) * i) / Math.max(1, count - 1);
        const vin = easeOut(range(p, start, start + w * 0.14));
        const vout = easeInOut(out);
        const opacity = vin * (1 - vout);
        const blur = BLUR * (1 - vin + vout);
        el.style.opacity = opacity.toFixed(3);
        el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.transform = `scale(${lerp(1, 1.12, vout).toFixed(3)})`;
        el.style.setProperty("--m-mark", easeInOut(range(p, start + w * 0.12, start + w * 0.24)).toFixed(3));
      });
    });

    stage.style.setProperty("--m-white", white.toFixed(3));
    stage.style.setProperty("--m-glow", (range(p, 0, 0.08) * (1 - white)).toFixed(3));
  });

  return (
    <section
      ref={sectionRef}
      className={styles.mSection}
      style={{ height: `${lines.length * 75 + 60}svh` }}
      aria-labelledby={titleId}
    >
      <div ref={stageRef} className={styles.mStage}>
        <span className={styles.mWhite} aria-hidden="true" />
        <span className={styles.mGlow} aria-hidden="true" />
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        {lines.map((line, k) => (
          <p key={k} className={styles.mLine}>
            {words[k].map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span
                  ref={(node) => {
                    wordRefs.current[k][i] = node;
                  }}
                  className={[
                    styles.mWord,
                    word.serif && styles.mSerif,
                    word.dim && styles.mDim,
                    (word.blue || line.white) && styles.mBlueText,
                    word.mark && styles.mMarked,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {word.mark && <span className={styles.mMark} aria-hidden="true" />}
                  {word.mark ? <span className={styles.mMarkText}>{word.text}</span> : word.text}
                </span>
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
