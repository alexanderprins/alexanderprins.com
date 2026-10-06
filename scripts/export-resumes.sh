#!/bin/sh
# Print each tailored resume from the local rig (needs `npm run dev` on :3000).
# Writes two copies of each:
#   public/resume/<id>/alexander-prins-resume.pdf  (served by the job page's download link;
#                                                   <id> is neutral, never the company)
#   ../resume/<Company>/Alexander Prins Resume.pdf  (local archive, one folder per company)
# slug:id:folder triples MIRROR lib/resumes.ts; keep them in sync.
# Usage: sh scripts/export-resumes.sh
set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for t in "figma:384a9b:Figma Brand" "linear:179c05:Linear" "supabase:d81fc6:Supabase" "fieldguide:3465b8:Fieldguide" "baseten:e2a521:Baseten"; do
  slug="${t%%:*}"; rest="${t#*:}"; id="${rest%%:*}"; folder="${rest#*:}"
  mkdir -p "public/resume/$id" "../resume/$folder"
  out="public/resume/$id/alexander-prins-resume.pdf"
  "$CHROME" --headless=new --no-pdf-header-footer --virtual-time-budget=6000 \
    --print-to-pdf="$out" "http://localhost:3000/lab/resume?for=$slug" 2>/dev/null
  cp "$out" "../resume/$folder/Alexander Prins Resume.pdf"
  echo "$slug -> $out + ../resume/$folder/"
done

# The default (untailored) resume: local archive only, no public copy.
mkdir -p "../resume/default"
"$CHROME" --headless=new --no-pdf-header-footer --virtual-time-budget=6000 \
  --print-to-pdf="../resume/default/Alexander Prins Resume.pdf" "http://localhost:3000/lab/resume" 2>/dev/null
echo "default -> ../resume/default/"
