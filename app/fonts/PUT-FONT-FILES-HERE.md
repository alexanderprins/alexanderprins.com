# Drop PP Editorial New font files in this folder

Put the web font files here (woff2 preferred; otf/ttf also fine), e.g.:

- PPEditorialNew-Regular.woff2
- PPEditorialNew-Italic.woff2
- PPEditorialNew-Ultralight.woff2 (if used)

Then tell Claude which weights you added. Claude wires them via
`next/font/local` in `app/layout.tsx`, exposing `--font-pp-editorial`, which
`--font-serif` (in globals.css) already points to. No other change needed.

License note: confirm your Pangram Pangram license covers WEBFONT embedding on
a public site, not just desktop use, before deploying.
