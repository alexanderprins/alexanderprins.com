import { Embed } from "@/components/Embed";
import type { Video } from "@/lib/videos";

const ASPECT: Record<NonNullable<Video["aspect"]>, string> = {
  portrait: "aspect-[9/16]",
  landscape: "aspect-video",
  square: "aspect-square",
};

// One video slot: a self-hosted file (src) or an embed when either exists, else
// a labeled placeholder box. Self-hosted files load nothing until play (poster only).
// Title + credits render as chrome below the player, never overlaid. Shared by
// the campaign template and the motion app pages (mirrors the /figma helper).
export function VideoFigure({
  video,
  showCaption = true,
}: {
  video: Video;
  showCaption?: boolean;
}) {
  const aspect = ASPECT[video.aspect ?? "portrait"];
  return (
    <figure>
      {video.src ? (
        <video
          src={video.src}
          poster={video.poster}
          controls
          playsInline
          preload="none"
          aria-label={video.title}
          className={`block ${aspect} w-full bg-black object-cover`}
        />
      ) : video.embedUrl ? (
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
