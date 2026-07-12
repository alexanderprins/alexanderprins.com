// Responsive 16:9 iframe for hosted video (long-form / with-audio work that
// shouldn't be self-hosted per the Build Standards rule). Host-agnostic:
// works with a clean Vimeo player URL
// (https://player.vimeo.com/video/{id}?title=0&byline=0&portrait=0) or a
// Cloudflare Stream /iframe URL. Square corners, no chrome of our own.
export function Embed({
  src,
  title,
  aspectClassName = "aspect-video",
  className = "",
}: {
  src: string;
  title: string;
  aspectClassName?: string; // e.g. "aspect-[9/16]" for vertical video
  className?: string;
}) {
  return (
    <div className={`${aspectClassName} w-full ${className}`}>
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
