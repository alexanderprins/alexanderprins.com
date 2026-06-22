# Project Context — alexanderprins.com

Handoff doc so a fresh session (or Alexander) can pick up fast. Keep it current.

## What this is

Alexander Prins's personal portfolio site. It is also the job application: the
site itself is hand-built in code (Claude Code) to prove the exact skill the
target roles want. Primary target: **Ideogram, Technical Brand Designer**
(brand-first, not product). ~12 more brand-designer roles to follow, each as a
tailored page.

Positioning: "I specialize in brand design with a focus on shipping. I design
identities and build systems to scale them, increasingly in code."

## Where things live (related docs)

- `../shiftnudge-ai-portfolio-coach/progress.md` — the planning record:
  positioning, all 4 projects' locked copy, About copy, sequencing, design log.
- `../context/job-pipeline.md` — the pipeline of ~12+ roles to make tailored
  `/[campaign]` pages for (the next phase).
- `../context/job-search-targets.md` — target companies/roles.
- `../context/ideogram-portfolio-context.md` — the original Ideogram brief +
  strategy (why this build, panel insights, project mapping).
- `../context/patient-pipeline-image-brief.md` — image brief (real-image work).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · deployed target
Vercel. **Note:** Next 16 has breaking changes vs. older training data — `params`
is async (`await params`), global `PageProps<'/route'>` helper exists. See
`AGENTS.md`; read `node_modules/next/dist/docs/` before writing Next code.

## Run

```
npm run dev     # localhost:3000
npm run build   # verify production build (catches type errors)
```

Gotcha: after big `globals.css` changes, Turbopack dev can serve STALE CSS
(same chunk hash). If a token change isn't showing, restart: kill `next dev`,
`rm -rf .next`, `npm run dev`. A clean `npm run build` shows the true output.

## Routes

- `/` — homepage. Hero (eyebrow + name + positioning) + gallery of project cards.
- `/[campaign]` — tailored job pages (e.g. `/ideogram`). Direct-address intro +
  reordered/filtered project gallery. `dynamicParams = false` + `generateStaticParams`
  so only slugs in `lib/jobs.ts` resolve; everything else 404s.
- `/work/[slug]` — dedicated per-project gallery (images go BIG, 8-10 each) +
  concise writeup + Skills/Tools + testimonial + live link.
- `/about` — bio (Alexander's verbatim voice) + headshot.

## The "Siteprint" job-page system (how to add an application)

Each tailored page = one object in `lib/jobs.ts`. To add application #N: copy a
job block, set `company`, `role`, `intro` (direct-address paragraphs),
`projectOrder` (project slugs), optional `ogTitle`/`ogDescription`. The page
builds itself. This is the parent/instance idea (one template, many instances).

## Key files

- `lib/projects.ts` — single source of truth for all 4 projects (locked copy,
  tags, image slots). `homepageOrder`, `getProjectsInOrder()`.
- `lib/jobs.ts` — per-job page configs (the Siteprint instances).
- `lib/about.ts` — bio + positioning (Alexander's verbatim voice; do NOT
  AI-polish).
- `components/` — ProjectCard (index gallery block), ProjectMeta (Skills/Tools),
  SiteHeader, SiteFooter, EmailCopy (nav, hover+copy), ColophonButton (nav,
  hover), CtaEmail (footer, click-to-copy), Logo, ClaudeCrab, SocialIcons, Tag.

## Design system / rules

- Color: all "black" = **#1e1e1e** (overridden via `--color-black` in
  globals.css); white = #ffffff. **Orange #FF6A3D is reserved for Claude Code
  ONLY** (the crab on hover) — never a general accent.
- Type: PP Editorial New (self-hosted, serif headlines + descriptors), Geist
  (sans body), Geist Mono (labels/eyebrows). Mono tracking: labels 0.08em,
  eyebrows 0.18em.
- Spacing: 4pt grid = Tailwind's native scale (utility number x 4px). Alexander
  gives px; convert px/4. Key values are encoded in the pages/components.
- Corners: square everywhere EXCEPT the status pill (Spec/Shipped, rounded-full).
- Project descriptors: Title Case, "-ing + the win" (the serif heading).
- Status pill vocabulary: "Spec" | "Shipped" only.
- Nav: hover-reveal popovers (Email = hover then click-to-copy; colophon "Made
  with [crab]" = hover, informational). Logo top-left, NOT in the hero.
- Frame width: max-w-[1440px]. Thumbnail strip: 3 images, 16:9.
- Image rule: the site NEVER overlays text on images; titles/metadata are always
  chrome. Anything visible in an image is part of the image.
- Per-project mockup styles are intentionally DISTINCT (it's branding) — do not
  force one unified mockup system.
- Gotcha: lucide-react no longer ships brand icons (Github/Linkedin) — see
  `components/SocialIcons.tsx`.

## Status

Done: full structure + type system + spacing, all 4 projects' copy, About,
nav (both popovers), footer (CTA + bottom bar), favicons, logo inlined.

Pending (biggest lever first):
1. **Real images** — every gray box is a placeholder. Covers + 8-10 per /work +
   16:9 thumbnails. This is what makes it stop-scrolling.
2. Logo hover micro-animation + Play/Discover/Systematize moment (shapes are
   already individually `data-shape`-tagged in `Logo.tsx`).
3. `/ideogram` intro copy — still a DRAFT in `lib/jobs.ts`; needs Alexander's
   voice pass ("if AI wrote it, I'll know").
4. Patient Pipeline testimonial text (from Contra profile) — slot ready in
   `lib/projects.ts`.
5. GitHub account + URL (footer link is a `#` placeholder; plan: push this repo
   public as proof). Email inbox/forwarding for hello@alexanderprins.com.
6. Deploy to Vercel + custom domain.
