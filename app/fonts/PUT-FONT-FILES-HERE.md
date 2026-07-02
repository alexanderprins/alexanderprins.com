# Fonts — do NOT self-host

The site uses **one typeface sitewide: Aktiv Grotesk**, served from **Adobe
Fonts** (licensed via Creative Cloud). It loads from Adobe's CDN through the
Typekit `<link>` in `app/layout.tsx` — there are intentionally **no font files
in this repo**.

Why no files here: the Adobe Fonts / Creative Cloud license covers webfont use
**only** through Adobe's hosted embed. Downloading, converting, self-hosting, or
committing the font files (public or private repo) is outside the license. So
this folder stays empty on purpose.

How it's wired:
- `app/layout.tsx` — `<link rel="stylesheet" href="https://use.typekit.net/nsl4rke.css">`
  (the Adobe Fonts web project) + a `preconnect`.
- `app/globals.css` — `--font-sans` / `--font-serif` / `--font-mono` all point at
  the `"aktiv-grotesk"` family, so every font utility resolves to it.
- Kit weights: 400 (regular) + 500 (medium), each with italic.

To change weights: edit the web project at fonts.adobe.com (add/remove styles),
then use the matching `font-weight` / `font-style` in the markup. The kit URL
only changes if you create a new project.
