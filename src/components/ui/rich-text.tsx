import type { RichText as RichTextValue } from "@/types/content";
import { cn } from "@/lib/utils";

type RichTextProps = {
  value: RichTextValue;
  /** Classes for emphasised fragments; defaults to the reference's ink semibold underline. */
  emphasisClassName?: string;
};

export function RichText({ value, emphasisClassName }: RichTextProps) {
  return (
    <>
      {value.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={i} className={cn("border-b border-current font-semibold text-ink", emphasisClassName)}>
            {part.emphasis}
          </span>
        ),
      )}
    </>
  );
}
