import { getProjectsInOrder, homepageOrder } from "@/lib/projects";
import { positioning } from "@/lib/about";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const projects = getProjectsInOrder(homepageOrder);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      {/* Hero: left-aligned identity block per the design mockup —
          name, role line, then a narrow bio column. */}
      <section className="pt-[90px]">
        <h1 className="font-serif text-sm font-medium text-black">
          Alexander Prins
        </h1>
        <p className="mt-1 text-sm text-black/60">Brand designer</p>
        <p className="mt-6 max-w-[420px] text-sm leading-relaxed text-black/60">
          {positioning}
        </p>
      </section>

      {/* Hero -> project list gap: 64px on mobile, 128px from sm up. */}
      <section className="mt-16 space-y-20 pb-24 sm:mt-32">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>
    </main>
  );
}
