import { cn } from "@/lib/cn";
import type { RichRun } from "@/types/content";
import { SmartLink } from "./smart-link";

/** Renders body copy with inline links. */
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
