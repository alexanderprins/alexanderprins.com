// Single source of truth for the /video gallery page. Order here = page
// order (3-column grid, so rows read left-to-right, top-to-bottom). An entry
// without `embedUrl` renders as a labeled placeholder box.
//
// Embed URL formats:
// - Vimeo (clean player): https://player.vimeo.com/video/{id}?title=0&byline=0&portrait=0
// - Cloudflare Stream: the /iframe URL from the dashboard's embed snippet.

export type Video = {
  title: string; // shown as the caption under the player
  embedUrl?: string;
  note?: string; // optional credits line under the title
  aspect?: "portrait" | "landscape" | "square"; // defaults to portrait on /video
};

const vimeo = (id: string) =>
  `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;

export const videos: Video[] = [
  {
    title: "Shift Nudge Figma 101 Paid Ad",
    embedUrl: vimeo("1208675088"),
    note: "Edit: Me · Direction: MDS",
  },
  {
    title: "Weather App Before & After",
    embedUrl: vimeo("1208675086"),
    note: "Edit, motion design: Me · UI Design: MDS",
  },
  {
    title: "Parking App Before & After",
    embedUrl: vimeo("1208675085"),
    note: "Edit, motion design: Me · UI Design: MDS",
  },
  {
    title: "Shift Nudge Promo",
    embedUrl: vimeo("1208675087"),
    note: "Edit, motion design: Me · Direction: MDS",
  },
  {
    title: "Hammer Basketball App Promo",
    embedUrl: vimeo("1068498812"),
    note: "Edit, design, branding, direction: Me · Client: Hammer Basketball",
  },
  {
    title: "Spring Campaign Launch",
    embedUrl: vimeo("851115887"),
    note: "Edit, design, branding, motion, photography: Me · Client: Northern Vessel",
  },
  {
    title: "Royal Marshall Reel",
    embedUrl: vimeo("851118030"),
    note: "Edit, videography, direction: Me · Client: DMDT / Hello, Marjorie",
  },
  {
    title: "Flan It Reel",
    embedUrl: vimeo("851117317"),
    note: "Edit, videography, direction: Me · Client: DMDT / Hello, Marjorie",
  },
  {
    title: "Breath of Fresh Air Reel",
    embedUrl: vimeo("851118151"),
    note: "Edit, videography, direction: Me · Client: DMDT / Hello, Marjorie",
  },
];
