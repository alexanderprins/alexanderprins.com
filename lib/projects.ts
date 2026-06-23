// Single source of truth for project case-study copy + metadata.
// Copy here is the locked Phase 4 copy from the portfolio coach (progress.md).
// Keep it human-voiced. No em dashes.

export type Discipline =
  | "Branding"
  | "Identity"
  | "Strategy"
  | "Copywriting"
  | "Web"
  | "3D"
  | "Motion"
  | "Packaging";

export type Tool =
  | "Figma"
  | "Framer"
  | "Claude Code"
  | "Illustrator"
  | "Photoshop"
  | "Spline"
  | "After Effects"
  | "Final Cut Pro";

export type Tag = Discipline | Tool;

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
};

export type Project = {
  slug: string;
  title: string; // brand name (small mono metadata)
  descriptor: string; // the win, used as the serif heading (Title Case)
  subtitle: string;
  description: string;
  role: string;
  impact: string;
  status?: string; // pill vocabulary: "Shipped" | "Spec"
  liveUrl?: string;
  disciplines: Discipline[];
  tools: Tool[];
  testimonial?: Testimonial;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "lily-development",
    title: "Lily Development",
    descriptor: "Rebranding a Legacy Multifamily Developer",
    subtitle:
      "A brand refresh and new website for a Philadelphia multifamily developer, designed and built with an AI-native workflow.",
    description: `Lily had real work to show and a brand that wasn't doing it justice. The old site read as dated to the exact people Lily needs to impress: lenders, investors, and partners. I refined the identity, designed a clean and confident website, and built it with an AI-native workflow, so the company finally looks the part.`,
    role: `I created the Lily flower logomark and refined their existing serif wordmark for strength and legibility at small and digital sizes, while keeping the feel and recognition of the original. I expanded that into a fuller brand system, designed and built the website, and wrote all the site copy myself. The site was built in Framer, driven by Claude Code through the Framer MCP, an AI-native build workflow.`,
    impact: `Lily's old site was outdated and confusing to the lenders and investors they depend on, and it no longer represented what the company is today. The CFO recognized a serious need to fix it. I rebuilt their presence to be clear, current, and credible, so a 28-year developer finally looks as solid online as they are in the room. Shipped and launching.`,
    status: "Shipped",
    liveUrl: "https://lilydevelopment.framer.website",
    disciplines: ["Branding", "Identity", "Web", "Copywriting", "Strategy"],
    tools: ["Figma", "Framer", "Claude Code", "Illustrator"],
    testimonial: {
      quote: `Alex transformed a collection of projects and information into a cohesive brand and digital experience that communicates our capabilities, track record, and vision. The final product exceeded expectations and has become an important tool for investor relations and brand credibility.`,
      full: `Alex's work on Lily's rebrand and website elevated how we present ourselves to lenders, investors, partners, and prospective tenants. He transformed a collection of projects and information into a cohesive brand and digital experience that clearly communicates our capabilities, track record, and vision. Beyond being a talented designer, he took the time to understand our business and translate complex real estate concepts into a clean, intuitive experience. The final product exceeded expectations and has become an important tool for business development, investor relations, and brand credibility.`,
      author: "Daniel Wills",
      title: "CFO, Lily Development",
    },
    images: [
      { type: "cover", alt: "Lotus / Now Leasing construction hoarding" },
      { type: "interface", alt: "Website hero, browser-framed" },
      { type: "interface", alt: "Website, mobile" },
      { type: "detail", alt: "Wordmark refinement, before / after" },
      { type: "motion", alt: "Flower logo grid-build animation" },
      { type: "lifestyle", alt: "Billboard" },
      { type: "detail", alt: "Business cards and letterhead" },
      { type: "lifestyle", alt: "Branded hardhat" },
      { type: "detail", alt: "Embroidered cap" },
    ],
  },
  {
    slug: "cascata-group",
    title: "Cascata Group",
    descriptor: "Making One Operator Look Like an Institution",
    subtitle:
      "Brand identity, visual system, and website for a one-person capital strategy practice, built as a spec project that became a paying client and led me to Lily.",
    description: `Cascata Group is a one-person capital strategy and fractional-CFO practice that does more for its clients than firms many times its size. The problem was perception: the founder kept losing deals to bigger, more established-looking competitors, including one that went elsewhere purely because the other firm looked more trustworthy. The brand had to make a single operator feel like a serious, credible institution without pretending to be huge. Cascata means waterfall, a nod to the founder's Italian heritage, so I built the identity around financial flows and the way he moves like water, filling the gaps in every organization he works with. Fluid and distinctive on the surface, institutional and trustworthy underneath.`,
    role: `I built the brand from close to nothing: the logomark, the type and visual system, and the full identity. I helped sharpen the positioning, wrote all the site copy, and designed and built the website in Framer. The name was the only piece already in place, drawn from the founder's Italian heritage.`,
    impact: `I pitched it as a spec project, build it first and pay for it only if it landed, and a few months later it did. The bigger result was credibility: a one-person shop that kept losing deals to bigger names now reads as a serious financial partner. The project also opened the door to Lily Development, one of his clients, which became my next engagement.`,
    status: "Shipped",
    liveUrl: "https://www.cascatagroup.com",
    disciplines: ["Branding", "Identity", "Web", "Copywriting", "Strategy"],
    tools: ["Figma", "Framer", "Illustrator"],
    images: [
      { type: "cover", alt: "Cascata wall mark, navy and liquid chrome" },
      { type: "interface", alt: "Website screens, refreshed" },
      { type: "interface", alt: "Website, mobile" },
      { type: "detail", alt: "Cascata logomark close-up" },
      { type: "detail", alt: "Type system specimen" },
      { type: "lifestyle", alt: "Scaffolding poster in context" },
      { type: "lifestyle", alt: "Street poster" },
      { type: "detail", alt: "Waves brand element" },
      { type: "detail", alt: "Color and system close-up" },
    ],
  },
  {
    slug: "northern-vessel",
    title: "Northern Vessel",
    descriptor: "Branding a Coffee Company From Cup to App",
    subtitle:
      "Founding designer and equity partner for a Des Moines coffee brand built from a lockdown delivery service into a flagship brick and mortar.",
    description: `Northern Vessel started as a coffee delivery service during the 2020 lockdowns and grew into one of the most talked-about shops in town. The market was small but crowded, so the whole job was to feel more elevated, more alive, and more us than anything else around. That gave me a rare playground: a real brand to build a world around, from the cup in your hand to the app in your pocket.`,
    role: `Founding designer and equity partner with near-total creative control. I refined the core logo and built the whole identity system around it: the circle alt mark, the Coffee Club wordmark, custom iconography, the shapes pattern, packaging, signage, photography, motion, and social content. I also designed and shipped the Coffee Club membership app end to end, with a UX-designer friend advising and a software-engineer friend building it on iOS and Android.`,
    impact: `Bootstrapped from a 2020 delivery service to a permitted street cart to a brick-and-mortar in a rehabbed historic landmark. We raised private investment, grew the Coffee Club subscription to ~160 active members, and pulled local press and a social following that drove most of our early momentum. The shop is still open and thriving in Des Moines.`,
    status: "Shipped",
    disciplines: ["Branding", "Identity", "Packaging", "Motion", "Web"],
    tools: ["Illustrator", "Photoshop", "After Effects", "Figma"],
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
      "A spec rebrand for a national LASIK lead-generation agency, built to position a one-person operation as the category leader and a future acquisition.",
    description: `Patient Pipeline is a national LASIK marketing agency that runs lead generation for eye surgeons through Google and Facebook ads. I pitched it the same way I pitched Cascata: let me build a hypothetical brand for it, and buy it only if you love it. I wanted to make something that could stand next to a large agency's work, so I pushed into mediums I was less comfortable in and combined them. A teardrop silhouette pulled from the logo became the atomic building block of the whole system, generating submarks, patterns, primitives, and image containers. Robinhood's brand was the north star: proof that a "boring" industry can look confident and premium.`,
    role: `I did all of it. I evolved the logo (I had designed the original in my earlier years), set the strategy, and built the full identity: a flexible visual system with a teardrop silhouette as its atomic building block, a 3D logo render in Spline, environmental and trade-show booth design, internal document templates, a digital business card, social mockups, and the website hero in Framer.`,
    impact: `The strategy worked two ways. Gold to claim category leadership, and a brand polished enough to support the owner's real long-term goal: selling the business. To sell, he would eventually need to hire a team to replace himself, so I built an identity a future team could be proud of and that would help attract top talent. Spec or not, it is designed like a real acquisition asset.`,
    status: "Spec",
    disciplines: ["Branding", "Identity", "Strategy", "3D", "Motion", "Web"],
    tools: ["Illustrator", "Spline", "Photoshop", "Final Cut Pro", "Framer"],
    // TODO: testimonial exists (owner wrote one for Contra profile). Paste text + confirm name/title.
    // Order keeps the cover + first 3 thumbs (the homepage card) all real;
    // the two pending videos (color system, teardrop) sit deeper as labeled
    // placeholders until they land. Reorder freely once they're in.
    images: [
      {
        type: "cover",
        card: "cover",
        src: "/work/patient-pipeline/01-cover-auditorium.jpg",
        alt: "Gold 3D teardrop logo projected on a dark auditorium screen",
      },
      {
        type: "motion",
        src: "/work/patient-pipeline/02-logo-evolution.mp4",
        poster: "/work/patient-pipeline/02-logo-evolution.jpg",
        alt: "The old logo transforming into the new mark found in its negative space",
      },
      {
        type: "detail",
        card: "thumb",
        src: "/work/patient-pipeline/03-brand-statement.jpg",
        alt: "Industry Leading Results brand statement with blue waveform teardrop",
      },
      {
        type: "motion",
        card: "thumb",
        src: "/work/patient-pipeline/04-logo-3d-spin.mp4",
        poster: "/work/patient-pipeline/04-logo-3d-spin.jpg",
        alt: "Slow 3D render of the gold teardrop logo rotating",
      },
      {
        type: "interface",
        src: "/work/patient-pipeline/05-website-hero.jpg",
        alt: "Patient Pipeline website hero, We Deliver Real LASIK Patients",
      },
      {
        type: "motion",
        alt: "Color system: RGB primaries through blend modes (video in progress)",
      },
      {
        type: "motion",
        card: "thumb",
        alt: "The Teardrop generative system in motion (video in progress)",
      },
      {
        type: "detail",
        src: "/work/patient-pipeline/08-lanyard-credential.jpg",
        alt: "ASCRS conference lanyard credential with the Patient Pipeline mark",
      },
      {
        type: "lifestyle",
        src: "/work/patient-pipeline/09-social-set.jpg",
        alt: "Instagram blog-post set applying the brand across social",
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
