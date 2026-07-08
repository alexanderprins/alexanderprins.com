// Job-specific page configs. Each entry is one tailored application page
// (e.g. /ideogram). This is the "Siteprint" parent/instance idea in code:
// one page template, many instances, each fed a different data object.
//
// To add application #N: copy a block, fill in the fields, done.

export type JobPage = {
  slug: string; // URL segment, e.g. "ideogram" -> /ideogram
  company: string;
  role: string;
  intro: string[]; // direct-address paragraphs, shown above the work
  projectOrder: string[]; // project slugs, in display order
  surfaceTags?: string[]; // tags to emphasize for this audience (unused for now)
  ogTitle?: string;
  ogDescription?: string;
};

export const jobs: JobPage[] = [
  {
    slug: "ideogram",
    company: "Ideogram",
    role: "Technical Brand Designer",
    // DRAFT intro — rewrite in Alexander's own voice before shipping.
    // Panel rule: "if AI wrote it, I'll know." This is scaffolding only.
    // The headline ("Hi Ideogram.") is rendered separately, so don't repeat it.
    intro: [
      `I'm Alexander, a brand designer who ships in code.`,
      `Your listing asked for someone who designs identity and builds it with tools like Claude Code and Cursor. That's the exact intersection I've been living in. I spent the last year inside a design-education company learning to drive AI tools in a real creative practice, and I build client sites by hand in code with Claude Code. This page itself is one of them.`,
      `The work below leads with what's most relevant to you: 3D and generative systems, an AI-native website build, and full brand systems I designed and shipped end to end.`,
    ],
    projectOrder: [
      "patient-pipeline",
      "lily-development",
      "northern-vessel",
      "cascata-group",
    ],
    surfaceTags: ["3D", "Claude Code", "Branding", "Web"],
    ogTitle: "Alexander Prins for Ideogram",
    ogDescription:
      "A brand designer who ships in code. Portfolio tailored for Ideogram's Technical Brand Designer role.",
  },
];

export function getJob(slug: string): JobPage | undefined {
  return jobs.find((j) => j.slug === slug);
}
