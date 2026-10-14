"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { CaretDownSmallIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/smart-link";
import { TwsLogo } from "@/components/ui/tws-logo";
import { FOOTER_COLUMNS } from "@/lib/footer-content";

/*
 * Site footer: the studio line and four link groups. Open columns on desktop;
 * below 744px each group collapses into an accordion that animates a measured
 * pixel height.
 */

export function SiteFooter() {
  return (
    <footer id="footer" className="relative text-primitive-white">
      <div className="page-gutter grid gap-8 pt-10 pb-8 bp744:gap-12 bp744:pt-16 bp744:pb-10 bp1020:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] bp1020:gap-16">
        <div className="flex flex-col gap-6">
          <TwsLogo height={24} alt="TWS — The Web Studio" />
          <p className="type-subtitle3">
            Strategy, design and technology, under one studio.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-0 bp744:grid-cols-2 bp1020:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumnGroup key={column.heading} column={column} />
          ))}
        </div>
      </div>

      {/* Centred on a phone, where the two lines stack; the row splits to
        * the edges from 744px as before. */}
      <div className="page-gutter flex flex-col items-center gap-4 border-t border-white/10 py-8 text-center bp744:flex-row bp744:items-center bp744:justify-between bp744:text-left">
        <p className="type-footnote text-gray-500">
          Strategy / Design / Technology
        </p>
        {/*
          * No Terms or Privacy links: the site sets no cookies and there is
          * nothing yet for a notice to cover. Add one here alongside the
          * first analytics script.
          */}
        <div className="type-footnote flex flex-wrap items-center gap-6 text-gray-500">
          <span>© 2026 TWS — The Web Studio.</span>
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

  // Measured at the toggle rather than during render: the accordion animates
  // a real pixel height.
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
        <span className="type-footnote text-gray-500">{column.heading}</span>
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
            <SmartLink
              href={link.href}
              className="cta cta--inline cta--light type-footnote hover:underline hover:underline-offset-4"
            >
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
