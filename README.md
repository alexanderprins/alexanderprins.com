# alexanderprins.com

My personal portfolio site. I'm a brand and motion designer who increasingly
ships the real thing in code — so this site is hand-built rather than dropped
into a template, because the build *is* part of the work I'm showing.

Live: https://alexanderprins.com

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind v4**
- Self-hosted type (PP Editorial New, Geist, Geist Mono)
- Deployed on **Vercel**

## How it's organized

The site is content-driven from a few typed source-of-truth files, so adding a
project or a tailored page is data entry, not re-coding the layout.

- `lib/projects.ts` — every case study (copy, tags, image slots) in one place.
- `lib/jobs.ts` — tailored landing pages built from those projects.
- `lib/about.ts` — bio and positioning.
- `app/work/[slug]` — per-project galleries.
- `app/lab/` — experiments (e.g. an SVG wordmark morph animated in code).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also the type-check gate)
```
