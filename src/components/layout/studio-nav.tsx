"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TwsLogo } from "@/components/ui/tws-logo";
import { SOCIAL_PROFILES } from "@/lib/social-profiles";
import { ROUTES } from "@/lib/site-links";
import styles from "./studio-nav.module.css";

/*
 * The site's navigation: a slim bar with the mark and a "Menu" button, and a
 * full-screen menu behind it. The menu carries a line about the studio
 * on the left, and the links on the
 * right — the main pages large, everything else small — each rolling up to
 * a second copy of itself on hover.
 *
 * Keeps the id `site-header` and the mark as its first image: the preloader
 * hides the header by that id and lands its flying mark on that image. The
 * logo link is `data-preloader-target`, so the mark swaps in without a fade.
 */

const PRIMARY = [
  { label: "Home", href: ROUTES.home },
  { label: "Services", href: ROUTES.services },
  { label: "About", href: ROUTES.about },
];

const SECONDARY = [
  { label: "Contact", href: ROUTES.contact },
];

type State = "closed" | "open" | "closing";
/** Matches the panel's exit animation in the stylesheet. */
const CLOSE_MS = 450;

/*
 * The bar itself stays small: three destinations in quiet type next to Menu.
 * Below 1020px only Contact stays beside Menu, and below 600px only Menu —
 * the panel carries the full list at every width.
 */
const BAR_LINKS = [
  { label: "Services", href: ROUTES.services },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

export function StudioNav() {
  const [state, setState] = useState<State>("closed");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setState((s) => (s === "open" ? "closing" : s));
  }, []);

  /* The closing animation plays, then the panel leaves the document. */
  useEffect(() => {
    if (state !== "closing") return;
    const id = window.setTimeout(() => setState("closed"), CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  /* While open: the page holds still, Escape closes, focus starts inside. */
  useEffect(() => {
    if (state !== "open") return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  /* The bar takes a backing once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isOpen = state === "open";

  return (
    <header
      id="site-header"
      className={styles.header}
      data-scrolled={scrolled || undefined}
      data-menu={state}
    >
      <div className={styles.bar}>
        <Link
          href={ROUTES.home}
          className={styles.logo}
          aria-label="TWS — The Web Studio, home"
          data-preloader-target=""
        >
          <TwsLogo height={28} />
        </Link>

        <div className={styles.actions}>
          <nav aria-label="Primary" className={styles.barNav}>
            {BAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.barLink} ${link.label === "Contact" ? "" : styles.wide}`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            ref={buttonRef}
            type="button"
            className={styles.toggle}
            aria-expanded={isOpen}
            aria-controls="site-menu"
            onClick={() => setState((s) => (s === "open" ? "closing" : "open"))}
          >
            <span className={styles.lines} aria-hidden="true">
              <i />
              <i />
            </span>
            <span>{isOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {state !== "closed" ? (
        <div
          ref={panelRef}
          id="site-menu"
          className={styles.panel}
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.panelInner}>
            <div className={styles.feature}>
              <p className={styles.featureText}>
                Strategy, design and engineering under one roof — websites,
                stores and web applications built to do a job.
              </p>
            </div>

            <nav className={styles.menu} aria-label="Primary">
              <ul className={styles.primary}>
                {PRIMARY.map((link, i) => (
                  <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                    <RollLink
                      href={link.href}
                      label={link.label}
                      current={pathname === link.href}
                      onNavigate={close}
                    />
                  </li>
                ))}
              </ul>

              <div className={styles.secondary}>
                <ul>
                  {SECONDARY.map((link, i) => (
                    <li key={link.href} style={{ "--i": i + PRIMARY.length } as React.CSSProperties}>
                      <RollLink
                        href={link.href}
                        label={link.label}
                        current={pathname === link.href}
                        onNavigate={close}
                        small
                      />
                    </li>
                  ))}
                </ul>
                <ul>
                  {SOCIAL_PROFILES.map((profile, i) => (
                    <li
                      key={profile.name}
                      style={{ "--i": i + PRIMARY.length + SECONDARY.length } as React.CSSProperties}
                    >
                      <RollLink href={profile.href} label={profile.name} external small />
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** A link whose label rolls up to a second copy of itself on hover. */
function RollLink({
  href,
  label,
  current,
  external,
  small,
  onNavigate,
}: {
  href: string;
  label: string;
  current?: boolean;
  external?: boolean;
  small?: boolean;
  onNavigate?: () => void;
}) {
  const inner = (
    <span className={styles.rollStack}>
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </span>
  );
  const className = small ? `${styles.roll} ${styles.small}` : styles.roll;
  return external ? (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link
      className={className}
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {inner}
    </Link>
  );
}
