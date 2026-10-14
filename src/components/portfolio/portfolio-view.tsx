"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./portfolio-view.module.css";

/*
 * The portfolio: one project at a time, full screen, stepped through by the
 * page's own scroll.
 *
 * The section is one screen tall per project with the stage pinned inside
 * it, so scrolling stays native — nothing is hijacked, and the footer follows
 * as usual. As the reader moves on, the next picture wipes up over the last,
 * and the counter, title and role roll to their next line. The overlay type
 * is plain white over a dark wash at the top and bottom of every picture.
 *
 * A toggle swaps the stage for an index: every project, as a grid. The clock
 * in the corner is the studio's, in Calicut.
 */

export type PortfolioItem = {
  key: string;
  title: string;
  role: string;
  href?: string;
  /** `srcSet` and `src` for the picture; `alt` describes it. */
  src: string;
  srcSet?: string;
  alt: string;
  /** A dev-only layout placeholder, badged as one on the page. */
  placeholder?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function PortfolioView({ items }: { items: PortfolioItem[] }) {
  const [view, setView] = useState<"stage" | "index">("stage");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Which project the scroll has reached. */
  useEffect(() => {
    if (view !== "stage") return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const box = track.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -box.top / Math.max(1, travel)));
      setActive(Math.min(items.length - 1, Math.round(p * (items.length - 1))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [view, items.length]);

  /* Jump the page to a given project's stretch of the scroll. */
  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const travel = track.offsetHeight - window.innerHeight;
    const top = track.offsetTop + (travel * i) / Math.max(1, items.length - 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  const toggle = () => {
    setView((v) => (v === "stage" ? "index" : "stage"));
    window.scrollTo({ top: trackRef.current?.offsetTop ?? 0 });
  };

  return (
    <section
      className={styles.section}
      aria-label="Portfolio"
      data-view={view}
      style={{ "--count": items.length } as React.CSSProperties}
    >
      <div ref={trackRef} className={styles.track}>
        <div className={styles.stage}>
          {view === "stage" ? (
            <>
              <div className={styles.pictures}>
                {items.map((item, i) => (
                  <figure
                    key={item.key}
                    className={styles.picture}
                    data-state={i < active ? "past" : i === active ? "current" : "next"}
                    aria-hidden={i !== active}
                  >
                    <img
                      src={item.src}
                      srcSet={item.srcSet}
                      sizes="100vw"
                      alt={item.alt}
                      loading={i < 2 ? "eager" : "lazy"}
                      draggable={false}
                    />
                    {item.placeholder ? (
                      <span className={styles.badge}></span>
                    ) : null}
                  </figure>
                ))}
              </div>

              <div className={styles.overlay}>
                {/* The counter: the current number rolls, the total stays. */}
                <p className={styles.counter} aria-live="polite">
                  <span className={styles.roll}>
                    <span
                      className={styles.rollList}
                      style={{ "--at": active } as React.CSSProperties}
                    >
                      {items.map((item, i) => (
                        <span key={item.key}>{pad(i + 1)}</span>
                      ))}
                    </span>
                  </span>
                  <span className={styles.dim}>/ {pad(items.length)}</span>
                  <span className="sr-only">
                    {`${items[active].title}, ${active + 1} of ${items.length}`}
                  </span>
                </p>

                <div className={styles.details}>
                  <RollColumn label="Title" values={items.map((i) => i.title)} at={active} />
                  <RollColumn
                    label="Role"
                    values={items.map((i) => i.role)}
                    at={active}
                    dim
                  />
                </div>

                {items[active].href ? (
                  <Link className={styles.open} href={items[active].href}>
                    View project
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}

                <ol className={styles.dots} aria-label="Projects">
                  {items.map((item, i) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        aria-label={`Go to ${item.title}`}
                        aria-current={i === active || undefined}
                        onClick={() => goTo(i)}
                      />
                    </li>
                  ))}
                </ol>

                <StudioClock />
              </div>
            </>
          ) : (
            <ul className={styles.index}>
              {items.map((item, i) => {
                const card = (
                  <>
                    <span className={styles.indexMedia}>
                      <img
                        src={item.src}
                        srcSet={item.srcSet}
                        sizes="(min-width: 1020px) 32vw, (min-width: 600px) 48vw, 92vw"
                        alt={item.alt}
                        loading="lazy"
                      />
                      {item.placeholder ? (
                        <span className={styles.badge}>Placeholder · dev only</span>
                      ) : null}
                    </span>
                    <span className={styles.indexMeta}>
                      <span className={styles.dim}>{pad(i + 1)}</span>
                      <span>{item.title}</span>
                      <span className={styles.dim}>{item.role}</span>
                    </span>
                  </>
                );
                return (
                  <li key={item.key}>
                    {item.href ? (
                      <Link href={item.href} className={styles.indexCard}>
                        {card}
                      </Link>
                    ) : (
                      <div className={styles.indexCard}>{card}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-pressed={view === "index"}
          >
            <span className={styles.toggleIcon} data-view={view} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {view === "stage" ? "Index" : "Stage"}
          </button>
        </div>
      </div>
    </section>
  );
}

/** A column whose value rolls to line `at`, under a faint label. */
function RollColumn({
  label,
  values,
  at,
  dim,
}: {
  label: string;
  values: string[];
  at: number;
  dim?: boolean;
}) {
  return (
    <div className={styles.column}>
      <span className={styles.label}>{label}</span>
      <span className={styles.roll} aria-hidden="true">
        <span className={styles.rollList} style={{ "--at": at } as React.CSSProperties}>
          {values.map((value, i) => (
            <span key={i} className={dim ? styles.dim : undefined}>
              {value}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

/*
 * The studio's local time, and whether now is a good time to write. Rendered
 * after mount only: the server's clock is not the reader's, and a mismatch
 * would be a hydration error for a decoration.
 */
function StudioClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000 * 15);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  if (!now) return <p className={styles.clock} />;

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(now);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", timeZone: "Asia/Kolkata" }).format(now),
  );
  const open = hour >= 9 && hour < 19;

  return (
    <p className={styles.clock}>
      <span>{time.toUpperCase()} IST · Calicut</span>
      <span>{open ? "In the studio now" : "Studio's closed for the day"}</span>
    </p>
  );
}
