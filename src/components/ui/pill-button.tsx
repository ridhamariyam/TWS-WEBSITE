import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type PillButtonProps = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Ink pill CTA. Hover: lifts 2px; the label slides up out of view while a
 * duplicate label rises into its place (0.65s / 0.8s, cubic-bezier(0.15,0.85,0.31,1)).
 * Desktop: 162x46, padding 11px 30px, 13px/19.5px weight 500, tracking 0.5px.
 * Below 992px: padding 9px 24px.
 */
export function PillButton({ href, label, className }: PillButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-[50px] border-2 border-ink bg-ink px-[30px] py-[11px] text-center text-[13px] leading-[19.5px] font-medium tracking-[0.5px] text-white shadow-pill transition-transform duration-300 ease-in-out hover:-translate-y-0.5 max-lg:px-6 max-lg:py-[9px]",
        className,
      )}
    >
      <span className="relative block">
        <span className="block transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.15,0.85,0.31,1)] group-hover:-translate-y-[39px]">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 block translate-y-[29px] opacity-0 transition-[transform,opacity] duration-[800ms,500ms] ease-[cubic-bezier(0.15,0.85,0.31,1)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          {label}
        </span>
      </span>
      <span className="ml-1.5 flex items-center">
        <ArrowRightIcon className="h-[14px] w-3" />
      </span>
    </Link>
  );
}
