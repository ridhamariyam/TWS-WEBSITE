"use client";

import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Wraps content in the site's scroll reveal. Renders visible and is hidden
 * only if it starts below the fold, so anything already on screen paints with
 * the document. See `useReveal`.
 */
export function Reveal({
  as: Tag = "div",
  delay,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  /** Stagger, in ms. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { ref } = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
