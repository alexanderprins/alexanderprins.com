import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { projects, getProject } from "@/lib/projects";
import type { ProjectImage } from "@/lib/projects";
import { ProjectMeta } from "@/components/ProjectMeta";
import { Media } from "@/components/Media";

export const dynamicParams = false;

// Group images into gallery rows: a landscape image is its own full-width row;
// two consecutive portraits share a 2-up row (full 9:16, side by side). A lone
// portrait falls back to a single 9:16 row.
function buildRows(images: ProjectImage[]): ProjectImage[][] {
  const rows: ProjectImage[][] = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const next = images[i + 1];
    if (img.aspect === "portrait" && next?.aspect === "portrait") {
      rows.push([img, next]);
      i++;
    } else {
      rows.push([img]);
    }
  }
  return rows;
}

function GallerySlot({ img, ratio }: { img: ProjectImage; ratio: string }) {
  return (
    <div
      className={`flex ${ratio} items-center justify-center bg-black/[0.04] text-center text-sm text-black/40`}
    >
      {img.src ? (
        <Media img={img} className="h-full w-full object-cover" />
      ) : (
        <span className="p-6">{img.alt}</span>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} — Alexander Prins`, description: p.subtitle };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-2">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40 hover:text-black"
      >
        All work
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
          {project.title}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          {project.descriptor}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-black/70">
          {project.subtitle}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
        <ProjectMeta project={project} />
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] underline underline-offset-4"
          >
            Visit live site
          </a>
        )}
      </div>

      {/* Art gallery: images go big. Landscape images are full-width 16:9;
          consecutive portraits auto-pair into a 2-up row (full 9:16) that
          stacks on mobile. One uniform 24px gap everywhere. Labeled
          placeholders until real assets land. */}
      <div className="mt-12 space-y-6">
        {buildRows(project.images).map((row, r) =>
          row.length === 2 ? (
            <div key={r} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {row.map((img, i) => (
                <GallerySlot key={i} img={img} ratio="aspect-[9/16]" />
              ))}
            </div>
          ) : (
            <GallerySlot
              key={r}
              img={row[0]}
              ratio={
                row[0].aspect === "portrait" ? "aspect-[9/16]" : "aspect-video"
              }
            />
          ),
        )}
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-6 text-[15px] leading-relaxed text-black/80">
        <p>{project.description}</p>
        <div>
          <h2 className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
            Role
          </h2>
          <p>{project.role}</p>
        </div>
        <div>
          <h2 className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
            Impact
          </h2>
          <p>{project.impact}</p>
        </div>
        {project.testimonial && (
          <blockquote className="border-l-2 border-black/20 pl-4 text-black/70">
            <p className="font-serif text-lg italic leading-snug">
              {project.testimonial.quote}
            </p>
            <footer className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-black/45">
              {project.testimonial.author}, {project.testimonial.title}
            </footer>
          </blockquote>
        )}
      </div>
    </main>
  );
}
