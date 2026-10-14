"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { INDUSTRIES } from "@/lib/services-content";
import { industryHref } from "@/lib/site-links";
import { clamp, range, useScrollStage } from "./use-scroll-stage";
import { Swatch, toneAt } from "./swatch";
import styles from "./flow.module.css";

/*
 * The fly-through: a set of frames (the industries, by default) hang at
 * different depths in a 3D space and
 * scrolling moves the camera forward through them, each one sliding past and
 * out of frame, the last just before the section lets go.
 *
 * Everything on it is hidden until the section pins and the camera moves.
 */

/** Where each frame hangs on screen, as viewport fractions from centre; repeats. */
const SPOTS = [
  { x: -0.3, y: -0.2, w: 300 },
  { x: 0.32, y: 0.18, w: 340 },
  { x: -0.26, y: 0.24, w: 280 },
  { x: 0.28, y: -0.24, w: 320 },
  { x: -0.34, y: -0.06, w: 300 },
  { x: 0.3, y: 0.06, w: 340 },
];

/** Each frame hangs this much deeper than the one before, in px. */
const SPACING = 700;
const FIRST_Z = -400;

export type DepthItem = { key: string; image: string; title: string; body: string; href?: string };

export const INDUSTRY_ITEMS: DepthItem[] = INDUSTRIES.map((industry) => ({
  key: industry.id,
  image: industry.id,
  title: industry.name,
  body: industry.blurb,
  href: industryHref(),
}));

/** How far the camera travels for `count` frames, the last passing it at about 0.92. */
export const depthTravel = (count: number) => (620 - (FIRST_Z - SPACING * (count - 1))) / 0.92;

/**
 * Moves the camera to `p` (0–1) through the frames; `enter` (0–1) fades the
 * whole set in as the stage arrives. Shared with FlowOutro, which can fly its
 * page's frames past while its phrase gathers.
 */
export function placeDepthCards(cards: Array<HTMLElement | null>, p: number, travel: number, enter = 1) {
  cards.forEach((item, i) => {
    if (!item) return;
    const z = FIRST_Z - SPACING * i + p * travel;
    // Fade in out of the distance; fade out just before passing the camera.
    const opacity = enter * clamp((z + 3600) / 900) * clamp((620 - z) / 320);
    item.style.setProperty("--z", `${z.toFixed(1)}px`);
    item.style.opacity = opacity.toFixed(3);
    item.style.visibility = opacity > 0.01 ? "visible" : "hidden";
  });
}

/** The frames themselves, hanging in a 3D space; the stage around them sets the perspective. */
export function DepthCards({
  items,
  cardRefs,
}: {
  items: DepthItem[];
  cardRefs: React.RefObject<Array<HTMLElement | null>>;
}) {
  return (
    <div className={styles.depthSpace}>
      {items.map((item, i) => {
        const spot = SPOTS[i % SPOTS.length];
        const props = {
          ref: (node: HTMLElement | null) => {
            cardRefs.current[i] = node;
          },
          className: styles.depthItem,
          style: { "--x": spot.x, "--y": spot.y, "--w": `${spot.w}px` } as React.CSSProperties,
        };
        const content = (
          <>
            <Swatch tone={toneAt(i)} />
            <span className={styles.depthCaption}>
              <strong>{item.title}</strong>
              {item.body}
            </span>
          </>
        );
        return item.href ? (
          <Link key={item.key} href={item.href} {...props}>
            {content}
          </Link>
        ) : (
          <div key={item.key} {...props}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function DepthGallery({
  items = INDUSTRY_ITEMS,
  title = "Made for businesses like yours",
  id,
}: {
  items?: DepthItem[];
  /** The section's heading, for screen readers. */
  title?: string;
  id?: string;
} = {}) {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const travel = depthTravel(items.length);

  useScrollStage(sectionRef, (p) => {
    stageRef.current?.toggleAttribute("data-entered", p > 0);
    placeDepthCards(itemRefs.current, p, travel, range(p, 0, 0.04));
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.depthSection}
      // About half a screen of scrolling per frame.
      style={{ height: `${Math.max(220, 40 + items.length * 50)}svh` }}
      aria-labelledby={titleId}
    >
      <div ref={stageRef} className={styles.depthStage}>
        <DepthCards items={items} cardRefs={itemRefs} />
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
      </div>
    </section>
  );
}
