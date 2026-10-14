import styles from "./studio-sections.module.css";

/*
 * The header the FAQ and blog sections share: a badge, a display heading
 * whose closing full stop is lit, a hairline, and a line of context set to
 * the right underneath.
 */
export function SectionHeader({
  id,
  badge,
  title,
  subtitle,
  as: Heading = "h2",
}: {
  id?: string;
  badge: string;
  /** Written without its full stop; the lit one is added. */
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div>
      <div className={styles.top}>
        <span className={styles.badge}>{badge}</span>
        <Heading id={id} className={styles.heading}>
          {title}
          <span className={styles.dot}>.</span>
        </Heading>
      </div>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}
