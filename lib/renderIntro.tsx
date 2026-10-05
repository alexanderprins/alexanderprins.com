import Link from "next/link";
import type { ReactNode } from "react";

// Renders intro paragraphs, turning markdown-style [label](href) into inline
// links. Internal paths (/video) use Next's <Link>; external URLs (http...)
// render as a plain <a> that opens in a new tab. Plain text renders unchanged.
// Shared by the campaign template, the /figma page, and the motion app pages.
export function renderIntro(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkClass =
    "underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black";
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    const external = /^https?:\/\//.test(href);
    parts.push(
      external ? (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {label}
        </a>
      ) : (
        <Link key={key++} href={href} className={linkClass}>
          {label}
        </Link>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
