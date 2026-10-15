"use client";

import { useState } from "react";
import { RichParagraph } from "@/components/ui/rich-paragraph";
import type { FaqEntry } from "@/lib/faq-content";
import styles from "./studio-sections.module.css";

/*
 * The questions as hairline rows, each opening in place. Any number can
 * be open at once. On /faq each card carries its entry's id, so a link to
 * /faq#id lands on that question — and opens it.
 */
export function FaqCards({
  entries,
  anchored = false,
}: {
  entries: FaqEntry[];
  anchored?: boolean;
}) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul className={styles.faqList}>
      {entries.map((entry) => {
        const isOpen = open.has(entry.id);
        const panel = `faq-panel-${entry.id}`;
        return (
          <li
            key={entry.id}
            id={anchored ? entry.id : undefined}
            className={styles.faqItem}
            data-open={isOpen || undefined}
          >
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className={styles.faqQuestion}
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(entry.id)}
              >
                {entry.question}
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div id={panel} className={styles.faqAnswer} inert={!isOpen}>
              <div className={styles.faqAnswerInner}>
                <div className={styles.faqAnswerBody}>
                  {entry.answer.map((paragraph, i) => (
                    <RichParagraph key={i} runs={paragraph} className="m-0" />
                  ))}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
