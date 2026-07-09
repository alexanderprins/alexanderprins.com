// Single source of truth for project case-study copy + metadata.
// Copy is Alexander's own (July 2026 rewrite, PP as the reference pattern).
// Keep it human-voiced and verbatim. No em dashes.

// Skills (disciplines) and tools are free-form display labels, authored per
// project and shown only on the /work case-study page.

export type Testimonial = {
  quote: string; // pull-quote (shown on card)
  full?: string; // longer version (progressive disclosure)
  author: string;
  title: string;
};

export type ProjectImage = {
  // src is empty until the real asset is produced; UI renders a labeled
  // placeholder box in the meantime so the layout/plan is visible.
  // A src ending in .mp4/.webm/.mov renders as a looping muted <video>;
  // anything else renders as <img>. `poster` is the still shown before a
  // video paints (optional).
  src?: string;
  poster?: string;
  alt: string;
  // Optional caption rendered as chrome BELOW the image in the /work gallery
  // (never overlaid). Most images have none; use sparingly for images that
  // carry a system/rationale worth spelling out.
  caption?: string;
  type: "cover" | "interface" | "lifestyle" | "detail" | "motion";
  // Display aspect in the /work gallery. Default (undefined) renders 16:9.
  // `portrait` renders the image at full 9:16; consecutive portraits are
  // auto-paired side by side (and stack on mobile). See app/work/[slug].
  aspect?: "portrait";
  // Homepage-card selection, independent of gallery (story) order.
  // `card: "cover"` = the big card image; `card: "thumb"` = one of the 3-up
  // thumbnail strip. The /work gallery ALWAYS renders every image in array
  // order regardless of these flags, so you can place an image early in the
  // story without forcing it into the card. If a project has no flags, the
  // card falls back to the old behavior: first image = cover, next 3 = thumbs.
  // Flag exactly one cover and three thumbs for a full card.
  card?: "cover" | "thumb";
  // Optional explicit left-to-right order for the 3-up thumb strip, decoupled
  // from gallery array order. Lower = earlier. Thumbs without it fall back to
  // array order. Only meaningful on `card: "thumb"` images.
  cardOrder?: number;
};

