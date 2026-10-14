"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/sections/section-header";
import { INDUSTRIES } from "@/lib/services-content";
import { industryHref } from "@/lib/site-links";
import { fallbackSrc, srcSet } from "@/lib/images";
import sectionStyles from "./studio-sections.module.css";
import styles from "./industries-method-section.module.css";

/*
 * The industries, as a row of cards that the page's scroll works
 * through. From 1020px the row pins for a stretch of scroll; the card in play
 * opens out to show what the studio does for that sector, the rest close to a
 * slim spine with the sector's name running up it, and a lime glow sits
 * behind the open card. Below 1020px, and under reduced motion, every card is
 * open, in a grid.
 *
 * Each card is the sector's own artwork under a dark wash, so light copy
 * holds over it on the black page.
 */


export function IndustriesMethodSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const box = track.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(1, Math.max(0, -box.top / travel));
      setActive(Math.min(INDUSTRIES.length - 1, Math.floor(p * INDUSTRIES.length)));
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
  }, []);

  return (
    <section
      id="industries"
      className={`${sectionStyles.section} ${sectionStyles.light}`}
      aria-labelledby="industries-title"
    >
      <div className={sectionStyles.inner}>
        <SectionHeader
          id="industries-title"
          badge="Industries"
          title="Built for your sector"
          subtitle="Every sector meets its customers differently. These are the ones we design and build for, and what we focus on in each."
        />
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        style={{ "--count": INDUSTRIES.length } as React.CSSProperties}
      >
        <div className={styles.sticky}>
          <ol className={styles.row}>
            {INDUSTRIES.map((industry, i) => (
              <li
                key={industry.id}
                className={styles.card}
                data-active={i === active || undefined}
              >
                <img
                  className={styles.art}
                  src={fallbackSrc(industry.id)}
                  srcSet={srcSet(industry.id)}
                  sizes="(min-width: 1020px) 40vw, (min-width: 744px) 48vw, 92vw"
                  alt=""
                  loading="lazy"
                />
                <span className={styles.glow} aria-hidden="true" />

                <h3 className={styles.title}>
                  <span className={styles.titleFull}>
                    {industry.name}
                  </span>
                  <span className={styles.spine} aria-hidden="true">
                    {industry.name}
                  </span>
                </h3>

                <div className={styles.details}>
                  <p className={styles.blurb}>{industry.blurb}</p>
                  {/* The link wraps with the tags, so it ends their last row. */}
                  <div className={styles.foot}>
                    <ul className={styles.focus} aria-label={`What we build for ${industry.name}`}>
                      {industry.focus.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link href={industryHref()} className={styles.link}>
                      Explore <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
