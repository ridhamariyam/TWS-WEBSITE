"use client";

import { useEffect, useRef } from "react";
import styles from "./reveal-footer.module.css";

/*
 * The page and its footer, revealed the way noahlesage.com does it: the
 * footer is fixed under the page, the page carries room for it at the end,
 * and as the page's bottom edge rises past the screen's the footer shows
 * beneath it while the page's corners round — in the source's proportion,
 * radius = revealed height × 52 / footer height.
 *
 * Tabbing into the footer scrolls it into view, so a focused link is never
 * hidden under the page.
 */
const MAX_RADIUS = 52;

export function RevealFooter({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const card = useRef<HTMLElement>(null);
  const foot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = card.current;
    const base = foot.current;
    if (!main || !base) return;

    let height = base.offsetHeight;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const shown = Math.min(height, Math.max(0, window.innerHeight - main.getBoundingClientRect().bottom));
      main.style.setProperty("--reveal-r", `${height ? (shown / height) * MAX_RADIUS : 0}px`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const size = () => {
      height = base.offsetHeight;
      main.style.marginBottom = `${height}px`;
      schedule();
    };
    const observer = new ResizeObserver(size);
    observer.observe(base);
    size();

    const onFocus = () => window.scrollTo({ top: document.documentElement.scrollHeight });
    base.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      base.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <main ref={card} id="content" className={styles.card}>
        {children}
      </main>
      <div ref={foot} className={styles.footer}>
        {footer}
      </div>
    </>
  );
}
