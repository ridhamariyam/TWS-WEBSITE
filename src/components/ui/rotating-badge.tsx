import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RotatingBadgeProps = {
  /** Rendered diameter in px (reference: 190 dark / 295 light at 1440). */
  size: number;
  tone: "dark" | "light";
  /** Text set around the ring; repeat separators so it wraps the full circle. */
  ringText: string;
  /** Static centre content (icon or numeral). */
  children: ReactNode;
  className?: string;
};

/**
 * Circular badge: a static disc with a centre mark and a ring of uppercase text
 * that rotates continuously (8s linear, infinite). Original SVG composition —
 * sized in px, scale it with the `size` prop per breakpoint.
 */
export function RotatingBadge({ size, tone, ringText, children, className }: RotatingBadgeProps) {
  const id = useId().replace(/:/g, "");
  const dark = tone === "dark";
  // Ring radius as a fraction of the 100-unit viewBox.
  const radius = dark ? 37 : 38.5;

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full",
        dark ? "bg-ink" : "bg-white shadow-[0_0_50px_rgb(0_0_0/0.1)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {dark && (
        <span aria-hidden="true" className="absolute inset-[23%] rounded-full border border-white/20" />
      )}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_8s_linear_infinite]" aria-hidden="true">
        <defs>
          <path id={`ring-${id}`} d={`M50,50 m-${radius},0 a${radius},${radius} 0 1,1 ${radius * 2},0 a${radius},${radius} 0 1,1 -${radius * 2},0`} />
        </defs>
        <text
          fill={dark ? "#ffffff" : "#1c1d1f"}
          fontSize={dark ? 6.2 : 5.6}
          fontWeight={600}
          letterSpacing={dark ? 0.9 : 0.7}
          style={{ textTransform: "uppercase", fontFamily: "var(--font-inter)" }}
        >
          <textPath href={`#ring-${id}`}>{ringText}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
