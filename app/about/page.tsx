import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { bio } from "@/lib/about";

export const metadata: Metadata = { title: "About — Alexander Prins" };

// bio[1] names "Shift Nudge" and "Matt D. Smith"; render those as inline
// links without duplicating the copy (lib/about.ts stays the source of truth).
const inlineLinks: [string, string][] = [
  ["Shift Nudge", "https://shiftnudge.com"],
  ["Matt D. Smith", "https://mds.is"],
];

function withLinks(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;
  for (const [phrase, href] of inlineLinks) {
    const idx = rest.indexOf(phrase);
    if (idx === -1) continue;
    nodes.push(rest.slice(0, idx));
    nodes.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black"
      >
        {phrase}
      </a>,
    );
    rest = rest.slice(idx + phrase.length);
  }
  nodes.push(rest);
  return nodes;
}

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-[90px]">
      <div className="relative mb-8 aspect-square w-80 overflow-hidden bg-black/[0.04]">
        <Image
          src="/headshot.jpg"
          alt="Alexander Prins"
          fill
          sizes="320px"
          className="object-cover"
        />
      </div>
      <h1 className="font-serif text-sm font-medium text-black">Hey there.</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-black/60">
        {bio.map((p, i) => (
          <p key={i}>{i === bio.length - 1 ? withLinks(p) : p}</p>
        ))}
      </div>
    </main>
  );
}
