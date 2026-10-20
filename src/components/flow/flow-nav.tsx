"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TwsLogo } from "@/components/ui/tws-logo";
import { ROUTES } from "@/lib/site-links";
import styles from "./flow.module.css";

/*
 * The bar across the top of every flow page: the mark, the main pages in
 * large light type and the one call to action. Clear over the top of the
 * homepage's film, frosted everywhere else (the other pages open on a panel
 * inset from a white edge). Below 900px the pages fold into a
 * full-screen menu behind a button.
 */

const LINKS = [
  { label: "services", href: ROUTES.services },
  { label: "work", href: ROUTES.work },
  { label: "about", href: ROUTES.about },
  { label: "contact", href: ROUTES.contact },
];

export function FlowNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header id="site-header" className={styles.nav} data-frosted={scrolled || pathname !== ROUTES.home || undefined} data-open={open || undefined}>
      <div className={styles.navBar}>
        <Link href={ROUTES.home} aria-label="TWS — The Web Studio, home" className={styles.navMark}>
          <TwsLogo height={26} />
        </Link>

        <nav aria-label="Main" className={styles.navLinks}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              aria-current={isCurrent(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href={ROUTES.startProject} className={styles.navCta}>
          start a project
        </Link>

        <button
          type="button"
          className={styles.navToggle}
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="nav-menu" className={styles.navMenu} hidden={!open}>
        <nav aria-label="Main" className={styles.navMenuLinks}>
          <Link href={ROUTES.home} className={styles.navMenuLink} onClick={close}>
            home
          </Link>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navMenuLink}
              onClick={close}
              aria-current={isCurrent(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href={ROUTES.startProject}
          className={`${styles.navMenuLink} ${styles.navMenuCta}`}
          onClick={close}
        >
          start a project
        </Link>
      </div>
    </header>
  );
}
