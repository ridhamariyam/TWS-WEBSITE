import Link from "next/link";
import { TwsLogo } from "@/components/ui/tws-logo";
import { CookieSettingsButton } from "@/components/layout/cookie-consent";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_TEL, ROUTES } from "@/lib/site-links";
import { STUDIO_LOCATION } from "@/lib/studio-content";
import styles from "./studio-footer.module.css";

/** The studio's compact black footer, below the closing section. */
const LINKS = [
  { label: "Services", href: ROUTES.services },
  { label: "Studio", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

export function StudioFooter() {
  return (
    <footer
      id="footer"
      className={`${styles.footer} page-gutter py-8 text-white bp744:py-10`}
    >
      <div className="flex flex-col gap-6 bp744:flex-row bp744:items-center bp744:justify-between">
        <div className="flex items-center gap-5">
          <Link href={ROUTES.home} aria-label="TWS — The Web Studio, home" className="shrink-0">
            <TwsLogo height={28} />
          </Link>
          <div className="flex flex-col gap-1 text-sm text-white/60">
            <p>{STUDIO_LOCATION}</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <a className="transition-colors hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <a className="transition-colors hover:text-white" href={CONTACT_TEL}>
                {CONTACT_PHONE}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 bp744:flex-row-reverse bp744:items-center bp744:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li><CookieSettingsButton /></li>
          </ul>
        </nav>
        <p>© 2026 TWS — The Web Studio.</p>
      </div>
    </footer>
  );
}
