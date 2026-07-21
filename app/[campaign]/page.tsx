import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { jobs, getJob } from "@/lib/jobs";
import { getProjectsInOrder } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

// Only job slugs defined in jobs.ts resolve. Any other top-level path 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((j) => ({ campaign: j.slug }));
}

type Props = { params: Promise<{ campaign: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { campaign } = await params;
  const job = getJob(campaign);
  if (!job) return {};
  return {
    title: job.ogTitle ?? `Alexander Prins for ${job.company}`,
    description:
      job.ogDescription ??
      `Portfolio of Alexander Prins, tailored for ${job.company}.`,
  };
}

// Renders intro paragraphs, turning markdown-style [label](/path) into inline
// links (internal). Plain paragraphs (no brackets) render unchanged.
function renderIntro(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link
        key={key++}
        href={m[2]}
        className="underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black"
      >
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default async function CampaignPage({ params }: Props) {
  const { campaign } = await params;
  const job = getJob(campaign);
  if (!job) notFound();

  const projects = getProjectsInOrder(job.projectOrder);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      {/* hero: 90px from nav; eyebrow 32px above H1 */}
      <section className="flex flex-col items-center pt-[90px] text-center">
        <p className="max-w-md text-sm text-black/60">
          For your consideration for the role of {job.role}
        </p>
        <h1 className="mt-5 font-serif text-[56px] font-medium text-black">
          Hi, {job.company} team.
        </h1>
      </section>

      {/* intro: 64px below the hero group; left-aligned, max 600px; 14/24 body */}
      <section className="mt-20">
        <div className="max-w-[600px] space-y-4 text-sm leading-6 text-black/60">
          {job.intro.map((p, i) => (
            <p key={i}>{renderIntro(p)}</p>
          ))}
        </div>
      </section>

      {/* section 1 -> first project: 128px; projects 64px apart */}
      <section className="mt-32 space-y-20 pb-24">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>
    </main>
  );
}
