import Link from "next/link";
import { ROUTES } from "@/lib/site-links";
import styles from "./closing-cta-section.module.css";

/**
 * The panel immediately above the footer: a field of soft pale lime and the
 * black "thewebstudio" wordmark set full width across the
 * bottom edge, cropped by it, so the panel runs straight into the footer.
 */
export function ClosingCtaSection() {
  return (
    <section id="start-a-project" className={styles.section} aria-label="The Web Studio">
      <Link href={ROUTES.home} className={styles.brand} aria-label="TWS — The Web Studio, home">
        <span className={styles.wordmark} aria-hidden="true">thewebstudio</span>
      </Link>
    </section>
  );
}
