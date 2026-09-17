"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Wraps content in the site's scroll reveal.
 *
 * The live page server-renders `style="opacity:0;transform:translateY(25px)"`
 * on headlines, body copy and avatars, then clears both once the element
 * intersects the viewport. This reproduces that with the `.reveal` utility,
 * which also no-ops under `prefers-reduced-motion: reduce`.
 */
export function Reveal({
  as: Tag = "div",
  delay,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  /** Stagger, in ms — the stats cards use 0 / 100 / 200. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
