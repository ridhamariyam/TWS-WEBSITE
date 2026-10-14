import Link from "next/link";
import { fallbackSrc, srcSet } from "@/lib/images";
import { ROUTES, workHref } from "@/lib/site-links";
import { PROJECTS } from "@/lib/work-content";
import { FlowChapter } from "./flow-chapter";
import { FlowReveal } from "./flow-reveal";
import styles from "./flow.module.css";

/*
 * A service page's "Selected work": a chapter whose items are the projects
 * the service was used on, each as a card with its picture, what it is, where
 * it stands and a link into its own page. The line under each name is the
 * project's summary from work-content.ts, so it says only what the build
 * says. Both projects are in build, and the cards say so; there are no
 * result lines until one is true.
 */

export type WorkPick = {
  slug: string;
  /** What this project is, in this service's terms. Defaults to the project's own label. */
  label?: string;
  link: string;
  alt: string;
};

export function FlowWork({
  eyebrow = "Selected work",
  title,
  accent,
  intro,
  picks,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string[];
  picks: WorkPick[];
}) {
  const cards = picks.flatMap((pick) => {
    const project = PROJECTS.find((p) => p.slug === pick.slug);
    return project ? [{ pick, project }] : [];
  });

  return (
    <FlowChapter id="selected-work" eyebrow={eyebrow} title={title} accent={accent} intro={intro}>
      <ul className={styles.workCards} data-count={cards.length}>
        {cards.map(({ pick, project }, i) => (
          <FlowReveal key={project.slug} as="li" index={i}>
            <Link href={workHref(project.slug)} className={styles.workLink}>
              <span className={styles.workMedia}>
                <img
                  className={styles.workImage}
                  src={fallbackSrc(project.image)}
                  srcSet={srcSet(project.image)}
                  sizes={cards.length > 1 ? "(min-width: 1020px) 34vw, (min-width: 744px) 45vw, 92vw" : "(min-width: 1020px) 40vw, 92vw"}
                  alt={pick.alt}
                  loading="lazy"
                />
              </span>
              <span className={styles.workBody}>
                <span className={styles.workTags}>
                  <span>{pick.label ?? project.label}</span>
                  <span className={styles.workStatus}>{project.status}</span>
                </span>
                <h3 className={styles.workName}>{project.name}</h3>
                <span className={styles.workSummary}>{project.summary}</span>
                <span className={styles.workMore}>
                  {pick.link} <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          </FlowReveal>
        ))}
      </ul>
      <FlowReveal as="p" className={styles.chapterNote}>
        <Link href={ROUTES.work}>See all our work</Link>
      </FlowReveal>
    </FlowChapter>
  );
}
