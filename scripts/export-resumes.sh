#!/bin/sh
# Print each tailored resume from the local rig (needs `npm run dev` on :3000).
# Writes two copies of each:
#   public/resume/alexander-prins-resume-<slug>.pdf  (served by the job page's download link)
#   ../resume/<Company>/Alexander Prins Resume.pdf     (local archive, one folder per company)
# Folder names mirror lib/resumes.ts.
# Usage: sh scripts/export-resumes.sh
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p public/resume
for pair in "figma-brand:Figma Brand" "linear:Linear" "supabase:Supabase" "fieldguide:Fieldguide" "baseten:Baseten"; do
  slug="${pair%%:*}"; folder="${pair#*:}"
  out="public/resume/alexander-prins-resume-$slug.pdf"
  "$CHROME" --headless=new --no-pdf-header-footer --virtual-time-budget=6000 \
    --print-to-pdf="$out" "http://localhost:3000/lab/resume?for=$slug" 2>/dev/null
  mkdir -p "../resume/$folder"
  cp "$out" "../resume/$folder/Alexander Prins Resume.pdf"
  echo "$slug -> $out + ../resume/$folder/"
done
