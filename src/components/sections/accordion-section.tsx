"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { TogglePlusIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SmartLink } from "@/components/ui/smart-link";
import type { RichRun } from "@/types/content";
import styles from "./accordion-section.module.css";

/*
 * The homepage's collapsible blocks and the rows nested inside them.
 *
 * A panel is always exactly as tall as what is currently inside it, including
 * another panel that has just opened within it — see the stylesheet.
 *
 * A closed panel is `inert`, so its links and nested triggers leave the tab
 * order and the accessibility tree together. `aria-hidden` alone would hide
 * them from a screen reader while leaving them reachable by keyboard.
 */

export function AccordionRow({
  title,
  titleAs: Title = "h2",
  titleClassName,
  children,
  iconSize = 16,
}: {
  title: string;
  /** A real heading inside the trigger: h2 at top level, h3 when nested. */
  titleAs?: "h2" | "h3";
  titleClassName?: string;
  children: React.ReactNode;
  iconSize?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Written to the DOM rather than held in state: while a nested panel opens
   * this fires every frame, and each one is a style write, not a render. */
  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;

    const apply = () => {
      panel.style.height = open ? `${content.offsetHeight}px` : "0px";
    };
    apply();
    if (!open) return;

    const observer = new ResizeObserver(apply);
    observer.observe(content);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div className="relative w-full p-0 before:absolute before:top-0 before:right-(--grid-gutter-width) before:left-(--grid-gutter-width) before:block before:h-px before:w-[calc(100%-calc(var(--grid-gutter-width)*2))] before:bg-gray-800 before:content-['']">
      <button
        type="button"
        id={`${id}-title`}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent px-(--grid-gutter-width) py-6 text-left text-inherit bp744:py-8"
      >
        <Title className={cn("type-subtitle1", titleClassName)}>{title}</Title>
        <span className="ml-4 shrink-0">
          <TogglePlusIcon
            width={iconSize}
            height={iconSize}
            className={cn(
              "transition-[transform,color] duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none",
              open && "rotate-45 text-accent-ink",
            )}
            style={undefined}
          />
        </span>
      </button>
      <section
        ref={panelRef}
        id={`${id}-content`}
        aria-labelledby={`${id}-title`}
        inert={!open}
        data-open={open}
        className={styles.panel}
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
          <SmartLink
            key={i}
            href={run.href}
            className="cta cta--inline cta--has-inline-underline"
          >
            {run.label}
          </SmartLink>
        ),
      )}
    </p>
  );
}

/** One top-level block. */
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
    <section id={id} className="text-ink">
      <Reveal>
        <AccordionRow title={title}>{children}</AccordionRow>
      </Reveal>
    </section>
  );
}
