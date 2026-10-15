import Link from "next/link";
import { isInternalHref } from "@/lib/site-links";
import { FlowReveal } from "./flow-reveal";
import styles from "./flow.module.css";

/*
 * Ways to get in touch, as large rows on the black run: a small label, the
 * line itself in large type, and an optional note. The whole row is the link.
 */

type FlowLinkRow = { label: string; title: string; href: string; note?: string; external?: boolean };

export function FlowLinks({ eyebrow, title, rows }: { eyebrow: string; title?: string; rows: FlowLinkRow[] }) {
  return (
    <section className={styles.chapter} aria-label={title ?? eyebrow}>
      <FlowReveal as="p" className={styles.chapterEyebrow}>
        {eyebrow}
      </FlowReveal>
      <div className={styles.chapterMain}>
        {title && (
          <FlowReveal as="h2" className={styles.chapterTitle} index={1}>
            {title}
          </FlowReveal>
        )}
        <ul className={styles.linkRows}>
          {rows.map((row, i) => {
            const body = (
              <>
                <span className={styles.linkRowLabel}>{row.label}</span>
                <span className={styles.linkRowTitle}>{row.title}</span>
                {row.note && <span className={styles.linkRowNote}>{row.note}</span>}
              </>
            );
            return (
              <FlowReveal key={`${row.label}-${row.title}`} as="li" index={i}>
                {isInternalHref(row.href) ? (
                  <Link href={row.href} className={styles.linkRow}>
                    {body}
                  </Link>
                ) : (
                  <a
                    href={row.href}
                    className={styles.linkRow}
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {body}
                  </a>
                )}
              </FlowReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
