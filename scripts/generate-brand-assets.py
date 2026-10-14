#!/usr/bin/env python3
"""
Derives every brand asset from one source mark.

Input:
  public/icons/tws-logo-source.png        white "TWS." on transparent, padded

Outputs:
  public/icons/tws-logo.png               tight crop, 160px tall, grayscale+alpha
  src/app/favicon.ico                     16/32/48/64, white mark on black
  public/seo/icon-192.png, icon-512.png   PWA / browser icons
  public/seo/apple-touch-icon-180.png     home-screen icons
  public/seo/apple-touch-icon-1024.png
  public/seo/og-image.png                 1200x630 share card

Run with: python3 scripts/generate-brand-assets.py
Requires: pillow, plus fonttools + brotli for the share card's type.
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/icons/tws-logo-source.png"
TAGLINE = "Strategy, design and technology, under one studio."
LOCATION = "CALICUT · KERALA · INDIA"


def cropped_mark() -> Image.Image:
    """The source art carries padding; everything downstream wants it gone."""
    art = Image.open(SOURCE).convert("RGBA")
    return art.crop(art.getchannel("A").getbbox())


def scaled(mark: Image.Image, height: int) -> Image.Image:
    return mark.resize(
        (round(mark.width * height / mark.height), height), Image.LANCZOS
    )


def square(mark: Image.Image, size: int) -> Image.Image:
    """App icon: the mark at 84% width, centred on the brand black."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    glyph = scaled(mark, max(1, round(size * 0.84 * mark.height / mark.width)))
    canvas.alpha_composite(glyph, ((size - glyph.width) // 2, (size - glyph.height) // 2))
    return canvas


def site_font(size: int, tmp: Path) -> ImageFont.FreeTypeFont:
    """
    The share card is set in Inter, like the site. `next/font` self-hosts it
    into `.next/static/media` at build time, and Pillow cannot read woff2, so
    the Latin subset is unpacked into a TTF first.

    Run a build before this script. Without one it falls back to a system sans
    and says so, rather than failing.
    """
    from fontTools.ttLib import TTFont

    ttf = tmp / "site.ttf"
    if not ttf.exists():
        for candidate in sorted((ROOT / ".next/static/media").glob("*.woff2")):
            font = TTFont(candidate)
            cmap = font.getBestCmap()
            if all(ord(c) in cmap for c in "ABCabc·,."):
                font.flavor = None
                font.save(ttf)
                break
        else:
            fallback = Path("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf")
            if not fallback.exists():
                raise SystemExit("no Inter build output and no system fallback font")
            print("  note: Inter not found in .next; using a system sans", file=sys.stderr)
            return ImageFont.truetype(str(fallback), size)
    return ImageFont.truetype(str(ttf), size)


def tracked(draw: ImageDraw.ImageDraw, text: str, font, y: int, fill, track=5) -> None:
    """Pillow has no letter-spacing, so the eyebrow is drawn glyph by glyph."""
    width = sum(draw.textlength(c, font=font) + track for c in text) - track
    x = (1200 - width) / 2
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + track


def share_card(mark: Image.Image, tmp: Path) -> Image.Image:
    card = Image.new("RGB", (1200, 630), (0, 0, 0))
    glyph = scaled(mark, round(460 * mark.height / mark.width))
    card.paste(glyph, ((1200 - glyph.width) // 2, 158), glyph)

    draw = ImageDraw.Draw(card)
    tag = site_font(36, tmp)
    draw.text(
        ((1200 - draw.textlength(TAGLINE, font=tag)) / 2, 378),
        TAGLINE,
        font=tag,
        fill=(229, 229, 229),
    )
    tracked(draw, LOCATION, site_font(19, tmp), 458, (138, 138, 138))
    return card


def main() -> int:
    if not SOURCE.exists():
        print(f"missing source art: {SOURCE}", file=sys.stderr)
        return 1

    mark = cropped_mark()

    # A flat silhouette: only alpha carries information, so grayscale+alpha
    # stores the same image in a quarter of the bytes.
    scaled(mark, 160).convert("LA").save(
        ROOT / "public/icons/tws-logo.png", optimize=True
    )

    for size, path in [
        (180, "public/seo/apple-touch-icon-180.png"),
        (1024, "public/seo/apple-touch-icon-1024.png"),
        (192, "public/seo/icon-192.png"),
        (512, "public/seo/icon-512.png"),
    ]:
        square(mark, size).save(ROOT / path, optimize=True)

    # One .ico only. `src/app/favicon.ico` is what Next serves at
    # /favicon.ico; a second copy in public/seo was never requested by a URL.
    square(mark, 256).save(
        ROOT / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )

    with tempfile.TemporaryDirectory() as tmp:
        share_card(mark, Path(tmp)).save(ROOT / "public/seo/og-image.png", optimize=True)

    print("brand assets regenerated from", SOURCE.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
