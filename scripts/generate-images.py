#!/usr/bin/env python3
"""
Right-sizes the studio's artwork into the derivatives the site loads.

Masters in `assets/images/` are 1.5-3MB PNGs; the pages need a few hundred KB.
This writes a width ladder per master into `public/images/` and records what it
wrote in `src/lib/image-manifest.json`, which is what the pages build their
`srcset` from — so a width can never be referenced that was not generated.

Masters stay outside `public/` on purpose: everything in it is uploaded on
every deploy and served on a public URL. Only the derivatives ship.

Basenames are the service, industry and project ids they belong to, so the
`image:` field in a component is the id of the thing it is showing.

Run with: python3 scripts/generate-images.py
Requires: pillow.
"""

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/images"
OUT = ROOT / "public/images"

# 82 banded visibly on this material — wide, soft gradients and out-of-focus
# backgrounds. 90 costs about half as much again and holds the originals.
QUALITY = 90

# Every source is emitted at each of these, skipping any wider than the master,
# plus the master's own width so a 2x display has every pixel there is.
LADDER = [480, 720, 1000, 1280, 1536, 1920]

# Where each group's masters live. The extension is whatever is on disk.
GROUPS = ["capabilities", "industries", "studio", "work"]

# E-commerce is both a capability and a sector, and the capability poster
# carries a headline down its left. The sector card prints its own headline, so
# it gets a crop that takes the picture and leaves the type behind.
CROP_ASPECT = 366 / 270
CROPS = {"ecommerce": 0.55}

# basename -> the widths actually written, for src/lib/images.ts to read.
MANIFEST: dict[str, list[int]] = {}


def widths_for(image: Image.Image) -> list[int]:
    """The ladder, capped at the master, and always including the master."""
    out = [w for w in LADDER if w < image.width]
    out.append(image.width)
    return out


def emit(image: Image.Image, name: str) -> None:
    MANIFEST[name] = widths_for(image)
    for w in MANIFEST[name]:
        h = round(image.height * w / image.width)
        out = OUT / f"{name}-{w}.webp"
        resized = image if w == image.width else image.resize((w, h), Image.LANCZOS)
        resized.save(out, "WEBP", quality=QUALITY, method=6)
        print(f"  {out.relative_to(ROOT)}  {w}x{h}  {out.stat().st_size // 1024}KB")


def masters() -> dict[str, Path]:
    """Every master, by basename. Sources arrive as either PNG or JPEG."""
    found = {}
    for group in GROUPS:
        for path in sorted((SRC / group).iterdir()):
            if path.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
                found[path.stem] = path
    return found


def main() -> int:
    if not SRC.is_dir():
        print(f"missing masters: {SRC}", file=sys.stderr)
        return 1

    OUT.mkdir(parents=True, exist_ok=True)
    found = masters()

    print("stills:")
    for name, path in found.items():
        emit(Image.open(path).convert("RGB"), name)

    print("crops:")
    for name, x0 in CROPS.items():
        if name not in found:
            print(f"  no master for {name}", file=sys.stderr)
            continue
        image = Image.open(found[name]).convert("RGB")
        left = int(image.width * x0)
        w = image.width - left
        h = round(w / CROP_ASPECT)
        top = max(0, (image.height - h) // 2)
        emit(image.crop((left, top, image.width, top + h)), f"{name}-crop")

    manifest = ROOT / "src/lib/image-manifest.json"
    manifest.write_text(json.dumps(dict(sorted(MANIFEST.items())), indent=2) + "\n")
    print(f"\nmanifest: {manifest.relative_to(ROOT)}  {len(MANIFEST)} sources")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
