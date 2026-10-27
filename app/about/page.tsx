import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { ABOUT, ABOUT_GREETING, ABOUT_HEADSHOT } from "@/lib/about";
import { PdsMorph } from "@/components/home/PdsMorph";

export const metadata: Metadata = {
  title: "About — Alexander Prins",
  openGraph: { images: ["/og/about.jpg"] },
};

// On the homepage's 1416 grid (dark, same header and footer): the copy in
// columns 4-9 (~696px, an easy reading measure), photos and the morph in the
// same column. 24 between paragraphs, 72 around each picture.

// "Shift Nudge" renders as an inline link without duplicating the copy
// (lib/about.ts stays the source of truth).
const inlineLinks: [string, string][] = [["Shift Nudge", "https://shiftnudge.com"]];

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
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-[144px] pt-[120px] text-base leading-6 lg:px-3 lg:pb-[216px] lg:pt-[216px]">
      <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-4">
          {/* headshot: three columns wide on desktop (336 at full width) */}
          <div className="relative aspect-square w-full overflow-hidden bg-black/[0.04] sm:w-1/2">
            <Image src={ABOUT_HEADSHOT.src} alt={ABOUT_HEADSHOT.alt} fill sizes="(min-width: 640px) 336px, 100vw" className="object-cover" priority />
          </div>
          <h1 className="mt-[72px] h-6 text-black">{ABOUT_GREETING}</h1>
          <div className="mt-6 space-y-6 text-black/60">
            {ABOUT.map((b, i) =>
              b.type === "p" ? (
                <p key={i}>{withLinks(b.text)}</p>
              ) : b.type === "image" ? (
                <div key={i} className="!my-[72px]">
                  <Image
                    src={b.src}
                    alt={b.alt}
                    width={b.width}
                    height={b.height}
                    sizes="(min-width: 1024px) 696px, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              ) : (
                <div key={i} className="!my-[72px]">
                  <PdsMorph />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
