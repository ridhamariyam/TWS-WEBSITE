"use client";

import styles from "./back-to-top.module.css";

/* "Back to top": a mono label with an underline that draws away on hover. */
export function BackToTop() {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <span className={styles.label}>
        Back to top
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 10.5V1.5M2 5.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
      <span className={styles.rule} aria-hidden="true" />
    </button>
  );
}
