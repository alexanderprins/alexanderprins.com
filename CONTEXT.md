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

- `lib/projects.ts` — single source of truth for all 4 projects (copy, skills +
  tools, image/video slots, `testimonial`, `year`). `homepageOrder`,
  `getProjectsInOrder()`. Skills/tools are free-form `string[]` labels now (the
  old Discipline/Tool/Tag unions were removed).
- `lib/jobs.ts` — per-job page configs (the Siteprint instances).
- `lib/about.ts` — bio + positioning (Alexander's verbatim voice; do NOT
  AI-polish).
- `components/` — ProjectCard (homepage gallery block: descriptor + status pill,
  full-width cover + 3-up 16:9 thumbs; NO skills/tools sidebar anymore),
  ProjectMeta (/work writeup only: Scope/Role/Impact + Skills/Tools row),
  Media (renders a `.mp4/.webm/.mov` src as a looping muted inline `<video>`
  with poster, else `<img>`), SiteHeader, SiteFooter, EmailCopy (nav,
  hover+copy), ColophonButton (nav, hover), CtaEmail (footer, click-to-copy),
  Logo, ClaudeCrab, SocialIcons. (Tag.tsx exists but is currently unused.)

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
- Frame width: max-w-[1440px]. Thumbnail strip: 3 images, 16:9. ALL image +
  video containers are 16:9, unless a slot is explicitly `aspect: "portrait"`.
- Homepage cards show only descriptor + status pill + cover + 3 thumbs — the
  Skills/Tools list was removed so preview images fill the full width. Skills/
  Tools live only on the `/work` case-study page.
- `/work` writeup: the Scope/Role/Impact grid is `max-w-[1040px]` (~7 words/line),
  Skills/Tools grouped far right. A `year` string renders as the body line under
  the H1 (falls back to `subtitle`, which is kept for SEO/meta). A `testimonial`
  (when present) renders as its own hairline callout band between the writeup and
  the gallery — NOT inside the Impact column.
- Video: short silent brand loops are self-hosted in `public/work/<slug>/`,
  compressed well under ~10MB (H.264, CRF ~24-26, `-an`, +faststart) and played
  via the `Media` component. Raw masters stay OUT of git. Longer/audio reels →
  embed (Mux/Cloudflare Stream). See `../Build Standards.md`.
- Image rule: the site NEVER overlays text on images; titles/metadata are always
  chrome. Anything visible in an image is part of the image. A gallery image MAY
  carry an optional `caption` (rendered as chrome BELOW the image, styled like
  the testimonial minus the hairline: `text-black max-w-[760px]`). Use sparingly
  for images that carry a system/rationale (e.g. PP color system).
- Per-project mockup styles are intentionally DISTINCT (it's branding) — do not
  force one unified mockup system.
- Gotcha: lucide-react no longer ships brand icons (Github/Linkedin) — see
  `components/SocialIcons.tsx`.

## Status

LIVE: pushed to GitHub (`origin` = github.com/alexanderprins/alexanderprins.com)
and auto-deploying to Vercel on every push to `main`. As of 2026-07-08, `main`
is at `584f7a2` and in sync with `origin/main`.

Done: full structure + type system + spacing, About, nav (both popovers), footer,
favicons, logo. All 4 projects have real images/videos wired (16:9). **Patient
Pipeline is fully finished** — revised asset order, rewritten Scope/Role/Impact
copy, `year: "2025"`, fuller free-form skill labels, and the Nick Sideris
testimonial (its spec→paid deal revived last week, so the quote is usable now).
Homepage cards no longer show skills/tools tags (images fill the width).
Self-hosted looping video wired via the `Media` component (see the video rule
above).

Pending (biggest lever first):
1. **Rewrite the other 3 projects' copy in PP's style** — Lily, Cascata, Northern
   Vessel still carry the older short skill labels + earlier Scope/Role/Impact
   copy. Alexander is redoing each like PP: fuller free-form skill labels, a
   `year`, and tightened Scope/Role/Impact. **PP is the reference pattern.**
2. `/ideogram` intro copy — still a DRAFT in `lib/jobs.ts`; needs Alexander's
   voice pass ("if AI wrote it, I'll know"). Then reskin `/[campaign]` for the
   other ~12 roles in `../context/job-pipeline.md`.
3. Logo hover micro-animation + Play/Discover/Systematize moment (shapes are
   already `data-shape`-tagged in `Logo.tsx`).
4. Custom domain on Vercel; email inbox/forwarding for hello@alexanderprins.com.
