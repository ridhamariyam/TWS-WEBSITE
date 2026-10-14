import Link from "next/link";
import { SectionHeader } from "@/components/sections/section-header";
import { INSIGHT_ENTRIES } from "@/lib/insights-content";
import { insightSlug, readingMinutes } from "@/lib/insight-slug";
import { ROUTES } from "@/lib/site-links";
import styles from "./studio-sections.module.css";

/*
 * The homepage's writing as an index: one row per post, subject, title and
 * reading time on a hairline, linking to its place on /blogs. Type only, no
 * pictures — there is no photography for the posts yet, and a gradient
 * standing in for one read as decoration. The posts carry no dates yet, so
 * the meta is the reading time rather than an invented date.
 */

export function BlogSection() {
  const posts = INSIGHT_ENTRIES.slice(0, 3);
  return (
    <section id="homepage-insights" className={styles.section} aria-labelledby="homepage-blog-title">
      <div className={styles.inner}>
        <SectionHeader
          id="homepage-blog-title"
          badge="Blog"
          title="Things we're thinking about"
          subtitle="Practical writing on design, development and e-commerce — what we have learned building the work, rather than a content calendar."
        />
        <ul className={styles.posts}>
          {posts.map((entry) => (
            <li key={entry.title}>
              <Link href={`${ROUTES.blogs}#${insightSlug(entry)}`} className={styles.post}>
                <span className={styles.postSubject}>{entry.category}</span>
                <span className={styles.postTitle}>{entry.title}</span>
                <span className={styles.postMeta}>{readingMinutes(entry)} min read</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={ROUTES.blogs} className={styles.footerLink}>
          Read the blog <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
