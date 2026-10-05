#!/bin/sh
# Web-encode the talking-head intro videos for the job pages.
# Masters (FCP exports, ~230MB each) stay in job-hunt; this writes small
# 1080p H.264 copies (~18MB, visually identical in testing) to public/intro/.
# Usage: sh scripts/encode-intros.sh
set -e
cd "$(dirname "$0")/.."
SRC="../../job-hunt/intro videos/export"
FF=/opt/homebrew/bin/ffmpeg
mkdir -p public/intro
for pair in "Figma:figma-brand" "Linear:linear" "Supabase:supabase" "Fieldguide:fieldguide" "Baseten:baseten"; do
  name="${pair%%:*}"; slug="${pair#*:}"
  "$FF" -v error -y -i "$SRC/$name Application.mp4" \
    -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart \
    "public/intro/$slug.mp4"
  echo "$name -> public/intro/$slug.mp4 ($(du -h "public/intro/$slug.mp4" | cut -f1))"
done
