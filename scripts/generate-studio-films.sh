#!/usr/bin/env bash
#
# Builds screen recordings of the studio's projects from the masters in
# assets/videos/ into the web cuts in
# public/videos/, each with a WebP poster.
#
# The masters stay outside public/ for the same reason the image masters do:
# everything in public/ is uploaded on every deploy.
#
# What each cut does to its master:
#   - Screen recordings lose their bottom strip, where the Next.js dev badge
#     sat while they were recorded.
#   - Everything loses its audio: every film on the site plays muted.
#
# Run with: bash scripts/generate-studio-films.sh   (needs ffmpeg)

set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/videos
OUT=public/videos
mkdir -p "$OUT"

# name, master, start, duration, filter, crf, poster time
cut() {
  local name=$1 master=$2 start=$3 duration=$4 filter=$5 crf=$6 poster=$7
  ffmpeg -v error -y -ss "$start" -t "$duration" -i "$SRC/$master" -an \
    -vf "$filter,format=yuv420p" -c:v libx264 -preset slow -crf "$crf" \
    -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$poster" -i "$OUT/$name.mp4" -frames:v 1 \
    -c:v libwebp -quality 82 "$OUT/$name-poster.webp"
  printf '  %-22s %5s KB  (poster %s KB)\n' "$name.mp4" \
    "$(( $(stat -c %s "$OUT/$name.mp4") / 1024 ))" \
    "$(( $(stat -c %s "$OUT/$name-poster.webp") / 1024 ))"
}

echo "studio films:"
# PEN Foundation, the desktop site.
cut pen-desktop  pen-desktop-recording.webm 0 15.5 "crop=iw:ih-64:0:0,scale=1440:-2"         27 1
# ZEEN, the storefront.
cut zeen-store   zeen-recording.webm        0 6.1  "crop=iw:ih-64:0:0,scale=1440:-2"         27 1
