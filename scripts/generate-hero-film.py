#!/usr/bin/env python3
"""
Builds the homepage hero film from its master, in the two cuts the hero plays.

The master (`assets/videos/hero-film-master.mov`) is a portrait phone export of
a montage: six stills, each held for five frames, cycling, with a black beat
between cycles. The hero's desktop frame grows to cover a landscape screen, so
playing the portrait file there shows a thin strip of it blown up 2-3x. Instead:

1. The master is decoded at 30fps and the black beats are dropped (they are
   pure black, Y≈16, against ≥79 for every real frame), so the loop never
   flashes. The resulting frame-to-still sequence is kept as the timeline.
2. Every copy of each still is averaged, which removes the phone's
   compression noise — the copies differ only by that.
3. Each clean still is upscaled 4x with Real-ESRGAN (realesr-general-x4v3),
   blended 70/30 with a plain Lanczos upscale: on its own the model leaves a
   light halo along hard edges and a painted look on skin.
4. The wide cut reframes each still to 16:9 on its own subject (CROP_Y), at
   2560x1440. The tall cut is the whole still at 1080x1920, for the square
   frame on a phone.
5. Both are rebuilt on the original timeline and encoded to H.264.

Run with: python3 scripts/generate-hero-film.py
Requires: ffmpeg, numpy, pillow, torch and spandrel (`pip install --no-deps
spandrel einops safetensors`). The model weights are downloaded on first run
into `assets/videos/.cache/`. On a CPU the upscale takes about 15 minutes.
"""

import json
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "assets/videos/hero-film-master.mov"
CACHE = ROOT / "assets/videos/.cache"
OUT = ROOT / "public/videos"

MODEL_URL = (
    "https://github.com/xinntao/Real-ESRGAN/releases/download/"
    "v0.2.5.0/realesr-general-x4v3.pth"
)
FPS = 30
# Frames darker than this are the black beats between cycles.
BLACK_Y = 40
# A frame-to-frame change above this (mean abs, 0-255) is a cut to a new still.
CUT = 20
# Vertical centre, in master pixels (of 1920), of each still's 16:9 crop.
CROP_Y = {0: 920, 1: 1050, 2: 900, 3: 700, 4: 940, 5: 1340}
WIDE = (2560, 1440)
TALL = (1080, 1920)
CRF = 15
TILE, PAD, SCALE = 192, 16, 4
# Share of the Real-ESRGAN output in the blend with a Lanczos upscale.
AI_WEIGHT = 0.7


def run(*cmd: str) -> None:
    subprocess.run(cmd, check=True)


def extract(frames: Path) -> list[Path]:
    run(
        "ffmpeg", "-v", "error", "-y", "-i", str(MASTER), "-an", "-vf",
        f"fps={FPS},signalstats,metadata=select:key=lavfi.signalstats.YAVG:"
        f"value={BLACK_Y}:function=greater,setpts=N/{FPS}/TB",
        "-vsync", "passthrough", str(frames / "%04d.png"),
    )
    return sorted(frames.glob("*.png"))


def timeline(paths: list[Path]) -> list[int]:
    """Which still each frame shows, matched against the first cycle."""
    small = [
        np.asarray(Image.open(p).convert("L").resize((135, 240)), np.float32)
        for p in paths
    ]
    runs = [[0]]
    for i in range(1, len(small)):
        if np.abs(small[i] - small[i - 1]).mean() > CUT:
            runs.append([i])
        else:
            runs[-1].append(i)
    reps = [small[r[0]] for r in runs[: len(CROP_Y)]]
    order = [
        int(np.argmin([np.abs(small[r[0]] - rep).mean() for rep in reps]))
        for r in runs
    ]
    return [still for r, still in zip(runs, order) for _ in r]


def average(paths: list[Path], frames: list[int], still: int) -> Image.Image:
    picks = [p for p, s in zip(paths, frames) if s == still]
    acc = None
    for p in picks:
        a = np.asarray(Image.open(p).convert("RGB"), np.float64)
        acc = a if acc is None else acc + a
    return Image.fromarray(np.clip(acc / len(picks) + 0.5, 0, 255).astype(np.uint8))


