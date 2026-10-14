import Link from "next/link";
import { TwsLogo } from "@/components/ui/tws-logo";
import { ROUTES } from "@/lib/site-links";
import styles from "./flow.module.css";

/*
 * The homepage's floating pill: the mark, the main pages and the one
 * call to action. Black on every section, so it reads over the light opening
 * stage and the dark run below it alike. Below 600px only Services and Contact
 * stay beside the mark.
 */

const LINKS = [
  { label: "Services", href: ROUTES.services, compact: true },
  { label: "About", href: ROUTES.about, compact: false },
  { label: "Contact", href: ROUTES.contact, compact: true },
];

export function FlowNav() {
  return (
    <header id="site-header" className={styles.nav}>
      <nav aria-label="Main" className={styles.navPill}>
        <Link href={ROUTES.home} aria-label="TWS — The Web Studio, home" className={styles.navMark}>
          <TwsLogo height={16} />
        </Link>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.compact ? styles.navLink : `${styles.navLink} ${styles.navLinkWide}`}
          >
            {link.label}
          </Link>
        ))}
        <Link href={ROUTES.startProject} className={styles.navCta}>
          Start a project
        </Link>
      </nav>
    </header>
  );
}
