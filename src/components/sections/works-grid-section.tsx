"use client";

import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { fallbackSrc, srcSet } from "@/lib/images";
import { PROJECTS } from "@/lib/work-content";
import { ROUTES, workHref } from "@/lib/site-links";
import styles from "./works-grid-section.module.css";

/*
 * "The work speaks louder" as a grid, after the "see all works" section on
 * artistudyo.com: each project a square tile with its name and what it is
 * underneath, and one pill to the full list.
 *
 * On hover or keyboard focus the still crossfades to a film of the real build
 * (the source swaps to a GIF the same way, opacity .3s linear). The film only
 * loads and plays while it is showing; on touch there is no hover, so the
 * still stays and a tap goes straight to the project.
 */

/*
 * Placeholder tiles after the real projects, so the grid has the source's
 * full rhythm — two squares, then wide tiles. Each says plainly that it is a
 * slot, not a client: the artwork is the studio's own capability art, the
 * label reads "Coming soon", and it links to starting a project. Replace one
 * with a real project in PROJECTS (src/lib/work-content.ts) and drop it here.
 */
const PLACEHOLDERS = [
  { key: "next-web-application", name: "Your web application", label: "Coming soon", image: "web-applications" },
  { key: "next-store", name: "Your online store", label: "Coming soon", image: "ecommerce" },
];

const FILMS: Record<string, { src: string; poster: string }> = {
  "pen-foundation": { src: "/videos/pen-desktop.mp4", poster: "/videos/pen-desktop-poster.webp" },
  zeen: { src: "/videos/zeen-store.mp4", poster: "/videos/zeen-store-poster.webp" },
};

/**
 * `heading` and `more` are for a page where this grid is the content itself
 * (/work): there the page has its own title, and a pill to /work would point
 * at the page you are on.
 */
export function WorksGridSection({ heading = true, more = true }: { heading?: boolean; more?: boolean }) {
  return (
    <section
      id="selected-work"
      className={`page-gutter ${styles.section}`}
      aria-labelledby={heading ? "works-grid-title" : undefined}
      aria-label={heading ? undefined : "Projects"}
    >
      {heading ? (
        <Reveal className={styles.head}>
          <p className="type-eyebrow text-gray-500">Selected work</p>
          <h2 id="works-grid-title" className="type-display mt-6">
            The work speaks louder.
          </h2>
        </Reveal>
      ) : null}

      <ul className={styles.row} role="list">
        {PROJECTS.map((project) => (
          <Tile
            key={project.slug}
            href={workHref(project.slug)}
            slug={project.slug}
            name={project.name}
            label={project.label}
            image={project.image}
          />
        ))}
        {PLACEHOLDERS.map((slot) => (
          <Tile
            key={slot.key}
            href={ROUTES.startProject}
            slug={slot.key}
            name={slot.name}
            label={slot.label}
            image={slot.image}
          />
        ))}
      </ul>

      {more ? (
        <div className={styles.bottom}>
          <Link href={ROUTES.work} className={styles.pill}>
            See all works
          </Link>
        </div>
      ) : (
        <div className={styles.bottom} />
      )}
    </section>
  );
}

function Tile({
  href,
  slug,
  name,
  label,
  image,
}: {
  href: string;
  slug: string;
  name: string;
  label: string;
  image: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const film = FILMS[slug];
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    const v = video.current;
    if (!v || reduce()) return;
    v.preload = "auto";
    void v.play().catch(() => {});
  };
  const stop = () => video.current?.pause();

  return (
    <li className={styles.cell}>
      <Link
        href={href}
        className={styles.item}
        onPointerEnter={(e) => e.pointerType === "mouse" && play()}
        onPointerLeave={stop}
        onFocus={play}
        onBlur={stop}
      >
        <span className={styles.media}>
          <img
            className={styles.primary}
            src={fallbackSrc(image)}
            srcSet={srcSet(image)}
            sizes="(min-width: 768px) 92vw, 92vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
          {film ? (
            <video
              ref={video}
              className={styles.secondary}
              src={film.src}
              poster={film.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
          ) : null}
        </span>
        <span className={styles.top}>
          <span className={styles.title}>{name}</span>
          <span className={styles.description}>{label}</span>
        </span>
      </Link>
    </li>
  );
}
