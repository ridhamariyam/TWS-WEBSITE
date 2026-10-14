import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { BackToTop } from "@/components/work/back-to-top";
import { ProjectCard } from "@/components/work/project-card";
import { ROUTES } from "@/lib/site-links";
import { PROJECTS, projectBySlug, type Chapter } from "@/lib/work-content";
import { pageMetadata, projectJsonLd } from "@/lib/seo";
import { fallbackSrc, srcSet } from "@/lib/images";
import styles from "../work.module.css";

/*
 * One project, as a case study: the name and what it is, its tags, the hero
 * picture, then the chapters on a twelve-column grid with the project's own
 * further screens between them, and the other projects at the foot.
 *
 * Chapters come from the data, so an outcome chapter appears here once a
 * project has one — until then there is no outcome section. Pictures come
 * from `gallery`, which holds only this project's real screens; with none,
 * the chapters simply follow one another. Only projects with a `detail` get a
 * page.
 */

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.filter((project) => project.detail).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.name,
    description: `${project.name} — ${project.summary}`,
    path: `${ROUTES.work}/${project.slug}`,
  });
}

/* The first chapter opens, the second is an aside, the rest are split. */
/*
 * Every chapter on the same line: the heading in the first columns, the copy
 * from the seventh, so the account reads down one edge rather than zig-zag.
 */
const layoutFor = () => styles.split;

/* Split into sentences, each rising on its own beat. */
const sentences = (text: string) => text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project?.detail) notFound();

  const { detail } = project;
  const gallery = project.gallery ?? [];
  const others = PROJECTS.filter((p) => p.slug !== project.slug);
  const tags = [project.label, project.category, project.status];

  return (
    <PageShell>
      {/* The project as a CreativeWork the studio made, and nothing more. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd(project.slug)),
        }}
      />

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroHead}>
            <div className={styles.heroText}>
              <h1 className={styles.title} aria-label={project.name}>
                {project.name.split(" ").map((word, i) => (
                  <span key={i} className={styles.mask} aria-hidden="true">
                    <span className={styles.word} style={{ "--i": i } as React.CSSProperties}>
                      {word}
                      {" "}
                    </span>
                  </span>
                ))}
              </h1>
              <p className={styles.body}>
                {sentences(detail.lead).map((line, i) => (
                  <span key={i} className={styles.mask}>
                    <span className={styles.line} style={{ "--i": i } as React.CSSProperties}>
                      {line}
                    </span>
                  </span>
                ))}
              </p>
            </div>

            <ul className={styles.tags} aria-label="About this project">
              {tags.map((tag, i) => (
                <li key={tag} className={styles.tag} style={{ "--i": i } as React.CSSProperties}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroImageWrap}>
            <img
              className={styles.heroImage}
              src={fallbackSrc(project.image)}
              srcSet={srcSet(project.image)}
              sizes="100vw"
              alt={`Screens from ${project.name}`}
            />
          </div>
        </section>

        <div className={styles.grid}>
          {detail.chapters.map((chapter, i) => {
            const pair = gallery.slice(i * 2, i * 2 + 2);
            return [
              <ChapterBlock key={chapter.title} chapter={chapter} className={layoutFor()} />,
              pair.length ? (
                <div key={`${chapter.title}-gallery`} className={styles.gallery}>
                  {pair.map((id) => (
                    <img
                      key={id}
                      src={fallbackSrc(id)}
                      srcSet={srcSet(id)}
                      sizes="(min-width: 1020px) 50vw, 90vw"
                      alt={`A screen from ${project.name}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : null,
            ];
          })}

          <div className={`${styles.chapter} ${styles.split}`}>
            <h2 className={styles.chapterTitle}>Built with</h2>
            <ul className={`${styles.tags} ${styles.chapterBody}`}>
              {detail.stack.map((tool) => (
                <li key={tool} className={styles.tag}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className={styles.more}>
          <p className={styles.note}>
            {project.name} is {project.status.toLowerCase()}. When it launches
            and there is a result worth reporting, it will be added here.
          </p>
          <div className={styles.moreHead}>
            <h2 className="type-subtitle1">See more projects</h2>
            <BackToTop />
          </div>
          {others.length ? (
            <ul className={styles.cards}>
              {others.map((other) => (
                <li key={other.slug}>
                  <ProjectCard project={other} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

    </PageShell>
  );
}

function ChapterBlock({ chapter, className }: { chapter: Chapter; className: string }) {
  return (
    <div className={`${styles.chapter} ${className}`}>
      <h2 className={styles.chapterTitle}>{chapter.title}</h2>
      <div className={`${styles.body} ${styles.chapterBody}`}>
        <p>{chapter.body}</p>
        {chapter.list ? (
          <ul className={styles.list}>
            {chapter.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
