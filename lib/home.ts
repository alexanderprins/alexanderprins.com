// Homepage content: the single-scroll portfolio (Noah Stokes feedback, 2026-10-23;
// Alexander's Figma frame "Homepage", 2026-10-24). The page reads top to bottom:
// four case-study grids, the logo wall, the motion grid, then Other Work.
// Image picks come from the Figma layer names; the code is the source of truth.

import { getImageBySrc, type ProjectImage } from "./projects";

export type CaseStudyBlock = {
  slug: string; // project slug; "See more" opens /work/<slug> in the side panel
  title: string;
  images: ProjectImage[]; // 2x2 grid, in reading order
};

const pick = (...srcs: string[]): ProjectImage[] =>
  srcs.map((src) => {
    const img = getImageBySrc(src);
    if (!img) throw new Error(`lib/home.ts: no project image with src ${src}`);
    return img;
  });

export const CASE_STUDIES: CaseStudyBlock[] = [
  {
    slug: "cascata-group",
    title: "Cascata Group",
    images: pick(
      "/work/cascata-group/01-big-wall.jpg",
      "/work/cascata-group/02-scaffolding-banner.jpg",
      "/work/cascata-group/03-logo-lines.jpg",
      "/work/cascata-group/06-dark-lockup.jpg",
    ),
  },
  {
    slug: "lily-development",
    title: "Lily Development",
    images: pick(
      "/work/lily-development/02-laptop.jpg",
      "/work/lily-development/07-flower-mark.mp4",
      "/work/lily-development/04-wordmark-morph.mp4",
      "/work/lily-development/08-brick.jpg",
    ),
  },
  {
    slug: "northern-vessel",
    title: "Northern Vessel",
    images: pick(
      "/work/northern-vessel/00-hero-window-signage.png",
      "/work/northern-vessel/07-retail-coffee-bags.png",
      "/work/northern-vessel/11-shapes-fill.mp4",
      "/work/northern-vessel/02-to-go-cups.png",
    ),
  },
  {
    slug: "patient-pipeline",
    title: "Patient Pipeline",
    images: pick(
      "/work/patient-pipeline/01-cover-auditorium-hero.jpg",
      "/work/patient-pipeline/08-color-system.jpg",
      "/work/patient-pipeline/09-system-images-thumb2.jpg",
      "/work/patient-pipeline/07-eyedrop-system-thumb3.mp4",
    ),
  },
];

// Logo wall, three across, labels as set in Figma. Black art, inverted in dark
// mode, except marks with their own dark version (`darkSrc`), shown as-is.
export const MARKS: { label: string; src: string; darkSrc?: string }[] = [
  { label: "Lily Development", src: "/logos/lily-black.svg", darkSrc: "/logos/lily-white.svg" },
  { label: "Cascata Group", src: "/logos/cascata-group.png" },
  { label: "Wills Family Orchard", src: "/logos/wills-family-orchard.png" },
  { label: "Hammer Basketball", src: "/logos/hammer-basketball.png" },
  { label: "Pepp's Pizzeria", src: "/logos/pepps-pizzeria.png" },
  { label: "Northern Vessel", src: "/logos/northern-vessel.png" },
  { label: "Patient Pipeline", src: "/logos/patient-pipeline.png" },
  { label: "Justin Salem Meyer", src: "/logos/justin-meyer-photography.png" },
  { label: "Super Secret Brunch Club", src: "/logos/secret-admirer.png" },
  { label: "Coffee Club", src: "/logos/northern-vessel-2.png" },
  { label: "Nothing Major", src: "/logos/good-news-darling.png" },
  { label: "Northern Vessel", src: "/logos/northern-vessel-3.png" },
  { label: "Campari", src: "/logos/campari.png" },
  { label: "Northern Vessel", src: "/logos/northern-vessel-4.png" },
  { label: "Super Secret Brunch Club", src: "/logos/super-secret-brunch-club.png" },
];

// Other Work: one-off pieces (wedding suite, cards, merch, menus). Placeholders
// until Alexander gathers the files.
export const OTHER_WORK: { title: string }[] = Array.from({ length: 8 }, () => ({
  title: "Work Title",
}));
