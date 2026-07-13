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
    // The headline ("Hi, Ideogram.") is rendered separately, so don't repeat it.
    intro: [
      `I'm a fan of Ideogram. I first came across your new brand through How&How's post on LinkedIn and got excited, though I was already using the product in client work (erasing power lines out of real-estate hero shots, among other things).`,
      `You're looking for a designer with one foot in Figma and one foot in Claude Code or Cursor, moving between the two to make things that weren't possible for a non-coder until now. That's me.`,
      `I've spent seven years building brands, and I came up through motion and video, a less common route into brand design. Lately I've been practically living in these AI tools, and it's the most fun I've had designing in years. The work I've curated below shows my range, from a coffee startup I co-founded to real estate and finance brand work, and a spec project I used to push myself into new territory.`,
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
      "A brand designer who builds. Portfolio tailored for Ideogram's Technical Brand Designer role.",
  },
  {
    slug: "novo",
    company: "Novo",
    role: "Senior Designer / Art Director",
    // DRAFT intro — scaffolding only, rewrite in Alexander's own voice.
    // Panel rule: "if AI wrote it, I'll know." Beats to hit: (1) motion/video +
    // AI-tooling is the edge and it's the must-have here; (2) the real angle —
    // he BANKS with Novo as a freelancer, i.e. he's their exact customer;
    // (3) what the work leads with (motion first). Do NOT ship as-is.
    intro: [
      `I'm Alexander — a brand and motion designer who works fast, ships video and campaign creative, and uses AI tools like Claude across the whole process instead of talking about them.`,
      `I also bank with Novo. I run my freelance practice on it, so I'm not pitching a company I just read about — I'm one of the small-business owners you're building for. That's the audience your marketing has to move, and I've been inside it.`,
      `The work below leads with motion and video, then the AI-native web builds and the brand systems underneath them.`,
    ],
    // Motion-first order for a growth/marketing creative role: motion (NV) ->
    // AI-native web build (Lily) -> systematic craft/range (PP) -> brand system.
    projectOrder: [
      "northern-vessel",
      "lily-development",
      "patient-pipeline",
      "cascata-group",
    ],
    surfaceTags: ["Motion", "Video", "AI Tools", "Web", "Brand"],
    ogTitle: "Alexander Prins for Novo",
    ogDescription:
      "Brand + motion designer who ships campaign creative with AI in the loop. Tailored for Novo's Senior Designer / Art Director role — from an actual Novo customer.",
  },
];

export function getJob(slug: string): JobPage | undefined {
  return jobs.find((j) => j.slug === slug);
}
