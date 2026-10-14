import Link from "next/link";
import styles from "./link-rows.module.css";

export type LinkRow = {
  label: string;
  title: string;
  href: string;
  note?: string;
  /** Opens in a new tab, for links that leave the site. */
  external?: boolean;
};

/** Editorial rows of links. See link-rows.module.css. */
export function LinkRows({ rows }: { rows: LinkRow[] }) {
  return (
    <ul className={styles.rows}>
      {rows.map((row) => {
        const content = (
          <>
            <span className={styles.label}>{row.label}</span>
            <span className={styles.main}>
              <span className={styles.title}>{row.title}</span>
              {row.note ? <span className={styles.note}>{row.note}</span> : null}
            </span>
            <span className={styles.arrow} aria-hidden="true">
              {row.external ? "↗" : "→"}
            </span>
          </>
        );
        const internal = row.href.startsWith("/");
        return (
          <li key={row.href + row.title}>
            {internal ? (
              <Link href={row.href} className={styles.row}>
                {content}
              </Link>
            ) : (
              <a
                href={row.href}
                className={styles.row}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
