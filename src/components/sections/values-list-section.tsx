"use client";

import { useState } from "react";
import { fallbackSrc, srcSet } from "@/lib/images";
import { STUDIO_VALUES as VALUES } from "@/lib/studio-content";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./values-list-section.module.css";

/*
 * What the studio stands for, after the interactive list on
 * waverunmedia.com/about: a large picture and a list of values in grey.
 * Pointing at a value (or focusing or tapping it) lights it white, opens its
 * line, and cross-fades the picture to its own; leaving the list returns to
 * the studio picture.
 */
const DEFAULT_IMAGE = "studio-footer";

export function ValuesListSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className={cn(wave.section, wave.narrow)} aria-labelledby="values-title">
      <div className={styles.container}>
        <h2 id="values-title" className={cn(wave.label, styles.heading)}>
          What we stand for
        </h2>
        <div className={styles.images} aria-hidden="true">
          {[DEFAULT_IMAGE, ...VALUES.map((value) => value.image)].map((name, i) => (
            <img
              key={name}
              src={fallbackSrc(name)}
              srcSet={srcSet(name)}
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className={styles.image}
              data-active={(i === 0 ? active === null : active === i - 1) || undefined}
            />
          ))}
        </div>
        <ul className={styles.items} onMouseLeave={() => setActive(null)}>
          {VALUES.map((value, i) => (
            <li key={value.title}>
              <button
                type="button"
                className={styles.item}
                aria-expanded={active === i}
                data-active={active === i || undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className={cn(wave.title46, styles.title)}>{value.title}</span>
                <span className={styles.content}>
                  <span className={styles.text}>{value.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
