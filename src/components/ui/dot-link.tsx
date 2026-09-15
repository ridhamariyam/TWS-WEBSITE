import Link from "next/link";
import { cn } from "@/lib/utils";

type DotLinkProps = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Uppercase text link sitting on a 50px lime dot. On hover the dot expands
 * left-to-right to fill the whole link (reference "btn-expand-ltr").
 * Desktop: padding 14px 26px, 14px/21px, weight 700, tracking 0.5px.
 */
export function DotLink({ href, label, className }: DotLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative isolate inline-block overflow-hidden px-[26px] py-[14px] text-center text-[14px] leading-[21px] font-bold tracking-[0.5px] text-ink uppercase transition-colors duration-300 ease-in-out",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-[50px] rounded-[100px] bg-lime transition-[width] duration-300 group-hover:w-full"
      />
      <span className="relative">{label}</span>
    </Link>
  );
}
