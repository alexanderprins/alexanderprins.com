import Link from "next/link";
import type { Project, ProjectImage } from "@/lib/projects";
import { ProjectMeta } from "@/components/ProjectMeta";

// Rich gallery block for index pages. Spacing per Alexander's 4pt spec:
// pill->descriptor 16px, header->image group 32px, image->sidebar 16px,
// cover->thumb strip 16px, thumbs 16px apart, 5 thumbs in the strip.
// Square corners; only the status pill is rounded. Links to /work/[slug].

function Slot({
  img,
  className,
  textSize = "text-xs",
}: {
  img: ProjectImage;
  className: string;
  textSize?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-black/[0.04] p-2 text-center ${textSize} text-black/40 ${className}`}
    >
      {img.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
      ) : (
        <span>{img.alt}</span>
      )}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const [cover, ...rest] = project.images;
  const thumbs = rest.slice(0, 3);
  const href = `/work/${project.slug}`;

  return (
    <article className="group">
      <header className="mb-8">
        {project.status && (
          <span className="inline-block rounded-full border border-black/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-black/50">
            {project.status}
          </span>
        )}
        <Link href={href}>
          <h2 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
            {project.descriptor}
          </h2>
        </Link>
      </header>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 space-y-4">
          {cover && (
            <Link
              href={href}
              className="block overflow-hidden"
              aria-label={`View ${project.title}`}
            >
              <Slot
                img={cover}
                className="aspect-video transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </Link>
          )}
          {thumbs.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {thumbs.map((img, i) => (
                <Link key={i} href={href} className="block overflow-hidden">
                  <Slot img={img} className="aspect-video" textSize="text-[10px]" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className="shrink-0 md:w-fit">
          <ProjectMeta project={project} />
        </aside>
      </div>
    </article>
  );
}
