import Link from "next/link";
import { getProjectsInOrder, homepageOrder } from "@/lib/projects";
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
        <p className="mt-1 text-sm text-black/60">Brand and Motion Designer</p>
        {/* Mirrors `positioning` in lib/about.ts (kept there as the plain-
            string source of truth for meta use) with inline proof links. */}
        <p className="mt-6 max-w-[420px] text-sm leading-relaxed text-black/60">
          I design brand identities and build their supporting systems,{" "}
          <Link
            href="/video"
            className="underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black"
          >
            motion
          </Link>
          , and websites.
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
