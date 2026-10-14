"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import styles from "./faded-lines.module.css";

/*
 * A headline whose lines are uncovered by scrolling, after the "faded lines"
 * titles on waverunmedia.com: each line starts under a near-black gradient
 * that slides off to the right as the line rises from 90% to 50% of the
 * screen, each line a little after the one above. Under reduced motion the
 * text is simply there.
 */
export function FadedLines({
  lines,
  as: Tag = "p",
  id,
  className,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const covers = [...root.querySelectorAll<HTMLElement>(`.${styles.cover}`)];
    let raf = 0;
    const draw = () => {
      raf = 0;
      const vh = window.innerHeight;
      covers.forEach((cover, i) => {
        const top = cover.parentElement!.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (vh * (0.9 - i * 0.04) - top) / (vh * 0.4)));
        cover.style.transform = `translateX(${(p * 101).toFixed(2)}%)`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    root.dataset.faded = "";
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={cn(styles.root, className)}>
      {lines.map((line) => (
        <span key={line} className={styles.line}>
          {line}{" "}
          <span className={styles.cover} aria-hidden="true" />
        </span>
      ))}
    </Tag>
  );
}
