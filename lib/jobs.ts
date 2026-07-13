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
      `You're looking for a designer with one foot in Figma and one foot in Claude Code or Cursor, moving between the two to make things that weren't possible for a non-coder until now. That's me.`,
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
    intro: [
      `I'm actually a Novo customer. I've run my freelance business with it for over two years, and it's essential: bookkeeping, fast invoicing, and the reserves automation I genuinely love. I came for location-independent business banking and stayed for all of it. I'm the exact small-business owner your brand is built to reach.`,
      `For the role: I've led creative direction for marketing campaigns, and I move across brand, web, motion, and video. I've spent seven years embedded in startups and working directly under four founders while running my own business, so I know how they think and I'm comfortable taking an idea straight to the decision-makers. I also bring real judgment on AI tools, when they help and when they don't.`,
      `My background runs from high-growth startups to agencies to a world-class design education company to my own practice. The curated work below showcases brand and motion. More motion and video work can be found [here](/video). I'd genuinely love to contribute and help scale the brand of a product I already rely on.`,
    ],
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
