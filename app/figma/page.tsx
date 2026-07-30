import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Embed } from "@/components/Embed";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectsInOrder } from "@/lib/projects";
import type { Video } from "@/lib/videos";
import {
  figmaRole,
  figmaIntro,
  figmaIntroVideo,
  figmaLongform,
  figmaCondensed,
  figmaReels,
  figmaProjectOrder,
} from "@/lib/figma";

// Bespoke, video-led application page for Figma's Motion Designer, Product
// Education role. Dedicated route (a static segment, so it cleanly overrides
// the dynamic /[campaign] template for this one slug). Figma is kept OUT of
// lib/jobs.ts on purpose so the two routes never collide.

export const metadata: Metadata = {
  title: "Alexander Prins for Figma",
  description:
    "A motion designer who teaches. Tailored for Figma's Motion Designer, Product Education role — educational motion and video, from a daily Figma user.",
};

const ASPECT: Record<NonNullable<Video["aspect"]>, string> = {
  portrait: "aspect-[9/16]",
  landscape: "aspect-video",
  square: "aspect-square",
};

// Renders markdown-style [label](href) inline: internal paths use <Link>,
// external URLs (http...) open in a new tab. Mirror of the campaign helper.
function renderIntro(text: string): ReactNode[] {
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

// One video slot: real embed when a URL exists, else a labeled placeholder box.
// Title + credits render as chrome below the player, never overlaid.
function VideoFigure({
  video,
  showCaption = true,
}: {
  video: Video;
  showCaption?: boolean;
}) {
  const aspect = ASPECT[video.aspect ?? "portrait"];
  return (
    <figure>
      {video.embedUrl ? (
        <Embed src={video.embedUrl} title={video.title} aspectClassName={aspect} />
      ) : (
        <div
          className={`flex ${aspect} w-full items-center justify-center bg-black/[0.04] p-6 text-center text-sm text-black/40`}
        >
          <span>{video.title}</span>
        </div>
      )}
      {showCaption ? (
        <figcaption className="mt-3 text-sm leading-relaxed">
          <span className="block text-black">{video.title}</span>
          {video.note
            ? video.note.split(" · ").map((line, j) => (
                <span key={j} className="block text-black/60">
                  {line}
                </span>
              ))
            : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Quiet section label, matching the resume/case-study system.
function Label({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-sm text-black/55">{children}</p>;
}

export default function FigmaPage() {
  const projects = getProjectsInOrder(figmaProjectOrder);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24">
      {/* hero: eyebrow + headline, same rhythm as the campaign template */}
      <section className="flex flex-col items-center pt-[90px] text-center">
        <p className="max-w-md text-sm text-black/60">
          For your consideration for the role of
          <br />
          {figmaRole}
        </p>
        <h1 className="mt-5 font-serif text-[56px] font-medium leading-tight text-black">
          Hi, Yvonne (and Figma team).
        </h1>
      </section>

      {/* intro video full-width (the hero once produced), cover letter beneath */}
      <section className="mt-16">
        <VideoFigure video={figmaIntroVideo} showCaption={false} />
        <div className="mt-10 max-w-[720px] space-y-4 text-sm leading-6 text-black/60">
          {/* paragraph 2 (the ShiftNudge one) is relocated beside the tutorial below */}
          {figmaIntro
            .filter((_, i) => i !== 1)
            .map((p, i) => (
              <p key={i}>{renderIntro(p)}</p>
            ))}
        </div>
      </section>

      {/* Selected video work — the core of the pitch for this role */}
      <section className="mt-32">
        <Label>Selected Video Work</Label>

        {/* flagship pairing: tutorial (2/3) + condensed cut (1/3). The relocated
            cover-letter paragraph fills the space under the shorter tutorial. */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <VideoFigure video={figmaLongform} />
            <p className="mt-10 max-w-[680px] text-sm leading-6 text-black/60">
              {renderIntro(figmaIntro[1] ?? "")}
            </p>
          </div>
          <div className="md:col-span-1">
            <VideoFigure video={figmaCondensed} />
          </div>
        </div>

        {/* short-form grid: 6 reels, two rows of three */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {figmaReels.map((v, i) => (
            <VideoFigure key={i} video={v} />
          ))}
        </div>
      </section>

      {/* brand/web range — secondary, below the video pitch */}
      <section className="mt-32">
        <Label>Selected Brand Design Work</Label>
        <div className="space-y-20">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
