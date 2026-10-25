import type { ProjectImage } from "./projects";

// The 9:16 motion loops, shared by the homepage Motion grid and the job pages'
// motion reel (same order as /turquoise). Files: /public/work/motion/{slug}.mp4
// + .jpg poster.
export type MotionItem = { label: string; img: ProjectImage };

const loop = (slug: string, alt: string): ProjectImage => ({
  src: `/work/motion/${slug}.mp4`,
  poster: `/work/motion/${slug}.jpg`,
  alt,
  type: "motion",
  aspect: "portrait",
});

export const MOTION_REEL: MotionItem[] = [
  { label: "Weather App", img: loop("weather-app", "Weather app UI motion loop") },
  { label: "Play, Discover, Systematize", img: loop("pds", "Play, discover, systemize flat shape animation") },
  { label: "Claude Card", img: loop("claude-card", "Claude card motion loop") },
  { label: "Northern Vessel Spring", img: loop("nv-spring", "Northern Vessel spring campaign motion loop") },
  { label: "Music Player", img: loop("music-player", "Music player UI motion loop") },
  { label: "Shape Morph", img: loop("shape-morph", "Play, discover, systemize shape morph") },
];
