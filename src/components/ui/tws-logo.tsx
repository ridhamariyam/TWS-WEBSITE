/**
 * The TWS mark: white "TWS." on transparent. There is no dark variant, so it
 * is for dark surfaces only. Generated from `public/icons/tws-logo-source.png`
 * by scripts/generate-brand-assets.py.
 *
 * Callers set a height; the width follows the mark's ratio.
 */

/** 1991 x 450 in the cropped art. */
const ASPECT = 1991 / 450;

export function TwsLogo({
  height,
  alt = "",
  className,
}: {
  height: number;
  /** Leave empty where a wrapping link already names the destination. */
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src="/icons/tws-logo.png"
      alt={alt}
      width={Math.round(height * ASPECT)}
      height={height}
      className={className}
    />
  );
}