export type Project = {
  slug: string;
  title: string; // brand name (small mono metadata)
  descriptor: string; // the win, used as the serif heading (Title Case)
  subtitle: string; // SEO/meta description; not shown on the page when `year` is set
  year?: string; // body line under the H1 on the case-study page (falls back to subtitle)
  description: string;
  role: string;
  impact: string;
  status?: string; // pill vocabulary: "Shipped" | "Spec"
  liveUrl?: string;
  disciplines: string[];
  tools: string[];
  testimonial?: Testimonial;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "lily-development",
    title: "Lily Development",
    descriptor: "Rebranding a Legacy Multifamily Developer",
    subtitle:
      "A brand refresh and new website for a Philadelphia multifamily developer.",
    year: "2026",
    description: `A brand overhaul and new website for a Philadelphia multifamily developer. Lily has 28 years of experience, but lacked a brand or website that properly supported it. The old site was confusing to lenders, investors, and partners, and the primary wordmark suffered from legibility issues in small/digital contexts.`,
    role: `In collaboration with the CFO and CEO, I refined the brand identity by adjusting the contrast of the serif wordmark, introducing the lily flower mark, and introducing an intentional type system. I designed and built a new website in Framer using Claude Code and the Framer MCP server, and wrote all the copy for it in collaboration with the client.`,
    impact: `Lily Development now has a clear, current, and credible brand presence online and across their various touchpoints. The 28 year old developer finally looks and feels as solid online as they are in the real world.`,
    status: "Shipped",
    liveUrl: "https://lilydevelopment.framer.website",
    disciplines: [
      "Strategy",
      "Brand Identity Design",
      "Print Design",
      "AI Workflow",
      "Web Design/Build",
      "Copywriting",
    ],
    tools: ["Figma", "Framer", "Claude Code", "Photoshop"],
    testimonial: {
      quote: `Alex transformed a collection of projects and information into a cohesive brand and digital experience that communicates our capabilities, track record, and vision. The final product exceeded expectations and has become an important tool for investor relations and brand credibility.`,
      full: `Alex's work on Lily's rebrand and website elevated how we present ourselves to lenders, investors, partners, and prospective tenants. He transformed a collection of projects and information into a cohesive brand and digital experience that clearly communicates our capabilities, track record, and vision. Beyond being a talented designer, he took the time to understand our business and translate complex real estate concepts into a clean, intuitive experience. The final product exceeded expectations and has become an important tool for business development, investor relations, and brand credibility.`,
      author: "Daniel Wills",
      title: "CFO, Lily Development",
    },
    // Real assets wired from the updated LD selections set, in Alexander's
    // curated order (the selection filenames carry the intent). Homepage card:
    // cover = 02 laptop; thumbs ordered 04 (wordmark morph) -> 08 (brick) ->
    // 07 (flower) via cardOrder. 04, 07, and 11 are finished videos (type
    // "motion" with poster) — 07 is the flower mark build animation (poster is
    // the resolved frame, not the black open/close).
    images: [
      {
        type: "interface",
        card: "cover",
        src: "/work/lily-development/02-laptop.jpg",
        alt: "Lily Development website on a laptop, the new brand in context",
      },
      {
        type: "lifestyle",
        src: "/work/lily-development/03-construction-wall.jpg",
        alt: "Branded construction hoarding with the Lily flower mark and wordmark",
      },
      {
        type: "motion",
        card: "thumb",
        cardOrder: 1,
        src: "/work/lily-development/04-wordmark-morph.mp4",
        poster: "/work/lily-development/04-wordmark-morph.jpg",
        alt: "The Lily wordmark refining from the old thin serif into the new sturdier cut",
      },
      {
        type: "detail",
        src: "/work/lily-development/05-primary-lockup.jpg",
        alt: "Lily Development primary logo lockup: the flower mark above the wordmark",
      },
      {
        type: "detail",
        src: "/work/lily-development/06-logomark.jpg",
        alt: "The Lily flower logomark",
      },
      {
        type: "motion",
        card: "thumb",
        cardOrder: 3,
        src: "/work/lily-development/07-flower-mark.mp4",
        poster: "/work/lily-development/07-flower-mark.jpg",
        alt: "The Lily flower mark drawn from its construction geometry into the finished logomark",
      },
      {
        type: "detail",
        card: "thumb",
        cardOrder: 2,
        src: "/work/lily-development/08-brick.jpg",
        alt: "The Lily flower mark embossed into a clay construction brick",
      },
      {
        type: "detail",
        src: "/work/lily-development/09-letterhead.jpg",
        alt: "Lily Development letterhead",
      },
      {
        type: "interface",
        src: "/work/lily-development/10-site-lotus.jpg",
        alt: "Lily Development website, the Lotus project page",
      },
      {
        type: "motion",
        src: "/work/lily-development/11-site-scroll.mp4",
        poster: "/work/lily-development/11-site-scroll.jpg",
        alt: "Scrolling through the Lily Development website",
      },
      {
        type: "detail",
        src: "/work/lily-development/12-business-card.jpg",
        alt: "Lily Development business card",
      },
      {
        type: "interface",
        src: "/work/lily-development/13-linkedin.jpg",
        alt: "Lily Development LinkedIn profile and banner",
      },
      {
        type: "lifestyle",
        src: "/work/lily-development/14-hard-hat.jpg",
        alt: "A white hard hat branded with the Lily flower mark",
      },
      {
        type: "detail",
        src: "/work/lily-development/15-embroidery.jpg",
        alt: "The Lily flower mark embroidered on apparel",
      },
    ],
  },
  {
    slug: "cascata-group",
    title: "Cascata Group",
    descriptor: "Making One Operator Look Like an Institution",
    subtitle:
      "Brand identity, visual system, and website for a one-person capital strategy practice, built as a spec project that became a paying client and led me to Lily.",
    year: "2026",
    description: `Brand, visual system, and website for a one-man capital strategy practice operating primarily in real estate development. Cascata means waterfall in Italian, a nod to the founder's heritage and the primary directive for the project.`,
    role: `The founder had next to no pre-existing assets aside from the name, so we were building from scratch. Collaboratively, we sharpened his positioning. I designed a new logomark and custom wordmark, defined a type system, and created a fluid visual identity system. The website was designed and built in Framer using Claude Code via the Framer MCP server, and I wrote all of the copy for the website collaboratively with the client.`,
    impact: `The founder used to lose business to larger financial firms that he should have won. Now, Cascata Group looks like the credible, serious financial partner it always has been.`,
    status: "Shipped",
    liveUrl: "https://www.cascatagroup.com",
    disciplines: [
      "Strategy",
      "Brand Identity Design",
      "Visual Identity Design",
      "Web Design/Build",
      "Copywriting",
    ],
    tools: ["Figma", "Framer", "Illustrator", "Claude Code", "Photoshop"],
    // Real assets wired from the CG selections set, in Alexander's order (1-11).
    // Homepage card: cover = big wall; thumbs ordered 03 (logo) -> 08 (site
    // video) -> 05 (wordmark) via cardOrder. 08 is the finished site-scroll
    // video with a still poster grabbed from the clip.
    images: [
      {
        type: "cover",
        card: "cover",
        src: "/work/cascata-group/01-big-wall.jpg",
        alt: "Cascata Group brand mark on a construction hoarding under a bridge, navy lockup and Capital Strategy Execution tagline with a liquid-chrome wave",
      },
      {
        type: "lifestyle",
        src: "/work/cascata-group/02-scaffolding-banner.jpg",
        alt: "Navy Cascata Group banner mounted on building scaffolding, Capital Strategy and Deal Execution",
      },
      {
        type: "detail",
        card: "thumb",
        cardOrder: 1,
        src: "/work/cascata-group/03-logo-lines.jpg",
        alt: "Cascata logomark centered over concentric line waves on deep navy",
      },
      {
        type: "detail",
        src: "/work/cascata-group/04-logomark-binary.jpg",
        alt: "Cascata logomark shown in black on white to isolate its form",
      },
      {
        type: "detail",
        card: "thumb",
        cardOrder: 3,
        src: "/work/cascata-group/05-wordmark-grid.jpg",
        alt: "Cascata Group wordmark over its typographic construction grid",
      },
      {
        type: "detail",
        src: "/work/cascata-group/06-dark-lockup.jpg",
        alt: "Cascata Group lockup in cream on a dark liquid-chrome wave, Finance Strategy Results",
      },
      {
        type: "interface",
        src: "/work/cascata-group/07-laptop-desk.jpg",
        alt: "Cascata Group website on a laptop in a boardroom, Capital Strategy and Deal Execution hero",
      },
      {
        type: "motion",
        card: "thumb",
        cardOrder: 2,
        src: "/work/cascata-group/08-site-scroll.mp4",
        poster: "/work/cascata-group/08-site-scroll.jpg",
        alt: "Screen recording scrolling through the Cascata Group website",
      },
      {
        type: "interface",
        src: "/work/cascata-group/09-site-mobile.jpg",
        alt: "Cascata Group website on mobile, Capital Strategy and Deal Execution",
      },
      {
        type: "lifestyle",
        src: "/work/cascata-group/10-linkedin.jpg",
        alt: "Cascata Group LinkedIn company page with the brand banner and mark",
      },
      {
        type: "lifestyle",
        src: "/work/cascata-group/11-street-poster.jpg",
        alt: "Cascata Group bus-stop poster on a Paris street, Expert Financial Oversight",
      },
    ],
  },
  {
    slug: "northern-vessel",
    title: "Northern Vessel",
    descriptor: "Branding a Coffee Company From Cup to App",
    subtitle:
      "Founding designer and equity partner for a Des Moines coffee brand built from a lockdown delivery service into a flagship brick and mortar.",
    year: "2022",
    description: `Brand, visual system, photography, sub-branding and a whole lot of print design for a local coffee startup.`,
    role: `Founding designer and equity partner with near-total creative control. I refined the core logo and built the identity from the ground up with my cofounder. One of my primary responsibilities was overseeing the end to end development and launch of the Coffee Club subscription app, working with a developer and UX consultant. I designed the Coffee Club wordmark, custom iconography, and even the UI of the app - which falls outside the scope of this study. I also developed the shapes pattern, and worked on packaging, signage, motion design, social content, and provided photography and videography. All photography featured here is my own.`,
    impact: `Bootstrapped from a 2020 lockdown delivery service to a permitted street cart to the current brick and mortar, we raised private investment, grew the Coffee Club subscription to ~160 active members, pulled local and national press attention alike, and developed a social following that drove all of the early momentum. The shop is still open and thriving in Des Moines.`,
    status: "Shipped",
    disciplines: [
      "Strategy",
      "Brand Identity Design",
      "Visual System Design",
      "Packaging",
      "Print",
      "Signage",
      "Motion",
      "Social",
      "Videography",
      "Photography",
    ],
    tools: ["Illustrator", "Photoshop", "Figma", "Lightroom", "Final Cut Pro"],
    // Real assets wired from the NV selections set, in Alexander's gallery
    // order. Homepage card is explicit: cover = window-signage hero; thumbs =
    // retail bags, shapes-fill, wordmark (card order follows array order here).
    // Images 04/05 and 15/16 are portrait and auto-pair side by side; see
    // app/work/[slug]/page.tsx.
    images: [
      {
        type: "lifestyle",
        card: "cover",
        src: "/work/northern-vessel/00-hero-window-signage.png",
        alt: "Northern Vessel storefront windows: a vinyl wordmark beside repeating COFFEE COFFEE COFFEE lettering",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/01-full-lockup.png",
        alt: "Northern Vessel logomark and wordmark lockup with the Forward, Together tagline, white on sage green",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/02-to-go-cups.png",
        alt: "Two sage green Northern Vessel to-go cups, one with latte art, on white",
      },
      {
        type: "motion",
        src: "/work/northern-vessel/03-logo-suite.mp4",
        poster: "/work/northern-vessel/03-logo-suite.jpg",
        alt: "The Northern Vessel logo suite animating through its marks",
      },
      {
        type: "lifestyle",
        aspect: "portrait",
        src: "/work/northern-vessel/04-green-shirts.png",
        alt: "Two people in sage green Northern Vessel tees, seated and laughing",
      },
      {
        type: "lifestyle",
        aspect: "portrait",
        src: "/work/northern-vessel/05-a-frame-sign.png",
        alt: "Black A-frame sidewalk sign reading COFFEE COFFEE COFFEE with the Northern Vessel mark",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/06-neck-tag.png",
        alt: "Screen-printed neck tag inside a green tee: 100% cotton, hand printed in Des Moines",
      },
      {
        type: "detail",
        card: "thumb",
        src: "/work/northern-vessel/07-retail-coffee-bags.png",
        alt: "Home Blend retail coffee bags in a repeating flat-lay, dark green on green with the shapes pattern",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/08-menu.png",
        alt: "Northern Vessel printed menu, Summer 23, with the full drink list layout",
      },
      {
        type: "lifestyle",
        src: "/work/northern-vessel/09-bw-shirts.png",
        alt: "Two people wearing the cream Optimist Society long sleeve and the navy Optimist Society tee",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/10-optimist-white-back.png",
        alt: "Back print of the cream Optimist Society long sleeve: a smiling rain cloud, Rain or Shine",
      },
      {
        type: "motion",
        card: "thumb",
        src: "/work/northern-vessel/11-shapes-fill.mp4",
        poster: "/work/northern-vessel/11-shapes-fill.jpg",
        alt: "The Northern Vessel shapes pattern filling the frame, a brand motion loop",
      },
      {
        type: "detail",
        card: "thumb",
        src: "/work/northern-vessel/12-coffee-club-wordmark.jpg",
        alt: "The Coffee Club script wordmark in white on near-black",
      },
      {
        type: "lifestyle",
        src: "/work/northern-vessel/13-window-posters.png",
        alt: "Storefront window with two posters: the Coffee Club app and a Lavender Cold Brew Latte feature",
      },
      {
        type: "motion",
        src: "/work/northern-vessel/14-cheers-cups.mp4",
        poster: "/work/northern-vessel/14-cheers-cups.jpg",
        alt: "Two Coffee Club cups clinking in a cheers, a line-art brand animation",
      },
      {
        type: "lifestyle",
        aspect: "portrait",
        src: "/work/northern-vessel/15-bottle-and-cup.png",
        alt: "Northern Vessel cold brew bottle and a Coffee Club glass on a marble counter",
      },
      {
        type: "detail",
        aspect: "portrait",
        src: "/work/northern-vessel/16-optimist-black-back.png",
        alt: "Back print of the black Optimist Society tee on a wooden rack",
      },
      {
        type: "detail",
        src: "/work/northern-vessel/17-coffee-club-icons.jpg",
        alt: "Custom Coffee Club icon set: cheers cups, branded tee with beans, milk bottle, and steaming mug",
      },
      {
        type: "lifestyle",
        src: "/work/northern-vessel/18-tagline-poster.jpg",
        alt: "Experience coffee differently poster mounted on a cedar-clad shopfront exterior",
      },
    ],
  },
  {
    slug: "patient-pipeline",
    title: "Patient Pipeline",
    descriptor: "Repositioning a LASIK Agency as the Category Leader",
    subtitle:
      "A spec brand overhaul for a national LASIK lead-in agency, built to position an underdog as the category leader and for a future acquisition.",
    year: "2025",
    description: `A spec brand overhaul for a national LASIK lead-in agency, built to position an underdog as the category leader and for a future acquisition. I challenged myself to produce work I felt could stand up next to work from an agency team, exploring mediums I was less comfortable in and combining them. The eyedrop silhouette derived from the logo is the atomic building block of the whole system.`,
    role: `This spec project gave me a unique opportunity to follow my instincts without any outside influence. I set the strategy, positioning, evolved the old logo (also my work, from earlier in my career), generated the copy, and designed the whole identity.`,
    impact: `The goal was to accomplish two things: position the business as a leader now, and position the business for a future acquisition (a goal stated by the owner/operator). In order to accomplish this, the owner will need to hire replacements for himself, so I aimed to also produce an identity a future team could be proud of and that would attract top talent. As of July 2026, adoption of the identity by Patient Pipeline is pending.`,
    status: "Spec",
    disciplines: [
      "Strategy",
      "Brand Identity Design",
      "Visual System Design",
      "Motion Design",
      "3D Design",
      "Web Design",
    ],
    tools: ["Figma", "Illustrator", "Photoshop", "Final Cut Pro", "Spline", "Framer", "ChatGPT"],
    testimonial: {
      quote: `Alex's design work he did is visually captivating and exceptionally professional. He really made us a sleek, modern aesthetic that draws the eye. He has a thoughtful approach and meticulous attention to detail. The one thing that sets Alex apart from other designers is he truly integrates marketing strategy into branding work.`,
      author: "Nick Sideris",
      title: "Owner/Operator, Patient Pipeline",
    },
    // Final lineup (Jul 2026): 11 real assets, all 16:9. Gallery order = the NN- file
    // prefix (Alexander's revised sequence). Homepage card is explicit via card flags:
    // cover = 01 (auditorium), thumbs = 06 (3D spin) -> 09 (image containers) -> 07
    // (flower system) by cardOrder. Four finished videos (02, 03, 06, 07) render as
    // motion with a still poster; 03 + 07 were compressed to self-host size (Build Standards).
    images: [
      {
        type: "cover",
        card: "cover",
        src: "/work/patient-pipeline/01-cover-auditorium-hero.jpg",
        alt: "Gold 3D teardrop logo projected on a dark auditorium screen",
      },
      {
        type: "motion",
        src: "/work/patient-pipeline/02-logo-evolution.mp4",
        poster: "/work/patient-pipeline/02-logo-evolution.jpg",
        alt: "The old logo transforming into the new mark hidden in its negative space",
      },
      {
        type: "motion",
        src: "/work/patient-pipeline/03-booth.mp4",
        poster: "/work/patient-pipeline/03-booth.jpg",
        alt: "ASCRS trade-show booth: Industry Leading Results, Patient Pipeline, Transform Your Practice, with the teardrop mark animating",
      },
      {
        type: "detail",
        src: "/work/patient-pipeline/04-type-specimen.jpg",
        alt: "Brand specimen: sans wordmark, submark glyph set, and Industry Leading Results serif over a teal waveform teardrop",
      },
      {
        type: "detail",
        src: "/work/patient-pipeline/05-lanyard.jpg",
        alt: "ASCRS conference lanyard credential with the Patient Pipeline mark",
      },
      {
        type: "motion",
        card: "thumb",
        cardOrder: 1,
        src: "/work/patient-pipeline/06-logo-3d-spin-thumb1.mp4",
        poster: "/work/patient-pipeline/06-logo-3d-spin.jpg",
        alt: "Slow 3D render of the gold teardrop logo rotating",
      },
      {
        type: "motion",
        card: "thumb",
        cardOrder: 3,
        src: "/work/patient-pipeline/07-eyedrop-system-thumb3.mp4",
        poster: "/work/patient-pipeline/07-eyedrop-system.jpg",
        alt: "The teardrop generative system in motion: six teardrops resolving into the flower mark",
      },
      {
        type: "detail",
        src: "/work/patient-pipeline/08-color-system.jpg",
        alt: "Color system: RGB primaries, one per cone cell, pushed through blend modes over imagery",
        caption:
          "The eye sees in three colors. Red, green, blue. One for each type of cone cell (L, M, S). Patient Pipeline's accent palette is built from these three, pushed through blend modes over imagery for a flexible visual system.",
      },
      {
        type: "detail",
        card: "thumb",
        cardOrder: 2,
        src: "/work/patient-pipeline/09-system-images-thumb2.jpg",
        alt: "Teardrop image containers: pin, S-submark, and four-point star each filled with different photography",
      },
      {
        type: "lifestyle",
        src: "/work/patient-pipeline/10-blog-ig-story.jpg",
        alt: "Instagram blog and story set applying the brand across social",
      },
      {
        type: "interface",
        src: "/work/patient-pipeline/11-website-hero.jpg",
        alt: "Patient Pipeline website hero in Framer, We Deliver Real LASIK Patients",
      },
    ],
  },
];

// Default homepage order (Alexander's call).
export const homepageOrder = [
  "lily-development",
  "cascata-group",
  "northern-vessel",
  "patient-pipeline",
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsInOrder(slugs: string[]): Project[] {
  return slugs
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p));
}
