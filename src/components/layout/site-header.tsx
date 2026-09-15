"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { ArrowUpRightIcon, ChevronDownIcon } from "@/components/icons";
import { PillButton } from "@/components/ui/pill-button";
import { header } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/content";

const DESKTOP_QUERY = "(min-width: 992px)";

/**
 * Site header, absolutely positioned over the hero (not sticky).
 * >=992px: transparent 116px row. Logo, centred nav with a hover/focus dropdown, and the CTA pill.
 * <992px: 100px white bar with logo, CTA and a 4-line toggler that opens a
 * collapsible panel (grid-rows height transition).
 */
export function SiteHeader() {
  const panelId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
        setOpenSubmenu(null);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-[99]">
      <div className="flex h-[116px] items-center px-[45px] max-lg:h-[100px] max-lg:bg-white max-lg:px-[15px] max-md:px-0">
        {/* Logo */}
        <div className="flex basis-1/6 items-center px-[15px] max-lg:flex-1 max-lg:basis-auto">
          <Link href="/" className="inline-block py-[30px] max-lg:py-[22px]">
            <Image
              src={header.logo.src}
              alt={header.logo.alt}
              width={header.logo.width}
              height={header.logo.height}
              loading="eager"
              className="block h-[56px] w-[50px]"
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="flex basis-4/6 justify-center px-[15px] max-lg:hidden">
          <ul className="flex h-[116px] items-center">
            {header.nav.map((item, index) => (
              <DesktopNavItem key={item.label} item={item} active={index === 0} />
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="flex basis-1/6 items-center justify-end px-[15px] max-lg:basis-auto">
          <PillButton href={header.cta.href} label={header.cta.label} />
        </div>

        {/* Toggler (<992px) */}
        <div className="hidden items-center px-[15px] max-lg:flex">
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            className="flex h-[32px] w-[22px] cursor-pointer items-center"
          >
            <span aria-hidden="true" className="relative block h-[14px] w-[22px]">
              <span
                className={cn(
                  "absolute h-[2px] bg-ink transition-all duration-300",
                  menuOpen ? "top-[6px] left-[4px] w-0 opacity-0" : "top-0 left-[4px] w-[14px]",
                )}
              />
              <span
                className={cn(
                  "absolute top-[6px] left-0 h-[2px] w-[22px] bg-ink transition-all duration-300",
                  menuOpen && "rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute top-[6px] left-0 h-[2px] w-[22px] bg-ink transition-all duration-300",
                  menuOpen && "-rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute h-[2px] bg-ink transition-all duration-300",
                  menuOpen ? "top-[6px] left-[4px] w-0 opacity-0" : "top-[12px] left-[4px] w-[14px]",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet panel (<992px) */}
      <div
        id={panelId}
        inert={!menuOpen}
        className={cn(
          "absolute inset-x-0 top-[100px] hidden bg-white transition-[grid-template-rows,box-shadow] duration-[350ms] ease-[ease] max-lg:grid",
          menuOpen ? "grid-rows-[1fr] shadow-[0_15px_25px_rgba(0,0,0,0.06)]" : "grid-rows-[0fr] shadow-none",
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile">
            <ul className="px-[15px] py-[15px] max-md:px-0">
              {header.nav.map((item, index) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  active={index === 0}
                  submenuOpen={openSubmenu === item.label}
                  onToggleSubmenu={() => setOpenSubmenu((current) => (current === item.label ? null : item.label))}
                  onNavigate={closeMenu}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const children = item.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <li className={cn("flex items-center", hasChildren && "group/item relative")}>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-[116px] items-center px-[20px] py-[10px] text-[18px] leading-[20px] font-medium transition-colors duration-300 ease-[ease-in-out] hover:text-nav-muted max-xl:px-[12px]",
          active ? "text-nav-muted" : "text-ink",
          hasChildren && "group-focus-within/item:text-nav-muted group-hover/item:text-nav-muted",
        )}
      >
        {item.label}
      </Link>

      {hasChildren && (
        <div
          className={cn(
            "pointer-events-none invisible absolute top-full left-0 w-[310px] translate-y-[15px] rounded-[5px] bg-white px-[25px] py-[15px] opacity-0 shadow-[0_0_35px_rgba(0,0,0,0.1)] transition-[opacity,transform,visibility] duration-500 ease-[ease]",
            "group-focus-within/item:pointer-events-auto group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100",
            "group-hover/item:pointer-events-auto group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100",
          )}
        >
          <ul className="w-[260px]">
            {children.map((child, index) => (
              <li key={child.label}>
                <Link
                  href={child.href}
                  className={cn(
                    "flex h-[71px] items-center border-b border-[rgba(23,23,23,0.1)] py-[15px] pr-[30px] pl-0 text-[16px] leading-[28px] font-semibold text-ink transition-colors duration-300 ease-[ease-in-out] hover:text-nav-muted",
                    index === children.length - 1 && "border-b-0",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4]">
                    <ArrowUpRightIcon className="size-4 text-ink" />
                  </span>
                  <span className="ml-[15px]">{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

type MobileNavItemProps = {
  item: NavItem;
  active: boolean;
  submenuOpen: boolean;
  onToggleSubmenu: () => void;
  onNavigate: () => void;
};

function MobileNavItem({ item, active, submenuOpen, onToggleSubmenu, onNavigate }: MobileNavItemProps) {
  const submenuId = useId();
  const children = item.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <li className="relative">
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-[40px] items-center px-[15px] py-[10px] text-[18px] leading-[20px] font-medium transition-colors duration-300 ease-[ease-in-out] hover:text-nav-muted",
          active ? "text-nav-muted" : "text-ink",
          hasChildren && "pr-[50px]",
        )}
      >
        {item.label}
      </Link>

      {hasChildren && (
        <>
          <button
            type="button"
            aria-label={`Toggle ${item.label} submenu`}
            aria-expanded={submenuOpen}
            aria-controls={submenuId}
            onClick={onToggleSubmenu}
            className="absolute top-0 right-[5px] flex size-10 cursor-pointer items-center justify-center text-ink"
          >
            <ChevronDownIcon
              className={cn("size-4 transition-transform duration-300", submenuOpen && "rotate-180")}
            />
          </button>

          <div
            id={submenuId}
            inert={!submenuOpen}
            className={cn(
              "grid transition-[grid-template-rows] duration-[350ms] ease-[ease]",
              submenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <ul className="pb-[10px] pl-[30px]">
                {children.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      onClick={onNavigate}
                      className="block py-[6px] text-[16px] leading-[28px] font-semibold text-ink transition-colors duration-300 ease-[ease-in-out] hover:text-nav-muted"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </li>
  );
}
