"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import styles from "./flow.module.css";

/**
 * Brings its content into focus the first time it scrolls into view: up a
 * little, out of a blur. `index` staggers siblings. Without script, or with
 * reduced motion, it is simply there.
 */
export function FlowReveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: ElementType;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className ? `${styles.reveal} ${className}` : styles.reveal}
      style={{ "--i": index } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
