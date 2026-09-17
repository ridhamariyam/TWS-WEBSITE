"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Cta } from "@/components/ui/cta";
import {
  ChevronDownIcon,
  SquarespaceMark,
  SquarespaceWordmark,
} from "@/components/icons";
import {
  GET_STARTED_HREF,
  PRODUCTS_MENU,
  RESOURCES_MENU,
  SOLUTIONS_MENU,
} from "@/lib/nav-content";
import styles from "./site-header.module.css";

/*
 * The header is fixed and transparent over the hero, then fades to a solid black
 * bar as soon as the page scrolls — the live site toggles
 * `.global-navigation__header--has-scrolled` at scrollY > 0, giving
 * `background-color: #000` under
 * `transition: background-color .5s cubic-bezier(.165,.84,.44,1)`.
 *
 * Nav labels are white at every scroll position (`.text--light`); they read as
 * dark-on-white only because the black bar sits behind them over the light
 * sections.
 *
 * The full nav row only exists at >=1280px; below that it is the glyph mark plus
 * a hamburger that opens the clip-path drawer.
 */

type MenuKey = "products" | "solutions" | "resources";

const MENU_LABELS: Array<{ key: MenuKey; label: string }> = [
  { key: "products", label: "Products" },
  { key: "solutions", label: "Solutions" },
  { key: "resources", label: "Resources" },
];

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDismissing, setDrawerDismissing] = useState(false);
  const [activeSolution, setActiveSolution] = useState(0);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The drawer plays swipeOut before unmounting, so closing is two-phase.
  const closeDrawer = useCallback(() => {
    setDrawerDismissing(true);
    window.setTimeout(() => {
      setDrawerOpen(false);
      setDrawerDismissing(false);
      setMobileSection(null);
    }, 600);
  }, []);

  // Escape closes whichever surface is open.
  useEffect(() => {
    if (!openMenu && !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      if (drawerOpen) closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu, drawerOpen, closeDrawer]);

  return (
    <header
      id="global-navigation"
      className="fixed inset-x-0 top-0 z-[900] h-(--global-nav-height)"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <a
        href="#content"
        className="cta cta--primary cta--light sr-only focus:not-sr-only absolute top-2 left-4 z-10"
      >
        <span className="cta__label">Skip to Main Content</span>
      </a>

      <div
        className={cn(
          "absolute inset-x-0 top-0 flex h-(--global-nav-height) items-center justify-between px-4 text-primitive-white",
          "transition-[background-color] duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          (hasScrolled || openMenu) && "bg-primitive-black",
        )}
      >
        <div className="flex flex-1">
          <Link href="/" aria-label="Squarespace homepage" className="block">
            <SquarespaceWordmark
              className="hidden bp1280:block"
              width={208}
              height={30}
            />
            <SquarespaceMark className="bp1280:hidden" width={29} height={24} />
          </Link>
        </div>

        <nav
          ref={navRef}
          aria-label="Main menu"
          className="relative hidden h-full flex-[3] items-center justify-center gap-8 bp1280:flex"
        >
          {MENU_LABELS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="cta cta--inline cta--light flex h-full items-center justify-center gap-1"
              aria-expanded={openMenu === key}
              aria-controls={`nav-menu-${key}`}
              onMouseEnter={() => setOpenMenu(key)}
              onClick={() => setOpenMenu(openMenu === key ? null : key)}
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

        <div className="mr-4 flex flex-1 items-center justify-end gap-8">
          <a href="/login" className="cta cta--inline cta--light hidden bp1280:block">
            <span className="type-eyebrow">Log In</span>
          </a>
          <Cta
            variant="primary-subtle"
            theme="light"
            hasArrow
            href={GET_STARTED_HREF}
            className="whitespace-nowrap"
          >
            Get started
          </Cta>
          <button
            type="button"
            aria-label="Navigation menu"
            aria-expanded={drawerOpen}
            className="flex size-8 flex-col items-center justify-center gap-2 px-1 bp1280:hidden"
            onClick={() => (drawerOpen ? closeDrawer() : setDrawerOpen(true))}
          >
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </button>
        </div>
      </div>

      {/* Desktop mega-menu */}
      <div
        id={`nav-menu-${openMenu ?? "none"}`}
        className={cn(
          "absolute inset-x-0 top-(--global-nav-height) hidden bg-primitive-black text-primitive-white bp1280:block",
          styles.collapsible,
          openMenu && styles.collapsibleOpen,
        )}
      >
        <div>
          <div className="page-gutter mx-auto max-w-[1440px] py-10">
            {openMenu === "products" ? <ProductsMenu /> : null}
            {openMenu === "solutions" ? (
              <SolutionsMenu
                active={activeSolution}
                onSelect={setActiveSolution}
              />
            ) : null}
            {openMenu === "resources" ? <ResourcesMenu /> : null}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div
          className={cn(
            "fixed inset-0 top-(--global-nav-height) z-[899] overflow-y-auto bg-primitive-black text-primitive-white bp1280:hidden",
            styles.drawer,
            drawerDismissing ? styles.drawerClosing : styles.drawerOpen,
          )}
        >
          <div className="page-gutter py-6">
            {MENU_LABELS.map(({ key, label }) => (
              <div key={key} className="border-b border-white/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-5 text-left"
                  aria-expanded={mobileSection === key}
                  aria-controls={`drawer-${key}`}
                  onClick={() =>
                    setMobileSection(mobileSection === key ? null : key)
                  }
                >
                  <span className="type-subtitle2">{label}</span>
                  <ChevronDownIcon
                    className={cn(
                      "transition-transform duration-300",
                      mobileSection === key && "rotate-180",
                    )}
                    width={16}
                    height={16}
                  />
                </button>
                <div
                  id={`drawer-${key}`}
                  className={cn(
                    styles.collapsible,
                    mobileSection === key && styles.collapsibleOpen,
                  )}
                >
                  <div>
                    <ul className="flex flex-col gap-4 pb-6">
                      {flatten(key).map((item) => (
                        <li key={item.href + item.label}>
                          <a href={item.href} className="cta cta--inline cta--light">
                            <span className="type-body">{item.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <a href="/login" className="cta cta--inline cta--light block py-5">
              <span className="type-subtitle2">Log In</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** Flattens a mega-menu into the single link list the drawer shows. */
function flatten(key: MenuKey) {
  if (key === "products") return PRODUCTS_MENU.flatMap((g) => g.links);
  if (key === "solutions")
    return SOLUTIONS_MENU.map((g) => ({ label: g.heading, href: g.href }));
  return RESOURCES_MENU;
}

function ProductsMenu() {
  return (
    <div className="grid grid-cols-5 gap-10">
      {PRODUCTS_MENU.map((group) => (
        <div key={group.heading}>
          <p className="type-eyebrow mb-5 text-gray-500">{group.heading}</p>
          <ul className="flex flex-col gap-3">
            {group.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="cta cta--inline cta--light">
                  <span className="type-body">{link.label}</span>
                  {"description" in link && link.description ? (
                    <span className="type-footnote block text-gray-500">
                      {link.description}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SolutionsMenu({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  const current = SOLUTIONS_MENU[active];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-16">
      <ul className="flex flex-col gap-1">
        {SOLUTIONS_MENU.map((group, i) => (
          <li key={group.href}>
            <button
              type="button"
              className={cn(
                "cta cta--inline cta--light w-full rounded-lg px-4 py-3 text-left transition-colors duration-300",
                i === active ? "bg-white/10" : "hover:bg-white/5",
              )}
              onMouseEnter={() => onSelect(i)}
              onFocus={() => onSelect(i)}
              onClick={() => onSelect(i)}
            >
              <span className="type-body">{group.heading}</span>
            </button>
          </li>
        ))}
      </ul>
      <div>
        <a href={current.href} className="cta cta--inline cta--light">
          <span className="type-subtitle2">{current.heading}</span>
        </a>
        <p className="type-body mt-2 text-gray-500">{current.blurb}</p>
        <ul className="mt-8 grid grid-cols-3 gap-x-10 gap-y-4">
          {current.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="cta cta--inline cta--light">
                <span className="type-body">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResourcesMenu() {
  return (
    <ul className="grid grid-cols-3 gap-x-10 gap-y-8">
      {RESOURCES_MENU.map((item) => (
        <li key={item.href}>
          <a href={item.href} className="cta cta--inline cta--light">
            <span className="type-subtitle3 block">{item.label}</span>
            <span className="type-body mt-1 block text-gray-500">
              {item.description}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
