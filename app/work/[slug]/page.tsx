import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/lib/projects";
import { CaseStudyBody } from "@/components/CaseStudyBody";
import { HomeShell } from "@/components/home/HomeShell";
import { homeCaseSlug } from "@/lib/home";

export const dynamicParams = false;

export function generateStaticParams() {
  // Projects with `custom` have their own /work/<slug> page; don't also generate
  // them through this template (route conflict).
  return projects
    .filter((p) => !p.custom)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const cover = p.images.find((i) => i.card === "cover")?.src ?? p.images[0]?.src;
  return {
    title: `${p.title} — Alexander Prins`,
    description: p.subtitle,
    ...(cover ? { openGraph: { images: [cover] } } : {}),
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // featured case studies live in the homepage's side panel: a direct visit
  // renders the homepage with this one open (HomeShell reads the URL)
  if (homeCaseSlug(`/work/${slug}`)) return <HomeShell />;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-[90px]">
      <CaseStudyBody project={project} />
    </main>
  );
}
