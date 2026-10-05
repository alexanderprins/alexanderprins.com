import { HeroMorph } from "@/components/home/HeroMorph";
import { VideoFigure } from "@/components/VideoFigure";
import { getProjectsInOrder, jobHeroOrder } from "@/lib/projects";
import type { MotionApp } from "@/lib/motion";

// Shared layout for the motion application pages (Fieldguide, Baseten):
// intro video -> Featured Work (the motion reels) -> the homepage morph block,
// its list relabeled "Brand Work", with Other Work links. Motion leads; the
// morph closes the page as a live, code-built motion piece of its own.
// The cover letter (app.intro) is intentionally not rendered.

export function MotionAppPage({ app }: { app: MotionApp }) {
  const brandWork = getProjectsInOrder(jobHeroOrder).map(({ slug, descriptor }) => ({
    slug,
    descriptor,
  }));

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      {/* hero: eyebrow + headline, same rhythm as the campaign/figma pages */}
      <section className="flex flex-col items-center pt-[90px] text-center">
        <p className="max-w-md text-sm text-black/60">
          For your consideration for the role of
          <br />
          {app.role}
        </p>
        <h1 className="mt-5 font-serif text-[56px] font-medium leading-tight text-black">
          Hi, {app.company} team.
        </h1>
      </section>

      {/* intro video, full width */}
      <section className="mt-16">
        <VideoFigure video={app.introVideo} showCaption={false} />
      </section>

      {/* featured work: the motion reels */}
      <section className="mt-32">
        <h2 className="mb-6 text-sm text-black/60">Featured Work</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {app.reels.map((v, i) => (
            <VideoFigure key={i} video={v} />
          ))}
        </div>
      </section>

      {/* the morph block as the closer: brand case studies + other work.
          Height mirrors the homepage hero minus its 90px top pad. */}
      <section className="relative mt-32 pb-24 lg:h-[1114px] lg:pb-0">
        <HeroMorph
          embedded
          listLabel="Brand Work"
          projects={brandWork}
          otherWork={[
            { label: "Video/Motion", href: "/video" },
            { label: "Logos", href: "/logos" },
          ]}
        />
      </section>
    </main>
  );
}
