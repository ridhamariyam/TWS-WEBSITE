import Link from "next/link";
import { FaqCards } from "@/components/sections/faq-cards";
import { SectionHeader } from "@/components/sections/section-header";
import { HOMEPAGE_FAQ } from "@/lib/faq-content";
import { ROUTES } from "@/lib/site-links";
import styles from "./studio-sections.module.css";

/* The homepage's questions: the five most asked, with the rest on /faq. */
export function FaqSection() {
  return (
    <section id="homepage-faq" className={styles.section} aria-labelledby="homepage-faq-title">
      <div className={styles.inner}>
        <SectionHeader
          id="homepage-faq-title"
          badge="FAQs"
          title="Questions, answered"
          subtitle="What a project costs, how long it takes, how the work runs, and what you are left holding at the end of it."
        />
        <FaqCards entries={HOMEPAGE_FAQ} />
        <div className={styles.faqFoot}>
          <Link href={ROUTES.faq} className={styles.footerLink}>
            All the questions <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
