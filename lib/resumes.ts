// Job page slug -> its tailored resume PDF in public/resume/. The footer shows a
// download link only on these pages. PDFs are printed from the local rig
// (/lab/resume?for=<slug>) by scripts/export-resumes.sh; rerun it after edits.
// value = the folder name in ../resume/ (the local archive of sent versions)
export const RESUMES: Record<string, string> = {
  "figma-brand": "Figma Brand",
  linear: "Linear",
  supabase: "Supabase",
  fieldguide: "Fieldguide",
  baseten: "Baseten",
};

export const resumeFile = (slug: string) => `/resume/alexander-prins-resume-${slug}.pdf`;
// Every variant downloads under the same name; only the URL path differs.
export const resumeDownloadName = "Alexander Prins Resume.pdf";
