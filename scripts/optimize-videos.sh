#!/usr/bin/env bash
# Convierte raw/videos → public/media/video
#   {name}-720.mp4   H.264 720x1280  (mobile)
#   {name}-1080.mp4  H.264 1080x1920 (pantallas grandes)
#   {name}-poster.webp  primer frame del tramo (coincide con el arranque del video)
# Usa ffmpeg del sistema; si no hay, el binario de ffmpeg-static (npm).
set -euo pipefail
cd "$(dirname "$0")/.."

FF="${FFMPEG:-$(command -v ffmpeg || true)}"
if [ -z "$FF" ]; then FF="$(node -p "require('ffmpeg-static')")"; fi
OUT=public/media/video
mkdir -p "$OUT"

# name | source | start (s) | end (s)
JOBS=(
  "hero|raw/videos/Cine-3.mp4|35.0|49.7"
  "mate|$(ls raw/videos/copy_*.mov | head -1)|0|18.3"
)

encode() { # src start end height crf out
  "$FF" -v error -y -ss "$2" -to "$3" -i "$1" \
    -vf "scale=-2:$4:flags=lanczos,fps=30,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf "$5" \
    -g 60 -an -movflags +faststart "$6"
}

for job in "${JOBS[@]}"; do
  IFS='|' read -r name src ss to <<<"$job"
  echo "· $name ← $src [$ss–$to s]"
  encode "$src" "$ss" "$to" 1280 27 "$OUT/$name-720.mp4"
  encode "$src" "$ss" "$to" 1920 25 "$OUT/$name-1080.mp4"
  # Poster: primer frame del tramo → PNG temporal → WebP con sharp.
  tmp="$OUT/.$name-poster.png"
  "$FF" -v error -y -ss "$ss" -i "$src" -frames:v 1 -vf "scale=720:-2:flags=lanczos" "$tmp"
  node -e "require('sharp')(process.argv[1]).webp({quality:68}).toFile(process.argv[2]).then(()=>require('fs').unlinkSync(process.argv[1]))" "$tmp" "$OUT/$name-poster.webp"
done
echo "Listo → $OUT"
