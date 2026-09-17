import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@/components/icons";

/**
 * The site's one button primitive. Renders an <a> when `href` is given and a
 * <button> otherwise, so the same component covers nav links, form submits and
 * carousel controls.
 *
 * Visual variants map 1:1 onto the `.cta--*` classes in globals.css, which are
 * transcribed from docs/research/css/cta.css. `theme="light"` is the site's
 * naming for "sits on a dark background" — it inverts to white.
 */

export type CtaVariant =
  | "primary"
  | "primary-subtle"
  | "secondary"
  | "tertiary"
  | "inline";

type CtaOwnProps = {
  variant?: CtaVariant;
  theme?: "light" | "dark";
  /** Renders the sliding arrow that pushes the label left on hover. */
  hasArrow?: boolean;
  /** Adds the sweeping double underline used by inline text links. */
  underline?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

export type CtaProps = CtaOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CtaOwnProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CtaOwnProps>;

export function Cta({
  variant = "primary",
  theme = "dark",
  hasArrow = false,
  underline = false,
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
    underline && variant === "tertiary" && "cta--underline-hover",
    underline && variant === "inline" && "cta--has-inline-underline",
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
    const external = href.startsWith("http") || href.startsWith("#");
    const Tag = external ? "a" : Link;
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
