import type { ReactNode } from "react";
import { FlowReveal } from "./flow-reveal";
import styles from "./flow.module.css";

/*
 * A chapter of reading on the black run: the eyebrow on the left, and on the
 * right the heading (its last words in the italic serif), the paragraphs, and
 * any items under it. Items lay out as a two-column grid, numbered steps, or
 * a list of rows. Each piece comes into focus as it scrolls into view.
 */

export type ChapterItem = { title: string; body?: string };

export function FlowChapter({
  id,
  eyebrow,
  title,
  accent,
  intro = [],
  items,
  variant = "grid",
  note,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  /** Words after the title, set in the italic serif. */
  accent?: string;
  intro?: ReactNode[];
  items?: ChapterItem[];
  variant?: "grid" | "steps" | "rows";
  /** A closing line under the items. */
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={styles.chapter} aria-labelledby={id ? `${id}-title` : undefined}>
      <FlowReveal as="p" className={styles.chapterEyebrow}>
        {eyebrow}
      </FlowReveal>
      <div className={styles.chapterMain}>
        <FlowReveal as="h2" className={styles.chapterTitle} index={1}>
          <span id={id ? `${id}-title` : undefined}>
            {title}
            {accent && <em className={styles.mSerif}> {accent}</em>}
          </span>
        </FlowReveal>
        {intro.map((paragraph, i) => (
          <FlowReveal key={i} as="p" className={styles.chapterText} index={2 + i}>
            {paragraph}
          </FlowReveal>
        ))}
        {items && (
          <ol className={`${styles.chapterItems} ${styles[`chapter_${variant}`]}`}>
            {items.map((item, i) => (
              <FlowReveal key={item.title} as="li" className={styles.chapterItem} index={i % 4}>
                {variant === "steps" && (
                  <span className={styles.chapterNumber}>{String(i + 1).padStart(2, "0")}</span>
                )}
                <h3 className={styles.chapterItemTitle}>{item.title}</h3>
                {item.body && <p className={styles.chapterItemBody}>{item.body}</p>}
              </FlowReveal>
            ))}
          </ol>
        )}
        {note && (
          <FlowReveal as="p" className={styles.chapterNote}>
            {note}
          </FlowReveal>
        )}
        {children}
      </div>
    </section>
  );
}
