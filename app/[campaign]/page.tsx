import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { jobs, getJob } from "@/lib/jobs";
import { getImageBySrc, getProjectsInOrder, jobHeroOrder } from "@/lib/projects";
import { Media } from "@/components/Media";
import { HeroMorph } from "@/components/home/HeroMorph";
import { ProjectCard } from "@/components/ProjectCard";
import { VideoFigure } from "@/components/VideoFigure";
import { jobSocial } from "@/lib/social";

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
  const title = job.ogTitle ?? `Alexander Prins for ${job.company}`;
  const description =
    job.ogDescription ?? `Portfolio of Alexander Prins, tailored for ${job.company}.`;
  // pages with an intro video share its cover frame as the preview image
  // link preview: prefer the designed cover of a secondary video (Descript's Loom
  // poster is a screen grab), else the intro video's cover
  const image = job.secondaryVideo?.video.poster ?? job.introVideo?.poster;
  return { title, description, ...jobSocial(title, description, image) };
}

// Renders intro paragraphs, turning markdown-style [label](href) into inline
// links. Internal paths (/video) use Next's <Link>; external URLs (http...,
// e.g. [Shift Nudge](https://shiftnudge.com)) render as a plain <a> that opens
// in a new tab. Plain paragraphs (no brackets) render unchanged.
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

export default async function CampaignPage({ params }: Props) {
  const { campaign } = await params;
  const job = getJob(campaign);
  if (!job) notFound();

  const projects = getProjectsInOrder(job.projectOrder);
  const showIntro = job.intro.length > 0 && !job.hideIntro;
  const sectionLabel = "mb-4 font-serif text-base font-medium text-black/60";

  const workSection = projects.length ? (
    <section key="work">
      {job.workLabel ? <h2 className={sectionLabel}>{job.workLabel}</h2> : null}
      <div className="space-y-20">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} coverOnly={job.coverOnly} />
        ))}
      </div>
    </section>
  ) : null;

  const printSection = job.printOrder?.length ? (
    <section key="print">
      <h2 className={sectionLabel}>Print</h2>
      <div className="space-y-20">
        {getProjectsInOrder(job.printOrder).map((p) => (
          <ProjectCard key={p.slug} project={p} coverOnly={job.coverOnly} />
        ))}
      </div>
    </section>
  ) : null;

  const motionSection =
    job.motionReel?.length || job.motionLoops?.length ? (
      <section key="motion">
        <h2 className={sectionLabel}>{job.motionLabel ?? "Motion"}</h2>
        <div className="space-y-4">
          {job.motionReel?.length ? (
            <div className="-mx-6 grid grid-cols-1 gap-4 sm:mx-0 sm:grid-cols-3">
              {job.motionReel.map((img) => (
                <div key={img.src} className="aspect-[9/16] overflow-hidden bg-black/[0.04] sm:p-2">
                  <Media img={img} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
          {job.motionLoops?.length ? (
            <div className="-mx-6 grid grid-cols-1 gap-4 sm:mx-0 sm:grid-cols-2">
              {job.motionLoops.map((src) => {
                const img = getImageBySrc(src);
                return img ? (
                  <div key={src} className="aspect-video overflow-hidden bg-black/[0.04] sm:p-2">
                    <Media img={img} className="h-full w-full object-cover" />
                  </div>
                ) : null;
              })}
            </div>
          ) : null}
        </div>
      </section>
    ) : null;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      {/* hero: 90px from nav; eyebrow 32px above H1 */}
      <section className="flex flex-col items-center pt-[90px] text-center">
        <p className="max-w-md text-base text-black/60">
          For your consideration for the
          <br />
          role of {job.role}
        </p>
        <h1 className="mt-5 font-serif text-[56px] font-medium leading-[1.05] text-black sm:leading-normal">
          {job.greeting ?? `Hi, ${job.company} team.`}
        </h1>
      </section>

      {/* optional intro video (talking-head), full-width above the cover letter */}
      {job.introVideo ? (
        <section className="mt-16">
          <VideoFigure video={job.introVideo} showCaption={false} />
        </section>
      ) : null}

      {job.secondaryVideo ? (
        <section className="mt-16">
          <h2 className="mb-6 text-base text-black/60">{job.secondaryVideo.label}</h2>
          <VideoFigure video={job.secondaryVideo.video} showCaption={false} />
        </section>
      ) : null}

      {job.layout === "hero" ? (
        <>
          {/* the homepage's featured work + morph + PDS (no name/positioning),
              with Patient Pipeline added and an Other Work list (/video, /logos)
              under the titles. Section height mirrors the homepage hero minus its
              90px top pad, so the morph clears the same way. */}
          <section className="relative mt-32 pb-24 lg:h-[1114px] lg:pb-0">
            <HeroMorph
              embedded
              projects={getProjectsInOrder(jobHeroOrder).map(({ slug, descriptor }) => ({ slug, descriptor }))}
              otherWork={[
                { label: "Video/Motion", href: "/video" },
                { label: "Logos", href: "/logos" },
              ]}
            />
          </section>
        </>
      ) : (
        <>
          {/* intro: 64px below the hero group; left-aligned, max 600px */}
          {showIntro ? (
            <section className="mt-20">
              <div className="max-w-[600px] space-y-4 text-base leading-7 text-black/60">
                {job.intro.map((p, i) => (
                  <p key={i}>{renderIntro(p)}</p>
                ))}
              </div>
            </section>
          ) : null}

          {/* work + motion (+ print) sections, 64px apart, in the job's chosen order.
              First section sits 128px under a cover letter, or 64px under the video. */}
          <div className={`${showIntro ? "mt-32" : "mt-16"} space-y-16 ${job.otherWork ? "pb-16" : "pb-24"}`}>
            {job.motionFirst ? [motionSection, workSection] : [workSection, motionSection]}
            {printSection}
          </div>

          {job.otherWork ? (
            <section className="pb-24 text-base text-black/60">
              More work:{" "}
              {job.otherWork.map((w, i) => (
                <span key={w.href}>
                  {i > 0 ? " · " : null}
                  <Link
                    href={w.href}
                    className="underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black"
                  >
                    {w.label}
                  </Link>
                </span>
              ))}
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
