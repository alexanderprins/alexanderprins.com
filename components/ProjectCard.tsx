import Link from "next/link";
import type { Project, ProjectImage } from "@/lib/projects";
import { Media } from "@/components/Media";

// Rich gallery block for index pages. Spacing per Alexander's 4pt spec:
// pill->descriptor 16px, header->image group 32px, image->sidebar 16px,
// cover->thumb strip 16px, thumbs 16px apart, 5 thumbs in the strip.
// Square corners; only the status pill is rounded. Links to /work/[slug].
// Mobile (<sm): images bleed edge-to-edge (-mx-6 cancels the page px-6) with
// no gray inset frame; the p-2 frame is desktop-only.

function Slot({
  img,
  className,
  textSize = "text-sm",
}: {
  img: ProjectImage;
  className: string;
  textSize?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-black/[0.04] p-0 text-center sm:p-2 ${textSize} text-black/60 ${className}`}
    >
      {img.src ? (
        <Media img={img} className="h-full w-full object-cover" />
      ) : (
        <span>{img.alt}</span>
      )}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  // Card selection is decoupled from gallery order. Prefer explicit `card`
  // flags; fall back to the old "first image = cover, next 3 = thumbs" when a
  // project hasn't been flagged yet.
  const cover =
    project.images.find((img) => img.card === "cover") ?? project.images[0];
  const flaggedThumbs = project.images
    .filter((img) => img.card === "thumb")
    .sort((a, b) => (a.cardOrder ?? 0) - (b.cardOrder ?? 0));
  const thumbs = (
    flaggedThumbs.length > 0
      ? flaggedThumbs
      : project.images.filter((img) => img !== cover)
  ).slice(0, 3);
  const href = `/work/${project.slug}`;

  return (
    <article className="group space-y-4">
      {/* descriptor left, status pill right — spans the full card so the pill
          aligns to the far right edge. 16px sits above the image via space-y-4. */}
      <header className="flex items-center justify-between gap-4">
        <Link href={href}>
          <h2 className="font-serif text-sm font-medium text-black">
            {project.descriptor}
          </h2>
        </Link>
        {project.status && (
          <span className="inline-block shrink-0 rounded-full border border-black/20 px-2.5 py-0.5 font-mono text-xs text-black/60">
            {project.status}
          </span>
        )}
      </header>
      {cover && (
        <Link
          href={href}
          className="-mx-6 block overflow-hidden sm:mx-0"
          aria-label={`View ${project.title}`}
        >
          <Slot
            img={cover}
            className="aspect-video transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </Link>
      )}
      {thumbs.length > 0 && (
        <div className="-mx-6 grid grid-cols-3 gap-4 sm:mx-0">
          {thumbs.map((img, i) => (
            <Link key={i} href={href} className="block overflow-hidden">
              <Slot img={img} className="aspect-video" textSize="text-sm" />
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
