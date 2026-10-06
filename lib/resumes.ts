// Job page slug -> its tailored resume. The footer shows a download link only on
// these pages. `id` is a neutral path segment so the PDF's web address never
// names the company: /resume/<id>/alexander-prins-resume.pdf. `folder` is the
// local archive folder in ../resume/. PDFs are printed from the local rig by
// scripts/export-resumes.sh (which mirrors this map); rerun it after edits.
export const RESUMES: Record<string, { folder: string; id: string }> = {
  figma: { folder: "Figma Brand", id: "384a9b" },
  linear: { folder: "Linear", id: "179c05" },
  supabase: { folder: "Supabase", id: "d81fc6" },
  fieldguide: { folder: "Fieldguide", id: "3465b8" },
  baseten: { folder: "Baseten", id: "e2a521" },
};

export const resumeFile = (slug: string) =>
  `/resume/${RESUMES[slug].id}/alexander-prins-resume.pdf`;

// Every variant downloads under the same name.
export const resumeDownloadName = "Alexander Prins Resume.pdf";
