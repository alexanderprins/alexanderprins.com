import type { ProjectImage } from "@/lib/projects";

// A src ending in a video extension renders as an autoplaying, muted,
// looping inline video (no controls, no chrome) — the right treatment for
// short silent brand-motion loops. Everything else renders as an <img>.
// Callers own the wrapper (aspect ratio, bg, placeholder); this only
// renders the media element itself, or null when there's no src.
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

export function isVideoSrc(src?: string): boolean {
  return !!src && VIDEO_RE.test(src);
}

export function Media({
  img,
  className = "",
}: {
  img: ProjectImage;
  className?: string;
}) {
  if (!img.src) return null;

  if (isVideoSrc(img.src)) {
    return (
      <video
        src={img.src}
        poster={img.poster}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        aria-label={img.alt}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={img.src} alt={img.alt} className={className} />;
}
