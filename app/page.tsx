import { getProjectsInOrder, homepageOrder } from "@/lib/projects";
import { positioning } from "@/lib/about";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const projects = getProjectsInOrder(homepageOrder);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      <section className="flex flex-col items-center pt-[90px] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
          Brand designer who ships in code
        </p>
        <h1 className="mt-8 font-serif text-5xl tracking-tight sm:text-6xl">
          Alexander Prins
        </h1>
        <p className="mt-5 max-w-xl text-black/60">{positioning}</p>
      </section>

      <section className="mt-32 space-y-20 pb-24">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>
    </main>
  );
}
