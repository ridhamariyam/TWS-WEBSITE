"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CaretDownSmallIcon,
  GlobeIcon,
  IcannLogo,
  SquarespaceMark,
  SslLogo,
} from "@/components/icons";
import { FOOTER_COLUMNS } from "@/lib/footer-content";

/*
 * Site footer.
 *
 * Desktop lays the eight link groups out as open columns. Below 744px each
 * group collapses into an accordion — the live site animates an explicit
 * `--footer-column-group-list-height` with
 * `height .3s cubic-bezier(.645,.045,.355,1)`, which is reproduced here by
 * measuring the list.
 */

const LANGUAGES = [
  "English",
  "Deutsch",
  "Español",
  "Français",
  "Italiano",
  "日本語",
  "Português",
  "한국어",
];

const LEGAL = [
  { label: "Terms", href: "/terms-of-service" },
  { label: "Privacy", href: "/privacy" },
  { label: "Security Measures", href: "/security" },
  { label: "Sitemap", href: "/sitemap" },
];

export function SiteFooter() {
  return (
    <footer id="footer" className="relative bg-primitive-black text-primitive-white">
      <div className="page-gutter grid gap-12 pt-16 pb-10 bp1020:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] bp1020:gap-16">
        <div className="flex flex-col gap-6">
          <SquarespaceMark width={29} height={24} />
          <p className="text-subtitle3">A website makes it real</p>
        </div>

        <div className="grid gap-x-8 gap-y-0 bp744:grid-cols-2 bp1020:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumnGroup key={column.heading} column={column} />
          ))}
        </div>
      </div>

      <div className="page-gutter flex flex-col gap-8 pb-10 bp744:flex-row bp744:items-center bp744:justify-between">
        <div className="flex flex-col gap-4 bp744:flex-row bp744:items-center bp744:gap-8">
          <span className="text-footnote flex items-center gap-3 text-gray-500">
            <IcannLogo width={45} height={45} />
            We are an ICANN accredited registrar.
          </span>
          <span className="text-footnote flex items-center gap-3 text-gray-500">
            <SslLogo width={26} height={29} />
            Data traffic protected by SSL encryption
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSetting
            label="English"
            icon={<GlobeIcon width={14} height={15} />}
            options={LANGUAGES}
            ariaLabel="Select language:"
          />
          <LocaleSetting
            label="₹ INR"
            options={["₹ INR", "$ USD", "€ EUR", "£ GBP"]}
            ariaLabel="Select currency:"
          />
        </div>
      </div>

      <div className="page-gutter flex flex-col gap-4 border-t border-white/10 py-8 bp744:flex-row bp744:items-center bp744:justify-between">
        <p className="text-footnote text-gray-500">
          *From TIME. © 2025 TIME USA LLC. All rights reserved. Used under
          license.
        </p>
        <div className="text-footnote flex flex-wrap items-center gap-6 text-gray-500">
          {LEGAL.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="cta cta--inline cta--has-inline-underline"
            >
              {item.label}
            </a>
          ))}
          <span>© 2003–2026 Squarespace, Inc.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumnGroup({
  column,
}: {
  column: { heading: string; links: Array<{ label: string; href: string }> };
}) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // The accordion animates a real pixel height, so the list is measured at the
  // moment of the toggle rather than during render.
  function toggle() {
    setHeight(open ? 0 : (listRef.current?.scrollHeight ?? 0));
    setOpen((o) => !o);
  }

  return (
    <div className="border-b border-white/10 bp744:border-0">
      {/* Mobile: tappable header. Desktop: plain label. */}
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex w-full items-center justify-between py-4 text-left bp744:pointer-events-none bp744:py-0 bp744:pb-4"
      >
        <span className="text-footnote text-gray-500">{column.heading}</span>
        <CaretDownSmallIcon
          width={8}
          height={7}
          className={cn(
            "transition-transform duration-300 bp744:hidden",
            open && "rotate-180",
          )}
        />
      </button>
      <ul
        ref={listRef}
        style={{
          ["--footer-column-group-list-height" as string]: `${height}px`,
        }}
        className={cn(
          "flex flex-col gap-3 overflow-hidden transition-[height,opacity] duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] motion-reduce:transition-none",
          "h-(--footer-column-group-list-height) opacity-0",
          open && "opacity-100",
          "bp744:h-auto bp744:pb-8 bp744:opacity-100",
        )}
      >
        {column.links.map((link) => (
          <li key={link.label + link.href}>
            <a
              href={link.href}
              className="cta cta--inline cta--light cta--has-inline-underline text-footnote"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LocaleSetting({
  label,
  icon,
  options,
  ariaLabel,
}: {
  label: string;
  icon?: React.ReactNode;
  options: string[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="text-footnote flex cursor-pointer items-center gap-2 rounded-lg bg-surface-card p-3 transition-opacity duration-300 hover:opacity-80"
      >
        {icon}
        {label}
        <CaretDownSmallIcon
          width={8}
          height={7}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "absolute bottom-full left-0 z-[1000] mb-2 w-max min-w-full rounded-lg bg-surface-card p-2 backdrop-blur-[10px] transition-opacity duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)]",
          open
            ? "visible opacity-100"
            : "invisible opacity-0 [transition:opacity_.3s_cubic-bezier(.645,.045,.355,1),visibility_.3s_step-end]",
        )}
      >
        <ul className="flex flex-col text-center">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={cn(
                  "text-footnote w-full rounded px-4 py-2 hover:bg-white/10",
                  option === label && "bg-white/10",
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
