"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TogglePlusIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/reveal";
import type { RichRun } from "@/types/content";

/*
 * The homepage's three collapsible blocks (how-to / FAQ / support) and the
 * nested FAQ rows all share this shape.
 *
 * The live page animates an explicit pixel height on the content wrapper, set
 * by JS, with no transition declared in CSS — so the easing here is borrowed
 * from the same design system's nav accordion (.7s cubic-bezier(.165,.84,.44,1)),
 * which is the only declared timing for this interaction anywhere in the bundle.
 */

export function AccordionRow({
  title,
  titleAs: Title = "h2",
  titleClassName,
  children,
  iconSize = 16,
}: {
  title: string;
  /** The source nests a real heading inside the trigger — h2 at top level, h3 in the FAQ. */
  titleAs?: "h2" | "h3";
  titleClassName?: string;
  children: React.ReactNode;
  iconSize?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // The panel animates a real pixel height, so it is measured at the moment of
  // the toggle rather than read off the ref during render.
  function toggle() {
    setHeight(open ? 0 : (contentRef.current?.scrollHeight ?? 0));
    setOpen((o) => !o);
  }

  return (
    <div className="relative w-full p-0 before:absolute before:top-0 before:right-(--grid-gutter-width) before:left-(--grid-gutter-width) before:block before:h-px before:w-[calc(100%-calc(var(--grid-gutter-width)*2))] before:bg-gray-800 before:content-['']">
      <button
        type="button"
        id={`${id}-title`}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent px-(--grid-gutter-width) py-6 text-left text-inherit bp744:py-8"
      >
        <Title className={cn("type-subtitle1", titleClassName)}>{title}</Title>
        <span className="ml-4 shrink-0">
          <TogglePlusIcon
            width={iconSize}
            height={iconSize}
            className={cn(
              "transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none",
              open && "rotate-45",
            )}
            style={undefined}
          />
        </span>
      </button>
      <section
        id={`${id}-content`}
        aria-labelledby={`${id}-title`}
        aria-hidden={!open}
        style={{ height }}
        className="overflow-hidden transition-[height] duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none"
      >
        <div ref={contentRef} className="px-(--grid-gutter-width) pb-10">
          {children}
        </div>
      </section>
    </div>
  );
}

/** Renders a paragraph run, keeping inline links as real anchors. */
export function RichParagraph({
  runs,
  className,
}: {
  runs: RichRun[];
  className?: string;
}) {
  return (
    <p className={cn("type-body", className)}>
      {runs.map((run, i) =>
        typeof run === "string" ? (
          <span key={i}>{run}</span>
        ) : (
          <a
            key={i}
            href={run.href}
            className="cta cta--inline cta--has-inline-underline"
          >
            {run.label}
          </a>
        ),
      )}
    </p>
  );
}

/** One of the three top-level blocks. */
export function AccordionSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-primitive-black text-primitive-white">
      <Reveal>
        <AccordionRow title={title}>{children}</AccordionRow>
      </Reveal>
    </section>
  );
}
