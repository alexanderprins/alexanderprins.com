import type { Metadata } from "next";
import { videos } from "@/lib/videos";
import { Embed } from "@/components/Embed";

export const metadata: Metadata = {
  title: "Video — Alexander Prins",
  description: "Selected video and motion work by Alexander Prins.",
};

// Maps a video's aspect (default portrait, since most selects are vertical
// IG/app content) to the Tailwind aspect utility the Embed wraps in.
const ASPECT: Record<NonNullable<(typeof videos)[number]["aspect"]>, string> = {
  portrait: "aspect-[9/16]",
  landscape: "aspect-video",
  square: "aspect-square",
};

// Video gallery: 3-column grid of large embeds (3x3 for the nine selects),
// 80px gaps, flush to the page margins. Header uses the project-page type
// system (font-serif text-sm h1 + tight text-sm/60 line). Title + credits
// render as chrome below each player — never overlaid.
export default function VideoPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-[90px]">
      <header>
        {/* TODO(Alexander): intro line is a draft placeholder — your voice. */}
        <h1 className="font-serif text-sm font-medium leading-tight text-black">
          Video
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-black/60">
          Selected video and motion work.
        </p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-20 md:grid-cols-3">
        {videos.map((v, i) => (
          <figure key={i}>
            {v.embedUrl ? (
              <Embed
                src={v.embedUrl}
                title={v.title}
                aspectClassName={ASPECT[v.aspect ?? "portrait"]}
              />
            ) : (
              <div className="flex aspect-[9/16] items-center justify-center bg-black/[0.04] p-6 text-center text-sm text-black/60">
                <span>{v.title}</span>
              </div>
            )}
            <figcaption className="mt-3 text-sm leading-relaxed">
              <span className="block text-black">{v.title}</span>
              {v.note?.split(" · ").map((line, j) => (
                <span key={j} className="block text-black/60">
                  {line}
                </span>
              ))}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
