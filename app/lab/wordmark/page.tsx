import { WordmarkMorph } from "@/components/WordmarkMorph";
import { lilyOld, lilyNew, lilyWordmarkViewBox } from "@/lib/lilyWordmark";

// LAB PREVIEW — real Lily wordmark morph (old serif -> refined serif).
// Tuning the loop here before it moves into the case study.

export default function WordmarkLabPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 py-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
        Lab preview
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">
        Lily wordmark, refined
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-black/70">
        The old wordmark settling into the new one. Thicker thins, lower
        contrast, a touch more weight, sturdier feet, while keeping the serif
        character. The outline points are tweened continuously, so you read the
        change as motion rather than a cross-fade.
      </p>

      <figure className="mt-12">
        <WordmarkMorph
          from={lilyOld}
          to={lilyNew}
          viewBox={lilyWordmarkViewBox}
          className="w-full max-w-3xl text-black"
          duration={1600}
          hold={1100}
        />
        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
          Looping old &harr; new
        </figcaption>
      </figure>

      <div className="mt-16 grid max-w-3xl gap-10 sm:grid-cols-2">
        <figure className="flex flex-col gap-3">
          <svg
            viewBox={lilyWordmarkViewBox}
            className="w-full text-black/30"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {lilyOld.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
          <figcaption className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
            Old (static)
          </figcaption>
        </figure>
        <figure className="flex flex-col gap-3">
          <svg
            viewBox={lilyWordmarkViewBox}
            className="w-full text-black"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {lilyNew.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
          <figcaption className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/40">
            New (static)
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