def load_model():
    import spandrel
    import torch

    weights = CACHE / "realesr-general-x4v3.pth"
    if not weights.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(MODEL_URL, weights)
    model = spandrel.ModelLoader().load_from_file(str(weights)).model.eval()
    return model, torch


def upscale(model, torch, image: Image.Image) -> Image.Image:
    """4x, in overlapping tiles so it fits in a laptop's memory."""
    img = np.asarray(image, np.float32) / 255.0
    h, w, _ = img.shape
    out = np.zeros((h * SCALE, w * SCALE, 3), np.uint8)
    for y in range(0, h, TILE):
        for x in range(0, w, TILE):
            y0, x0 = max(0, y - PAD), max(0, x - PAD)
            y1, x1 = min(h, y + TILE + PAD), min(w, x + TILE + PAD)
            t = torch.from_numpy(img[y0:y1, x0:x1].transpose(2, 0, 1)).unsqueeze(0)
            with torch.inference_mode():
                r = model(t)[0].clamp(0, 1).numpy().transpose(1, 2, 0)
            ty, tx = (y - y0) * SCALE, (x - x0) * SCALE
            th, tw = (min(h, y + TILE) - y) * SCALE, (min(w, x + TILE) - x) * SCALE
            out[y * SCALE : y * SCALE + th, x * SCALE : x * SCALE + tw] = (
                r[ty : ty + th, tx : tx + tw] * 255 + 0.5
            ).astype(np.uint8)
    plain = image.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    return Image.blend(plain, Image.fromarray(out), AI_WEIGHT)


def wide(big: Image.Image, centre: int) -> Image.Image:
    w, h = big.size
    band = round(w * 9 / 16)
    top = min(max(0, centre * SCALE - band // 2), h - band)
    return big.crop((0, top, w, top + band)).resize(WIDE, Image.LANCZOS)


def encode(stills: dict[int, Path], frames: list[int], name: str, tmp: Path) -> None:
    seq = tmp / f"{name}.txt"
    seq.write_text(
        "".join(f"file '{stills[s]}'\nduration {1 / FPS}\n" for s in frames)
        + f"file '{stills[frames[-1]]}'\n"
    )
    mp4 = OUT / f"{name}.mp4"
    run(
        "ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(seq),
        "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-profile:v", "high",
        "-crf", str(CRF), "-preset", "slower", "-tune", "film",
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
        "-movflags", "+faststart", "-frames:v", str(len(frames)), str(mp4),
    )
    Image.open(stills[frames[0]]).save(OUT / f"{name}-poster.webp", quality=92)
    print(f"  {mp4.relative_to(ROOT)}  {mp4.stat().st_size / 1e6:.1f}MB")


def main() -> int:
    if not MASTER.exists():
        print(f"No master at {MASTER.relative_to(ROOT)}", file=sys.stderr)
        return 1
    if not shutil.which("ffmpeg"):
        print("ffmpeg is required", file=sys.stderr)
        return 1
    model, torch = load_model()
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d)
        (tmp / "frames").mkdir()
        paths = extract(tmp / "frames")
        frames = timeline(paths)
        print(f"{len(paths)} frames, {len(set(frames))} stills")
        (CACHE / "timeline.json").write_text(json.dumps(frames))
        tall, wide_ = {}, {}
        for still, centre in CROP_Y.items():
            big = upscale(model, torch, average(paths, frames, still))
            tall[still] = tmp / f"tall{still}.png"
            big.resize(TALL, Image.LANCZOS).save(tall[still])
            wide_[still] = tmp / f"wide{still}.png"
            wide(big, centre).save(wide_[still])
            print(f"  still {still} done")
        encode(wide_, frames, "hero-film-wide", tmp)
        encode(tall, frames, "hero-film", tmp)
    return 0


if __name__ == "__main__":
    sys.exit(main())
