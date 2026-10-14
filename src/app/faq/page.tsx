import type { Metadata } from "next";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/layout/page-shell";
import { FaqCards } from "@/components/sections/faq-cards";
import { SectionHeader } from "@/components/sections/section-header";
import styles from "@/components/sections/studio-sections.module.css";
import { FAQ_ENTRIES } from "@/lib/faq-content";

export const metadata: Metadata = pageMetadata({
  title: "Questions",
  description:
    "What a project with TWS costs, how long it takes, how the studio works, who owns the code, and what happens after launch.",
  path: "/faq",
});

/*
 * The questions, answered in full.
 *
 * Every answer is in `faq-content.ts`, which the homepage's shorter block
 * reads from too. Each one is anchored by its id, so a reply to an enquiry
 * can point at the exact answer rather than at the page.
 */
export default function FaqPage() {
  return (
    <PageShell>
      {/* The same answers, for a search result that shows them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <section className={styles.section} style={{ paddingTop: "calc(var(--global-nav-height) + 4rem)" }}>
        <div className={styles.inner}>
          <SectionHeader
            as="h1"
            badge="FAQs"
            title="The questions we're asked"
            subtitle="Cost, time, how the work runs, and what you are left holding at the end of it. If yours is not here, ask it — the answer will end up on this page."
          />
          <FaqCards entries={FAQ_ENTRIES} anchored />
        </div>
      </section>

    </PageShell>
  );
}
