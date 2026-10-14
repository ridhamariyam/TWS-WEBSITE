import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeader } from "@/components/sections/section-header";
import { insightSlug, readingMinutes } from "@/lib/insight-slug";
import styles from "@/components/sections/studio-sections.module.css";
import { RichParagraph } from "@/components/sections/accordion-section";
import { Reveal } from "@/components/ui/reveal";
import { INSIGHT_ENTRIES } from "@/lib/insights-content";

export const metadata: Metadata = pageMetadata({
  title: "Blogs",
  description:
    "Writing from TWS — The Web Studio on digital design, web development, e-commerce and the technology behind them.",
  path: "/blogs",
});

/*
 * The studio's writing: the one place the articles are published, and where
 * new ones go. Posts come from insights-content.ts; the homepage lists their
 * titles and links here rather than reproducing them.
 */
export default function BlogsPage() {
  return (
    <PageShell>
      <section className={styles.section} style={{ paddingTop: "calc(var(--global-nav-height) + 4rem)", paddingBottom: 0 }}>
        <div className={styles.inner}>
          <SectionHeader
            as="h1"
            badge="Blog"
            title="Things we're thinking about"
            subtitle="Practical writing on digital design, web development, e-commerce and the technology behind them — what we have learned building this work, rather than a content calendar."
          />
        </div>
      </section>

      <section className="page-gutter border-t border-black/10 py-16 bp1020:py-24">
        <ul className="flex flex-col gap-16 bp1020:gap-24">
          {INSIGHT_ENTRIES.map((entry) => (
            <li
              key={entry.title}
              id={insightSlug(entry)}
              className="scroll-mt-[calc(var(--global-nav-height)+24px)]"
            >
              <Reveal
                as="article"
                className="grid gap-4 bp1020:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] bp1020:gap-10"
              >
                <p className="type-eyebrow text-gray-500">
                  {entry.category} · {readingMinutes(entry)} min read
                </p>
                <div>
                  <h2 className="type-subtitle1 text-balance">{entry.title}</h2>
                  <div className="mt-6 flex flex-col gap-4 text-gray-200">
                    {entry.body.map((para, i) => (
                      <RichParagraph key={i} runs={para} />
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

    </PageShell>
  );
}
