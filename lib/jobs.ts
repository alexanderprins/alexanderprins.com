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
    slug: "mercury",
    company: "Mercury",
    role: "Senior Brand Designer, Growth",
    intro: [
      `Mercury is one of the few fintechs whose brand actually has taste, and the craft standard is obvious. Bringing craft and care back to modern finance is exactly the kind of work I want to be doing. I'm a brand designer who builds the systems and content that scale an identity, increasingly with growth and data in the loop.`,
      `At [Shift Nudge](https://shiftnudge.com), Matt D. Smith's design education platform, I own the content engine; I've doubled the audience from ~40K to 88K+, driven 2.2M+ views, and built the formats and funnels behind 16,500+ email subscribers. That's growth creative in practice: testing, reading the numbers and the comments, and iterating on what works. Data-informed.`,
      `Before that, I co-founded Northern Vessel and built its entire identity and launch campaign across every channel, opening at 2x revenue projections. I've also done brand and web work that made a solo operator read like a financial institution. I live in Figma, I have a real point of view on where AI tools help a creative workflow and where they get in the way, and I'd love to talk about contributing to the creative for Mercury's growth channels. A deeper set of my motion and video work lives [here](/video).`,
    ],
    projectOrder: [
      "northern-vessel",
      "cascata-group",
      "lily-development",
      "patient-pipeline",
    ],
    surfaceTags: ["Brand", "Growth", "Motion", "Web", "AI Tools"],
    ogTitle: "Alexander Prins for Mercury",
    ogDescription:
      "Brand designer who builds systems and growth creative, with AI in the loop. Tailored for Mercury's Senior Brand Designer, Growth role.",
  },
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
      "cascata-group",
      "northern-vessel",
      "lily-development",
      "patient-pipeline",
    ],
    surfaceTags: ["Motion", "Video", "AI Tools", "Web", "Brand"],
    ogTitle: "Alexander Prins for Novo",
    ogDescription:
      "Brand + motion designer who ships campaign creative with AI in the loop. Tailored for Novo's Senior Designer / Art Director role — from an actual Novo customer.",
  },
  {
    slug: "vercel",
    company: "Vercel",
    role: "Visual Designer, Web",
    intro: [
      `I'm a Vercel user. I designed this site and shipped it in Next.js, React, and Tailwind, hosted on Vercel. I built it like this because it was the best way to make the website I needed, and that's the part of Vercel I'm most excited about. The distance between an idea and a live, production-quality build on the real web has never been shorter, and you're the company that keeps closing it. I came up as a designer who thinks in systems yet never learned to code, but the last six months working in code more and more has been the most capable I've ever felt.`,
      `I'll be straight: I'm lighter on years than your 8+ pre-requisite. What I bring instead is hands-on range across the exact mediums you listed. Motion and video were my entry points to creative work, so that's my native language, not a nice-to-have. I still work in motion and video daily, producing content and courses for [Shift Nudge](https://shiftnudge.com), Matt D. Smith's product design education platform. I've built brand identities, animated, illustrated, photographed, shot and edited video, and dug into 3D when projects have called for it. While coding may not be what you mean by hands-on, I've grown increasingly invigorated working in it as a new medium. I don't hand things off and hope. I carry an idea all the way to the thing people actually see.`,
      `The work below showcases my range. This site itself is my first display, then a real estate development brand and website I designed and built, a self-initiated brand system for a LASIK marketing agency where I pushed into 3D and generative territory, a coffee company I co-founded and built the entire identity and motion world for, and finally branding and web work I did to position a solo operator like a financial institution. A variety of problems, one throughline: systems-minded design, shipped.`,
      `A deeper set of my motion and video work lives [here](/video). I'd love to bring that range to Vercel's most-seen surfaces and help set the bar other teams measure themselves against.`,
    ],
    projectOrder: [
      "lily-development",
      "patient-pipeline",
      "northern-vessel",
      "cascata-group",
    ],
    surfaceTags: ["Web", "Motion", "3D", "Brand", "Claude Code"],
    ogTitle: "Alexander Prins for Vercel",
    ogDescription:
      "A brand and motion designer who ships in code. Tailored for Vercel's Visual Designer, Web role — starting with this site, built in Next.js and hosted on Vercel.",
  },
  {
    slug: "wispr",
    company: "Wispr Flow",
    role: "Senior Designer, Brand & Growth",
    intro: [
      `There's a good chance I dictated part of this with Flow. I use it nearly every day (128 wpm, top 0.5%), and I could write paragraphs about what I love about it. That's the highest compliment I can give a tool, and it's what pulls me toward this role. You've taken something genuinely complex and made it feel obvious and human, and making complex things feel simple happens to be the throughline of my whole career.`,
      `My current work is almost exactly what this role is asking for. At [Shift Nudge](https://shiftnudge.com), Matt D. Smith's product design education platform, I turn dense UI design curriculum into short-form content people actually watch and learn from. I've built content formats and contributed to email funnels behind more than 2 million views and 16,500+ email subscribers, and grown the audience past 2x. That's conversion-focused campaign creative at scale, and simplifying complex ideas into clear, memorable stories is the whole job.`,
      `I think like an art director and I love getting elbow-deep in Figma. I do my best work when I own something from start to finish, but I'm comfortable collaborating within a team. Motion and video were my entry points to creative work, so that's my native language, and I design and build websites. I also have a real point of view on where AI tools are actually useful in creative work and where they hinder it, something I use daily. I move quickly without dropping craft, and I like carrying an idea from the first spark all the way to the thing that ships.`,
      `My curated work showcases my range: a coffee company I co-founded and built the entire identity and motion world for, a real estate developer I rebranded and built a website for, brand and web work that made a solo operator look like a financial institution, and a self-initiated system where I pushed into 3D and generative territory. A deeper set of my motion and video work lives [here](/video). I'd love to help shape how the next wave of people meet Flow.`,
    ],
    projectOrder: [
      "northern-vessel",
      "lily-development",
      "cascata-group",
      "patient-pipeline",
    ],
    surfaceTags: ["Motion", "Video", "Brand", "Web", "AI Tools"],
    ogTitle: "Alexander Prins for Wispr Flow",
    ogDescription:
      "Brand + motion designer and daily Flow user. Tailored for Wispr Flow's Senior Designer, Brand & Growth role — conversion-focused campaign creative that makes complex things feel simple.",
  },
];

export function getJob(slug: string): JobPage | undefined {
  return jobs.find((j) => j.slug === slug);
}
