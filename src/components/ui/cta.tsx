import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/components/ui/icons";
import { isInternalHref } from "@/lib/site-links";

/**
 * The site's one button primitive: an <a> when `href` is given, a <button>
 * otherwise. Variants map 1:1 onto the `.cta--*` classes in globals.css.
 * `theme="light"` means "sits on a dark background" and inverts to white. It
 * is the default because the whole site is dark; `theme="dark"` is for a
 * button set on a light surface.
 */

export type CtaVariant = "primary" | "primary-subtle" | "secondary" | "inline";

type CtaOwnProps = {
  variant?: CtaVariant;
  theme?: "light" | "dark";
  /** Renders the arrow that pushes the label left on hover. */
  hasArrow?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

export type CtaProps = CtaOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CtaOwnProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CtaOwnProps>;

export function Cta({
  variant = "primary",
  theme = "light",
  hasArrow = false,
  href,
  className,
  children,
  ...props
}: CtaProps) {
  const classes = cn(
    "cta",
    `cta--${variant}`,
    theme === "light" && "cta--light",
    hasArrow && "cta--has-arrow",
    className,
  );

  const content = (
    <>
      <span className="cta__label">{children}</span>
      {hasArrow ? (
        <span data-arrow="true" aria-hidden="true">
          <ArrowRightIcon className="cta__arrow-icon" width={16} height={16} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    const Tag = isInternalHref(href) ? Link : "a";
    return (
      <Tag
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Tag>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
