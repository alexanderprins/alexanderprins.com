import Link from "next/link";
import { getProjectsInOrder, homepageOrder } from "@/lib/projects";
import { HeroMorph } from "@/components/home/HeroMorph";

export default function Home() {
  const projects = getProjectsInOrder(homepageOrder).map(({ slug, descriptor }) => ({ slug, descriptor }));

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6">
      {/* Hero: identity block + featured titles on the left, Play / Discover /
          Systematize top right, the big morph behind. On lg the morph floats
          behind the text, centered on the page, and the section is tall enough
          to clear it. Hovering a title melts the morph into that project's mark. */}
      <section className="relative pt-[90px] pb-16 lg:h-[1204px] lg:pb-0">
        <h1 className="relative z-10 font-serif text-sm font-medium text-black">
          Alexander Prins
        </h1>
        {/* Mirrors `positioning` in lib/about.ts (kept there as the plain-
            string source of truth for meta use) with an inline proof link. */}
        <p className="relative z-10 mt-1 max-w-[288px] text-sm leading-relaxed text-black/60">
          Translating complexity into simplicity with brand,{" "}
          <Link
            href="/video"
            className="underline decoration-black/30 underline-offset-4 hover:text-black hover:decoration-black"
          >
            motion
          </Link>
          , code and systems.
        </p>
        <HeroMorph projects={projects} />
      </section>
    </main>
  );
}
