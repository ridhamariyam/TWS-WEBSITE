import { Reveal } from "@/components/ui/reveal";
import { CONTACT_EMAIL, MESSAGE_MAILTO } from "@/lib/site-links";
import { mapPosition, STUDIO_PLACE } from "@/lib/studio-map";
import styles from "./studio-map-section.module.css";

/*
 * Where the studio is: the address and the email on one line with a hairline
 * between them, over a dark world map with a "+" on Calicut. After the
 * address row and map on artistudyo.com's contact page; the map is TWS's own,
 * drawn from public-domain Natural Earth data (scripts/generate-world-map.mjs).
 */
export function StudioMapSection() {
  const at = mapPosition(STUDIO_PLACE.lat, STUDIO_PLACE.lon);
  return (
    <section className={`page-gutter ${styles.section}`} aria-label="Where we are">
      <Reveal className={styles.row}>
        <a
          href={STUDIO_PLACE.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.address}
        >
          <svg className={styles.pin} viewBox="0 0 14 18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 0a7 7 0 0 0-7 7c0 5.25 7 11 7 11s7-5.75 7-11a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 7 4.5a2.5 2.5 0 0 1 0 5Z"
            />
          </svg>
          {STUDIO_PLACE.label}
        </a>
        <span className={styles.divider} aria-hidden="true" />
        <a href={MESSAGE_MAILTO} className={styles.address}>
          {CONTACT_EMAIL}
        </a>
      </Reveal>

      <div className={styles.map} role="img" aria-label={`World map marking the studio in ${STUDIO_PLACE.label}`}>
        <svg
          className={styles.marker}
          style={{ left: `${at.left}%`, top: `${at.top}%` }}
          viewBox="0 0 19 19"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M6 0v6H0v7h6v6h7v-6h6V6h-6V0H6Z" />
        </svg>
      </div>
    </section>
  );
}
