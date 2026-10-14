"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { ROUTES, serviceHref } from "@/lib/site-links";
import { fallbackSrc, srcSet } from "@/lib/images";
import styles from "./specialities-section.module.css";

/*
 * "Services": what the studio does, as a stack of oversized words.
 *
 * Each row slides in from one side as its artwork opens out of the opposite
 * edge, staggered down the stack; once a row has landed it answers the pointer
 * by leaning its word over and cutting its artwork to the same angle.
 *
 * The services carry their own artwork. The disciplines have none yet, so
 * they are type alone rather than borrowing a picture of something else.
 */

type Row = {
  label: string;
  href: string;
  /** An image id from image-manifest.json. */
  image?: string;
};

const ROWS: Row[] = [
  { label: "Websites", href: serviceHref("web-design"), image: "web-design" },
  { label: "Strategy", href: ROUTES.about },
  { label: "Commerce", href: serviceHref("ecommerce"), image: "ecommerce" },
  { label: "UI/UX", href: ROUTES.about },
  { label: "Web Apps", href: serviceHref("web-applications"), image: "web-applications" },
  { label: "Motion", href: ROUTES.about },
];

/** Between one row starting and the next. */
const STAGGER_MS = 100;
/** Matches the `rise` animation in the stylesheet. */
const RISE_MS = 1000;

/* The artwork alternates sides, counted over the rows that have any. */
const parities = (() => {
  let n = 0;
  return ROWS.map((row) => (row.image ? (n++ % 2 === 0 ? "even" : "odd") : null));
})();

export function SpecialitiesSection() {
  const listRef = useRef<HTMLOListElement>(null);

  /*
   * Driven on the element rather than through state, like `useReveal`: the
   * server, and a reader without JavaScript, get the rows already landed, and
   * only a list that starts below the fold is held back before paint.
   */
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Already on screen: it has painted landed, so only the hover goes on. */
    if (list.getBoundingClientRect().top < window.innerHeight * 0.85) {
      list.dataset.settled = "true";
      return;
    }

    list.dataset.revealed = "false";
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        list.dataset.revealed = "true";
        /* Hover transitions wait for the last row: switched on mid-rise they
         * would fight the animation for the same transform. */
        timer = window.setTimeout(() => {
          list.dataset.settled = "true";
        }, RISE_MS + STAGGER_MS * (ROWS.length - 1));
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section id="services" className={styles.section} aria-labelledby="services-heading">
      <h2 id="services-heading" className="sr-only">Services</h2>

      <ol
        ref={listRef}
        className={styles.list}
      >
        {ROWS.map((row, i) => (
          <li key={row.label} className={styles.item}>
            <Link
              href={row.href}
              className={styles.row}
              data-parity={parities[i] ?? undefined}
              style={{ "--delay": `${i * STAGGER_MS}ms` } as React.CSSProperties}
            >
              <span className={styles.inner}>
                <span className={styles.title}>{row.label}</span>
                {row.image ? (
                  <span className={styles.asset} aria-hidden="true">
                    <span className={styles.assetInner}>
                      <img
                        src={fallbackSrc(row.image)}
                        srcSet={srcSet(row.image)}
                        sizes="(min-width: 1280px) 16vw, (min-width: 744px) 15vw, 60px"
                        alt=""
                        loading="lazy"
                        draggable={false}
                      />
                    </span>
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
