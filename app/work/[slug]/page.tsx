import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
      className={`flex ${ratio} items-center justify-center bg-black/[0.04] text-center text-sm text-black/60`}
    >
      {img.src ? (
        <Media img={img} className="h-full w-full object-cover" />
      ) : (
        <span className="p-6">{img.alt}</span>
      )}
    </div>
  );
}

function GalleryRow({ row, index }: { row: ProjectImage[]; index: number }) {
  return row.length === 2 ? (
    <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {row.map((img, i) => (
        <GallerySlot key={i} img={img} ratio="aspect-[9/16]" />
      ))}
    </div>
  ) : (
    <GallerySlot
      key={index}
      img={row[0]}
      ratio={row[0].aspect === "portrait" ? "aspect-[9/16]" : "aspect-video"}
    />
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
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-[90px]">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="font-serif text-sm font-medium leading-tight text-black">
            {project.title}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-black/60">
            {project.year ?? project.subtitle}
          </p>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
          >
            Visit live site
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/link_new_tab.svg" alt="" className="h-[18px] w-auto" />
          </a>
        )}
      </header>

      {/* Grouping of five: Skills / Tools / Scope / Role / Impact. */}
      <div className="mt-16">
        <ProjectMeta project={project} orientation="row" />
      </div>

      {/* Client testimonial (when present): its own callout band, set off with
          hairlines, sitting between the writeup and the gallery. */}
      {project.testimonial && (
        <figure className="mt-12 border-y border-black/15 py-6">
          <blockquote className="max-w-[760px] text-sm leading-relaxed text-black">
            &ldquo;{project.testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm text-black/60">
            {project.testimonial.author}, {project.testimonial.title}
          </figcaption>
        </figure>
      )}

      {/* Art gallery: images go big. Landscape images are full-width 16:9;
          consecutive portraits auto-pair into a 2-up row (full 9:16) that
          stacks on mobile. One uniform 24px gap everywhere. Labeled
          placeholders until real assets land. */}
      <div className="mt-12 space-y-6">
        {buildRows(project.images).map((row, r) => (
          <GalleryRow key={r} row={row} index={r} />
        ))}
      </div>
    </main>
  );
}
