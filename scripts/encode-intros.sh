#!/bin/sh
# Web-encode the talking-head intro videos for the job pages.
# "Default" = the spine-only "about me" cut (no company bookends), reused on any page.
# Masters (FCP exports, ~230MB each) stay in job-hunt; this writes 1080p H.264
# copies to public/intro/. CRF 20 (~4.5 Mbps): CRF 28 (~1 Mbps) looked fine in
# the small player but went soft and blocky full screen (2026-10-27). Override
# with CRF=24 sh scripts/encode-intros.sh ... if a file gets too big.
# Usage: sh scripts/encode-intros.sh            (all)
#        sh scripts/encode-intros.sh Turquoise:turquoise   (just the pairs given)
set -e
cd "$(dirname "$0")/.."
SRC="../../job-hunt/intro videos/export"
FF=/opt/homebrew/bin/ffmpeg
CRF="${CRF:-20}"
mkdir -p public/intro
PAIRS="$*"
[ -n "$PAIRS" ] || PAIRS="Figma:figma Linear:linear Supabase:supabase Fieldguide:fieldguide Baseten:baseten Default:default Turquoise:turquoise Ambrook:ambrook"
for pair in $PAIRS; do
  name="${pair%%:*}"; slug="${pair#*:}"
  "$FF" -v error -y -i "$SRC/$name Application.mp4" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart \
    "public/intro/$slug.mp4"
  echo "$name -> public/intro/$slug.mp4 ($(du -h "public/intro/$slug.mp4" | cut -f1))"
done
