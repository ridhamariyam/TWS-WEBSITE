"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Cta } from "@/components/ui/cta";
import { ChevronDownIcon } from "@/components/ui/icons";
import { TwsLogo } from "@/components/ui/tws-logo";
import {
  GET_STARTED_HREF,
  INDUSTRIES_MENU,
  SERVICES_MENU,
  STUDIO_MENU,
} from "@/lib/nav-content";
import { ROUTES } from "@/lib/site-links";
import styles from "./site-header.module.css";

/*
 * The site header: transparent with dark labels over the white hero, then
 * a dark glass surface with white labels once the hero has finished.
 *
 * The full nav row exists at >=1280px only; below that it is a hamburger and
 * the clip-path drawer.
 *
 * Every menu and drawer link closes what it was opened from: most destinations
 * remount the header, but the menus also point at anchors on the page you are
 * already on, where the panel would otherwise stay open over them.
 *
 * Keyboard: Enter or Space moves focus into the menu, Escape closes it and
 * returns focus to its button, tabbing out of the header closes it. The panel
 * sits after the menu buttons in the DOM so tabbing from its last link carries
 * on to Contact rather than jumping back.
 */

type MenuKey = "services" | "industries" | "studio";

/** What the drawer's focus trap considers reachable. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The drawer's element id, for the trigger's `aria-controls`. */
const DRAWER_ID = "site-nav-drawer";

/*
 * One panel for all three menus, swapping its contents. Per-menu ids existed
 * only while their own menu was open, leaving every button's `aria-controls`
 * pointing at nothing for most of the page's life.
 */
const PANEL_ID = "site-nav-panel";

const MENU_LABELS: Array<{ key: MenuKey; label: string }> = [
  { key: "industries", label: "Industries" },
  { key: "studio", label: "Studio" },
];

