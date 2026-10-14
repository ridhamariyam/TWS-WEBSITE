import Link from "next/link";
import { workHref } from "@/lib/site-links";
import { fallbackSrc, srcSet } from "@/lib/images";
import type { Project } from "@/lib/work-content";
import styles from "./project-card.module.css";

/*
 * One project as a card: the picture, then its name with its tags beside it.
 * Used by the /work list and by "See more projects" on each project page.
 * Only projects with a page of their own link anywhere.
 */
export function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <span className={styles.media}>
        <img
          className={styles.image}
          src={fallbackSrc(project.image)}
          srcSet={srcSet(project.image)}
          sizes="(min-width: 744px) 45vw, 90vw"
          alt={`Screens from the ${project.name} project`}
          loading="lazy"
        />
      </span>
      <span className={styles.meta}>
        <span className={styles.name}>{project.name}</span>
        <span className={styles.tags}>
          <span className={styles.tag}>{project.label}</span>
          <span className={styles.tag}>{project.status}</span>
        </span>
      </span>
    </>
  );

  return project.detail ? (
    <Link href={workHref(project.slug)} className={styles.card}>
      {body}
    </Link>
  ) : (
    <div className={styles.card}>{body}</div>
  );
}
