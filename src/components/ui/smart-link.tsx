import Link from "next/link";
import { isInternalHref } from "@/lib/site-links";

/**
 * A text link that picks its own element: internal paths go through next/link
 * to navigate client-side; mailto:, external and `#` links stay plain anchors.
 */
export function SmartLink({
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (isInternalHref(href)) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
