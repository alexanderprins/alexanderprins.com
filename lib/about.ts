// About page copy. Alexander's own voice, verbatim (rewritten 2026-10-26).
// DO NOT AI-polish. Contractions and phrasing are intentional (human voice
// is the point; panel: "if AI wrote it, I'll know"). No em dashes.
//
// The page reads top to bottom: each block is a paragraph or one of the page's
// pictures (`image` = a photo in /public, `pds` = the live Play / Discover /
// Systematize morph). app/about/page.tsx lays them out.

export const positioning =
  "Translating complexity into simplicity with brand, motion, code and systems.";

export type AboutBlock =
  | { type: "p"; text: string }
  | { type: "image"; src: string; alt: string; width: number; height: number }
  | { type: "pds" };

export const ABOUT_HEADSHOT = { src: "/headshot.jpg", alt: "Alexander Prins", width: 1200, height: 1200 };

export const ABOUT_GREETING = "Hey there.";

export const ABOUT: AboutBlock[] = [
  {
    type: "p",
    text: "I’m Alexander. I professionally identify as a brand designer, but being self-taught, I’ve had a career full of twists and turns that have given me deep skill in motion design, video production, illustration, print and packaging design, and photography. Most recently, I’ve been building in code. Discovering code as a new medium has been an exciting shift in how I work. It’s an excellent time to be a builder.",
  },
  {
    type: "p",
    text: "My creative career began in 2019 when I moved from Colorado to Iowa. Before that, I dropped out of music school. Then, I was a luthier apprentice for a few months and built three guitars by hand. From selecting my tonewood to hand-carving the necks, this was one of the most rewarding experiences of my life.",
  },
  {
    type: "image",
    src: "/about/luthier.jpg",
    alt: "Alexander with the crew at the guitar-building apprenticeship, holding one of the guitars he built",
    width: 1206,
    height: 1190,
  },
  {
    type: "p",
    text: "I started doing creative work after arriving in Iowa, which started me down the winding journey of creative employment. Currently, I work for Shift Nudge helping educate UI designers.",
  },
  {
    type: "p",
    text: "My creativity follows the same shape by starting with play, leading to discovery, and evolving into systems.",
  },
  { type: "pds" },
  {
    type: "p",
    text: "Whether I’m working in design, video, photography, or code, it’s all creativity, just channeled into different tools, workflows, processes, and thought patterns.",
  },
  {
    type: "p",
    text: "Outside of work, I live in Des Moines, Iowa, with my wife and daughter. I’m also an unfortunate lifelong fan of the Colorado Rockies.",
  },
  {
    type: "image",
    src: "/about/family.jpg",
    alt: "Alexander with his wife and daughter",
    width: 2400,
    height: 1600,
  },
];
