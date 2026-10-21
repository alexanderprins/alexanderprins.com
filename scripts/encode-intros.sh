#!/bin/sh
# Web-encode the talking-head intro videos for the job pages.
# "Default" = the spine-only "about me" cut (no company bookends), reused on any page.
# Masters (FCP exports, ~230MB each) stay in job-hunt; this writes small
# 1080p H.264 copies (~18MB, visually identical in testing) to public/intro/.
# Usage: sh scripts/encode-intros.sh            (all)
#        sh scripts/encode-intros.sh Turquoise:turquoise   (just the pairs given)
set -e
cd "$(dirname "$0")/.."
SRC="../../job-hunt/intro videos/export"
FF=/opt/homebrew/bin/ffmpeg
mkdir -p public/intro
PAIRS="$*"
[ -n "$PAIRS" ] || PAIRS="Figma:figma Linear:linear Supabase:supabase Fieldguide:fieldguide Baseten:baseten Default:default Turquoise:turquoise"
for pair in $PAIRS; do
  name="${pair%%:*}"; slug="${pair#*:}"
  "$FF" -v error -y -i "$SRC/$name Application.mp4" \
    -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart \
    "public/intro/$slug.mp4"
  echo "$name -> public/intro/$slug.mp4 ($(du -h "public/intro/$slug.mp4" | cut -f1))"
done
