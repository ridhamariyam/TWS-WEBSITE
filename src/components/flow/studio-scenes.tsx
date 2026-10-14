"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { fallbackSrc, srcSet } from "@/lib/images";
import { ROUTES } from "@/lib/site-links";
import { STUDIO_PRINCIPLES } from "@/lib/studio-content";
import { easeInOut, range, useScrollStage } from "./use-scroll-stage";
import { Swatch } from "./swatch";
import styles from "./flow.module.css";

/*
 * A pinned black stage that plays through a run of bento layouts of
 * photographs and violet cards. Scrolling carries each layout up and out
 * while the next rises in behind it, column by column, and the text on the
 * cards types itself in as its layout settles. A violet bar along the top
 * keeps count, and the bar along the bottom stays put.
 *
 * The homepage's run ("How we work") is the default; other pages pass their
 * own scenes and bar.
 */

import type { Scene, Tile } from "./scenes";

export type { Scene, Tile };

const LAYOUTS = {
  A: styles.sceneA,
  B: styles.sceneB,
  C: styles.sceneC,
  D: styles.sceneD,
  E: styles.sceneE,
  F: styles.sceneF,
};

const LOOKS = {
  violet: styles.tileViolet,
  statement: styles.tileStatement,
  stat: `${styles.tileViolet} ${styles.tileStat}`,
  plain: styles.tilePlain,
};

const HOME_SCENES: Scene[] = [
  {
    layout: "A",
    tiles: [
      { area: "a", delay: 0, media: { image: "studio-billboard" } },
      {
        area: "b",
        delay: 0.08,
        look: "violet",
        type: "We start with the business, not the brief.",
      },
      { area: "c", delay: 0.14, media: { image: "studio-innovation" } },
      { area: "d", delay: 0.22, media: { image: "studio-phone" } },
      { area: "e", delay: 0.3, media: { image: "studio-values" } },
    ],
  },
  {
    layout: "D",
    tiles: [
      {
        area: "a",
        delay: 0,
        look: "violet",
        type: STUDIO_PRINCIPLES[1].title,
      },
      { area: "b", delay: 0.1, media: { image: "studio-think-big" } },
      { area: "c", delay: 0.2, media: { image: "studio-arcs" } },
    ],
  },
  {
    layout: "E",
    tiles: [
      { area: "a", delay: 0, media: { image: "studio-beam" } },
      {
        area: "b",
        delay: 0.12,
        look: "stat",
        stat: "4",
        type: "Stages on every project: think, design, build, grow.",
      },
      { area: "c", delay: 0.24, media: { image: "studio-app-icon" } },
    ],
  },
];

export function StudioScenes({
  scenes = HOME_SCENES,
  label = "How we work",
  text = "No mystery. Just good work, in four stages.",
  button = { label: "About the studio", href: ROUTES.about },
  id,
}: {
  scenes?: Scene[];
  /** The section's heading, in the bar along the bottom. */
  label?: string;
  text?: string;
  button?: { label: string; href: string };
  id?: string;
} = {}) {
  const SCENES = scenes;
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Array<Array<HTMLElement | null>>>(SCENES.map(() => []));
  const typeRefs = useRef<Array<Array<HTMLSpanElement | null>>>(SCENES.map(() => []));

  useScrollStage(sectionRef, (p) => {
    const last = SCENES.length - 1;
    // Which layout the stage is on, as a float: 0 is the first at rest.
    const at = range(p, 0.04, 0.96) * last;
    // One layout's height plus the gap: the next layout follows directly
    // behind the one leaving, like frames on a strip of film.
    const travel = (areaRef.current?.clientHeight ?? window.innerHeight) + 12;

    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;

    SCENES.forEach((scene, k) => {
      const enter = k === 0 ? 1 : range(at, k - 0.9, k - 0.1);
      const exit = k === last ? 0 : range(at, k + 0.1, k + 0.9);
      scene.tiles.forEach((tile, i) => {
        const el = tileRefs.current[k][i];
        if (!el) return;
        const span = 1 - tile.delay;
        const tin = easeInOut(range(enter, tile.delay, tile.delay + span * 0.85));
        const tout = easeInOut(range(exit, tile.delay, tile.delay + span * 0.85));
        const y = (1 - tin) * travel - tout * travel;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        el.style.visibility = tin <= 0 || tout >= 1 ? "hidden" : "visible";
      });
      // Text types in over the last stretch of the layout coming to rest.
      const typed = k === 0 ? range(at, -0.4, 0.25) : range(at, k - 0.3, k + 0.15);
      typeRefs.current[k].forEach((el) => {
        if (!el) return;
        const text = el.dataset.text ?? "";
        const n = Math.round(text.length * typed);
        (el.firstChild as HTMLElement).textContent = text.slice(0, n);
        (el.lastChild as HTMLElement).textContent = text.slice(n);
      });
    });
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.scenesSection}
      // About 0.85 of a screen of scrolling per layout.
      style={{ height: `${SCENES.length * 85 + 10}svh` }}
      aria-labelledby={titleId}
    >
      <div className={styles.scenesStage}>
        <span className={styles.scenesProgress} aria-hidden="true">
          <span ref={barRef} />
        </span>

        <div ref={areaRef} className={styles.scenesArea}>
          {SCENES.map((scene, k) => (
            <div key={k} className={`${styles.scene} ${LAYOUTS[scene.layout]}`}>
              {scene.tiles.map((tile, i) => {
                const props = {
                  ref: (node: HTMLElement | null) => {
                    tileRefs.current[k][i] = node;
                  },
                  className: [
                    styles.tile,
                    tile.look && LOOKS[tile.look],
                    tile.media && styles.tileMedia,
                    tile.link && styles.tileLink,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  style: { gridArea: tile.area, visibility: k === 0 ? "visible" : "hidden" } as const,
                };
                const content = (
                  <>
                    {tile.media && <TileMedia media={tile.media} />}
                    {tile.stat && <strong>{tile.stat}</strong>}
                    {tile.type && (
                      <span
                        ref={(node) => {
                          typeRefs.current[k][i] = node;
                        }}
                        className={styles.tileText}
                        data-text={tile.type}
                        aria-label={tile.type}
                      >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" className={styles.tileTextRest}>
                          {tile.type}
                        </span>
                      </span>
                    )}
                    {tile.body && <span className={styles.tileBody}>{tile.body}</span>}
                    {tile.link && <span className={styles.tileMore}>{tile.link.label}</span>}
                  </>
                );
                return tile.link ? (
                  <Link key={i} href={tile.link.href} {...props}>
                    {content}
                  </Link>
                ) : (
                  <div key={i} {...props}>
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.scenesBar}>
          <h2 id={titleId} className={styles.scenesLabel}>
            {label}
          </h2>
          <p className={styles.scenesText}>{text}</p>
          <Link href={button.href} className={styles.scenesButton}>
            {button.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function TileMedia({ media }: { media: NonNullable<Tile["media"]> }) {
  if ("video" in media) {
    return (
      <video
        className={styles.tileFill}
        src={media.video}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    );
  }
  if ("photo" in media) {
    return (
      <img
        className={styles.tileFill}
        src={fallbackSrc(media.photo)}
        srcSet={srcSet(media.photo)}
        sizes="(min-width: 1020px) 40vw, 50vw"
        alt=""
        loading="lazy"
      />
    );
  }
  return (
    <Swatch name={media.image} className={styles.tileFill} />
  );
}

