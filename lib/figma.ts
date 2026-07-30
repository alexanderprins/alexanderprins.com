// Data for the bespoke /figma application page (Motion Designer, Product
// Education). Unlike the other job pages, Figma's is VIDEO-led: for a
// motion/education role the pitch is the educational-motion work itself, not
// the brand case studies. So this page gets its own route (app/figma/page.tsx),
// NOT the shared [campaign] template, and it is intentionally kept out of
// lib/jobs.ts. This file holds the intro copy + the curated video selects.
//
// DRAFT copy is Alexander's voice, pending his final pass. No em dashes.

import type { Video } from "./videos";

const vimeo = (id: string) =>
  `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;

export const figmaRole = "Motion Designer, Product Education";

// DRAFT intro paragraphs (unapproved — voice pass pending). [Shift Nudge]
// links out to shiftnudge.com; [here] links to /video (same markdown-link
// convention as the campaign pages).
export const figmaIntro: string[] = [
  `I make design education videos for a living, so joining Figma's Product Education team might be the most natural next step I've come across to date.`,
  `At [Shift Nudge](https://shiftnudge.com), Matt D. Smith's product design education platform, I produce motion videos for junior and prospective designers to learn and grow in their skill. I own the whole pipeline: co-scripting, storyboarding, animating, editing, and publishing across YouTube and social. I've collaborated and iterated on formats that have generated more than 2 million views and grown the audience past 2x. Currently I am editing our Claude Code for Designers course, which in turn has taught me quite a bit about building in code. Teaching complex topics simply through motion is the very core of my day to day.`,
  `While motion and video were my entry points to creative work, I also design brand identities and build websites. Select projects are included on this page. I sweat the details, I iterate quickly, and I love finding creative solutions to problems.`,
  `Figma opened up the world of design to me; I'd love to help teach the next wave of designers how to use it.`,
];

// Optional personal intro video (talking-to-camera). Highest-leverage asset
// for a video role: show-don't-tell for "effective communicator / records
// voiceovers." Placeholder until produced; keep it 60-90s.
export const figmaIntroVideo: Video = {
  title: "Intro video", // placeholder-box label only; caption is hidden
  embedUrl: vimeo("1214166267"),
  aspect: "landscape",
};

// Flagship pairing: the full YouTube tutorial + its condensed short cut, shown
// together ("here is the long-form, and here is how I distill it").
export const figmaLongform: Video = {
  title: "Longform Figma Tutorial - Claude Icons",
  embedUrl: "https://www.youtube.com/embed/7zBp4ZNDto4",
  note: "Produced for MDS/Shift Nudge",
  aspect: "landscape",
};

export const figmaCondensed: Video = {
  title: "Shortform Figma Tutorial - Claude Icons",
  embedUrl: vimeo("1213780367"),
  note: "Shortform distillation",
  aspect: "portrait",
};

// Six short-form reels, two rows of three. Weather + Parking before/afters lead
// (compressed re-uploads); the remaining four are the ShiftNudge design reels,
// in Alexander's chosen presentation order.
export const figmaReels: Video[] = [
  {
    title: "Weather App Before & After",
    embedUrl: vimeo("1213783168"),
    note: "Edit, motion design: Me · UI Design: MDS",
  },
  {
    title: "Parking App Before & After",
    embedUrl: vimeo("1213783169"),
    note: "Edit, motion design: Me · UI Design: MDS",
  },
  {
    title: "Figma Motion Reel",
    embedUrl: vimeo("1213780330"),
    note: "Edit, motion design: Me · Design: MDS",
  },
  {
    title: "Contact Cards Reel",
    embedUrl: vimeo("1213780331"),
    note: "Edit, motion design: Me · UI Design: MDS",
  },
  {
    title: "The Box Model Reel",
    embedUrl: vimeo("1213780328"),
    note: "Edit, motion design: Me · Design: MDS",
  },
  {
    title: "Straggler Skit Reel",
    embedUrl: vimeo("1213780329"),
    note: "Edit, motion design, scripting: Me · Acting: MDS",
  },
];

export const figmaProjectOrder = [
  "northern-vessel",
  "patient-pipeline",
  "lily-development",
  "cascata-group",
];
