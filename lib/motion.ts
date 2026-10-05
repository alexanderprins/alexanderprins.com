// Data for the two bespoke, video-led MOTION application pages (Fieldguide,
// Baseten). Layout (2026-10-05): intro video, then the motion reels as
// "Featured Work", then the homepage morph block with its list relabeled
// "Brand Work" (motion roles lead with motion; the morph is itself a live,
// code-built motion piece) plus Other Work links. No take-home (its animation
// has "for Figma" baked in), no brand project cards.
//
// `intro` is the cover letter: kept as draft copy, NOT rendered (Alexander's
// call, 2026-10-05). No em dashes.

import type { Video } from "./videos";
import { figmaReels } from "./figma";

export type MotionApp = {
  slug: string;
  company: string;
  role: string;
  intro: string[]; // cover letter: kept as draft copy, not rendered
  introVideo: Video; // talking-head intro
  reels: Video[]; // the "Featured Work" video grid
  ogTitle: string;
  ogDescription: string;
};

// Self-hosted talking-head intro: /public/intro/{slug}.mp4 + .jpg cover.
const introVideo = (slug: string, company: string): Video => ({
  title: `Intro video for ${company}`,
  src: `/intro/${slug}.mp4`,
  poster: `/intro/${slug}.jpg`,
  aspect: "landscape",
});

export const fieldguide: MotionApp = {
  slug: "fieldguide",
  company: "Fieldguide",
  role: "Senior Motion Designer",
  intro: [
    `The Senior Motion Designer role is built around the thing I do best: taking something dense and technical and turning it into motion that actually makes sense. That is the core of what I do day to day.`,
    `At [Shift Nudge](https://shiftnudge.com), Matt D. Smith's design education platform, I produce motion videos that teach dense UI concepts simply. I own the whole pipeline: co-scripting, storyboarding, animating, editing, and publishing. The formats I have built and iterated on have driven more than 2 million views and grown the audience past 2x. Making complex ideas clear through motion is the whole job.`,
    `I also think in systems, so building and owning a motion language, not just cranking out one-off animations, is exactly how I like to work. Motion and video were my entry point into design, and I still design brand identities and build in code. Selected work is below, and a deeper set of motion and video lives [here](/video).`,
  ],
  introVideo: introVideo("fieldguide", "Fieldguide"),
  reels: figmaReels,
  ogTitle: "Alexander Prins for Fieldguide",
  ogDescription:
    "A motion designer who turns dense, technical ideas into clear motion. Tailored for Fieldguide's Senior Motion Designer role.",
};

export const baseten: MotionApp = {
  slug: "baseten",
  company: "Baseten",
  role: "Motion Designer, Brand Team",
  intro: [
    `One line in your job description stopped me: you want someone who can make complex, technical concepts compelling without falling back on generic AI visuals. I have strong opinions about that, and I would love to bring them.`,
    `At [Shift Nudge](https://shiftnudge.com), Matt D. Smith's design education platform, I produce motion videos that turn dense UI concepts into something people actually watch and learn from. I own the pipeline end to end, and the formats I have built have driven more than 2 million views and grown the audience past 2x.`,
    `I think in systems and I have spent the last several months building in code, so defining and building a motion language from the ground up is exactly the kind of work I want. I care about fundamentals, typography, pacing, and composition, more than trends or technique. Selected work is below, and a deeper set of motion and video lives [here](/video).`,
  ],
  introVideo: introVideo("baseten", "Baseten"),
  reels: figmaReels,
  ogTitle: "Alexander Prins for Baseten",
  ogDescription:
    "A motion designer with a real point of view on making technical products compelling. Tailored for Baseten's Motion Designer, Brand Team role.",
};