export function SiteHeader() {
  const pathname = usePathname();
  /** Marks the link you are already on, for anything reading the page out. */
  const current = (href: string) =>
    pathname === href ? ("page" as const) : undefined;

  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDismissing, setDrawerDismissing] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const [hasLeftHero, setHasLeftHero] = useState(false);
  const transparentHero = pathname === ROUTES.home && !hasLeftHero;
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  /** Set when a menu is opened from the keyboard, so focus follows it in. */
  const focusPanelOnOpen = useRef(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const update = () => setHasLeftHero(!hero || hero.getBoundingClientRect().bottom <= 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    const observer = hero ? new ResizeObserver(update) : null;
    if (hero) observer?.observe(hero);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [pathname]);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);

  // The drawer plays swipeOut before unmounting, so closing is two-phase.
  const closeDrawer = useCallback(() => {
    setDrawerDismissing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setDrawerOpen(false);
      setDrawerDismissing(false);
      setMobileSection(null);
    }, 600);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Release the mobile drawer's scroll lock when rotating or resizing to desktop.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const update = () => {
      if (!desktop.matches) return;
      window.clearTimeout(closeTimer.current);
      setDrawerOpen(false);
      setDrawerDismissing(false);
      setMobileSection(null);
    };
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  /*
   * While the drawer is open it is the page: the document does not scroll and
   * Tab cannot leave. The scrollbar's width is paid back as padding, or
   * locking the body shifts the layout sideways — the drawer runs to 1280px,
   * so this is mostly seen on a desktop browser.
   */
  useEffect(() => {
    if (!drawerOpen) return;
    const { body, documentElement: root } = document;
    const gap = window.innerWidth - root.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    // Focus goes to the first thing in the drawer, so the next Tab is inside.
    const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = drawerRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      // The hamburger is outside the panel, so it is the wrap-around target
      // both ways: the trigger stays reachable without Escape.
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? hamburgerRef.current : items[0])?.focus();
      } else if (document.activeElement === hamburgerRef.current && !e.shiftKey) {
        e.preventDefault();
        items[0]?.focus();
      }
    };
    document.addEventListener("keydown", onTab);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      document.removeEventListener("keydown", onTab);
    };
  }, [drawerOpen]);

  // Escape closes whichever surface is open and returns focus to its trigger.
  useEffect(() => {
    if (!openMenu && !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openMenu) {
        if (panelRef.current?.contains(document.activeElement)) {
          menuButtonRefs.current[openMenu]?.focus();
        }
        setOpenMenu(null);
      }
      if (drawerOpen) {
        closeDrawer();
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu, drawerOpen, closeDrawer]);

  // A menu opened from the keyboard takes focus to its first link.
  useEffect(() => {
    if (!openMenu || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [openMenu]);

  /** Closes both surfaces; every menu and drawer link calls it on click. */
  const closeAll = useCallback(() => {
    setOpenMenu(null);
    if (drawerOpen) closeDrawer();
  }, [drawerOpen, closeDrawer]);

  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-[900] h-(--global-nav-height)"
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(e) => {
        // Tabbing out of the header closes the mega-menu behind you.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpenMenu(null);
        }
      }}
    >
      <a
        href="#content"
        className="cta cta--primary cta--light sr-only focus:not-sr-only absolute top-2 left-4 z-10"
      >
        <span className="cta__label">Skip to Main Content</span>
      </a>

      <div
        className={cn(
          "page-gutter absolute inset-x-0 top-0 flex h-(--global-nav-height) items-center justify-between gap-3 text-primitive-white",
          transparentHero ? styles.transparentHero : styles.glass,
        )}
      >
        <div className="flex flex-1">
          <Link href="/" aria-label="TWS — The Web Studio homepage" className="block">
            <TwsLogo className="hidden bp1280:block" height={30} />
            <TwsLogo className="bp1280:hidden" height={24} />
          </Link>
        </div>

        <nav
          ref={navRef}
          aria-label="Main menu"
          className="relative hidden h-full flex-[3] items-center justify-center gap-8 bp1280:flex"
        >
          <Link
            href={ROUTES.home}
            aria-current={current(ROUTES.home)}
            onClick={closeAll}
            className="cta cta--inline cta--light flex h-full items-center justify-center"
          >
            <span className="type-eyebrow">Home</span>
          </Link>

          {MENU_LABELS.map(({ key, label }) => (
            <button
              key={key}
              ref={(el) => {
                menuButtonRefs.current[key] = el;
              }}
              type="button"
              className="cta cta--inline cta--light flex h-full items-center justify-center gap-1"
              aria-expanded={openMenu === key}
              aria-controls={PANEL_ID}
              onMouseEnter={() => setOpenMenu(key)}
              onClick={(e) => {
                // `detail` is 0 for a click synthesised from Enter or Space.
                const fromKeyboard = e.detail === 0;
                /*
                 * A pointer only ever opens. Hovering has already opened the
                 * menu by the time the click lands, so toggling here would
                 * shut it the moment someone clicks the label they are on.
                 * Leaving the header, Escape or following a link closes it.
                 */
                const next = fromKeyboard && openMenu === key ? null : key;
                focusPanelOnOpen.current = fromKeyboard && next !== null;
                setOpenMenu(next);
              }}
            >
              <span className="type-eyebrow">{label}</span>
              <ChevronDownIcon
                className={cn(
                  "transition-transform duration-300",
                  openMenu === key && "rotate-180",
                )}
                width={16}
                height={16}
              />
            </button>
          ))}
        </nav>

        {/* Desktop mega-menu. It lives here so the tab order runs
          * buttons -> menu -> Contact. */}
        <div
          ref={panelRef}
          id={PANEL_ID}
          className={cn(
            "absolute inset-x-0 top-(--global-nav-height) hidden bg-primitive-black text-primitive-white bp1280:block",
            styles.collapsible,
            openMenu && styles.collapsibleOpen,
          )}
        >
          <div>
            <div className="page-gutter mx-auto max-w-[1440px] py-10">
              {openMenu === "services" ? <ServicesMenu onNavigate={closeAll} /> : null}
              {openMenu === "industries" ? (
                <IndustriesMenu onNavigate={closeAll} />
              ) : null}
              {openMenu === "studio" ? <StudioMenu onNavigate={closeAll} /> : null}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 bp1280:gap-8">
          <Link
            href={ROUTES.contact}
            aria-current={current(ROUTES.contact)}
            className="cta cta--inline cta--light hidden bp1280:block"
          >
            <span className="type-eyebrow">Contact</span>
          </Link>
          {/* Below 1280 this lives at the end of the drawer, where there
            * is room for it to be a real button rather than a squeeze
            * between the mark and the menu. */}
          <Cta
            variant="primary-subtle"
            theme="light"
            hasArrow
            href={GET_STARTED_HREF}
            className="hidden whitespace-nowrap bp1280:inline-flex"
          >
            Start a project
          </Cta>
          <button
            ref={hamburgerRef}
            type="button"
            aria-label="Navigation menu"
            aria-expanded={drawerOpen}
            /* Only while it exists: the drawer is not rendered when closed. */
            aria-controls={drawerOpen ? DRAWER_ID : undefined}
            aria-haspopup="dialog"
            className="-mr-2 flex size-11 flex-col items-center justify-center gap-2 bp1280:hidden"
            onClick={() => (drawerOpen ? closeDrawer() : setDrawerOpen(true))}
          >
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          ref={drawerRef}
          id={DRAWER_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            "fixed inset-0 top-(--global-nav-height) z-[899] overflow-y-auto overscroll-contain bg-primitive-black text-primitive-white bp1280:hidden",
            styles.drawer,
            drawerDismissing ? styles.drawerClosing : styles.drawerOpen,
          )}
        >
          <nav aria-label="Mobile" className={`page-gutter py-6 ${styles.mobileNav}`}>
            <Link
              href={ROUTES.home}
              aria-current={current(ROUTES.home)}
              onClick={closeAll}
              className="block min-h-14 border-b border-white/10 py-5"
            >
              <span className="type-subtitle2">Home</span>
            </Link>

            {MENU_LABELS.map(({ key, label }) => (
              <div key={key} className="border-b border-white/10">
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between py-5 text-left"
                  aria-expanded={mobileSection === key}
                  aria-controls={`drawer-${key}`}
                  onClick={() =>
                    setMobileSection(mobileSection === key ? null : key)
                  }
                >
                  <span className="type-subtitle2">{label}</span>
                  <ChevronDownIcon
                    className={cn(
                      "shrink-0 transition-transform duration-300 motion-reduce:transition-none",
                      mobileSection === key && "rotate-180",
                    )}
                    width={16}
                    height={16}
                  />
                </button>
                <div
                  id={`drawer-${key}`}
                  inert={mobileSection !== key}
                  className={cn(
                    styles.collapsible,
                    mobileSection === key && styles.collapsibleOpen,
                  )}
                >
                  <div>
                    {/* One entry per destination, with what it covers
                      * underneath it — see `drawerEntries`. */}
                    <ul className="flex flex-col gap-1 pb-6">
                      {drawerEntries(key).map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={closeAll}
                            className="block rounded py-3"
                          >
                            <span className="type-body block">{item.label}</span>
                            {item.hint ? (
                              <span className="type-footnote block text-gray-500">
                                {item.hint}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <Link
              href={ROUTES.contact}
              aria-current={current(ROUTES.contact)}
              onClick={closeAll}
              className="block min-h-14 py-5"
            >
              <span className="type-subtitle2">Contact</span>
            </Link>

            {/* The one thing the menu is for, at the end of it. */}
            <Cta
              variant="primary-subtle"
              theme="light"
              hasArrow
              href={GET_STARTED_HREF}
              onClick={closeAll}
              className="mt-2 w-full justify-center"
            >
              Start a project
            </Cta>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/**
 * What one drawer section lists: one entry per real destination, and a line
 * saying what is there. Services' offerings are that line rather than twenty
 * separate links pointing at the same five anchors.
 */
function drawerEntries(
  key: MenuKey,
): Array<{ label: string; href: string; hint?: string }> {
  if (key === "services") {
    return SERVICES_MENU.map((group) => ({
      label: group.heading,
      href: group.links[0].href,
      hint: group.links.map((l) => l.label).join(" · "),
    }));
  }
  if (key === "industries") {
    return INDUSTRIES_MENU.map((group) => ({
      label: group.heading,
      href: group.href,
      hint: group.blurb,
    }));
  }
  return STUDIO_MENU.map((item) => ({
    label: item.label,
    href: item.href,
    hint: item.description,
  }));
}

function ServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-16">
      {SERVICES_MENU.map((group) => (
        <div key={group.heading}>
          <p className="type-eyebrow mb-5 text-gray-500">{group.heading}</p>
          <ul className="flex flex-col gap-3">
            {group.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="cta cta--inline cta--light"
                >
                  <span className="type-body">{link.label}</span>
                  {link.description ? (
                    <span className="type-footnote block text-gray-500">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Destinations only: the sectors, with no focus areas under them. */
function IndustriesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className="grid grid-cols-4 gap-10">
      {INDUSTRIES_MENU.map((group) => (
        <li key={group.href}>
          <Link
            href={group.href}
            onClick={onNavigate}
            className="cta cta--inline cta--light"
          >
            <span className="type-subtitle3 block">{group.heading}</span>
            <span className="type-body mt-1 block text-gray-500">
              {group.blurb}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function StudioMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className="grid grid-cols-4 gap-10">
      {STUDIO_MENU.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="cta cta--inline cta--light"
          >
            <span className="type-subtitle3 block">{item.label}</span>
            <span className="type-body mt-1 block text-gray-500">
              {item.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
