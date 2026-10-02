"use client";

// Homepage hero: the big stipple morph, the Play / Discover / Systematize pills
// (top right) and the featured project titles (left).
// - PDS auto-cycles like a carousel (sphere, cube, pyramid); clicking a word takes
//   over and restarts the clock. The active word wears a black pill: ONE element
//   that springs to the active word's spot, so it slides instead of jumping.
// - Hovering (or focusing) a project title interrupts PDS: the shape melts into
//   that project's mark, the pill disappears, and the clock pauses. Leaving the
//   list hands control back to PDS. Clicking a title opens the case study.
// The Three.js lives in morphEngine.ts.
//
// DialKit tunes the morph in dev (the panel is hidden in production builds, where
// the defaults apply; see the note at <DialRoot />). Dialed values persist in
// localStorage; once they feel right, copy them into MORPH_DEFAULTS / HOLD_S.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { DialRoot, useDialKit } from "dialkit";
import "dialkit/styles.css";
import { useCycle } from "@/lib/useCycle";
import { prefersReducedMotion } from "@/lib/stipple";
import { MORPH_DEFAULTS as D, SHAPE, mountMorph, type MorphControls } from "./morphEngine";

export type HeroProject = { slug: string; descriptor: string };

const PDS = [
  { word: "Play", shape: SHAPE.sphere, icon: <circle cx="4.5" cy="4.5" r="4.5" /> },
  { word: "Discover", shape: SHAPE.cube, icon: <rect x="0.5" y="0.5" width="8" height="8" /> },
  { word: "Systematize", shape: SHAPE.pyramid, icon: <polygon points="4.5,0.5 9,8.5 0,8.5" /> },
];
// project slug -> the mark it melts into
const MARKS: Record<string, number> = {
  "hello-marjorie": SHAPE.coupe,
  "lily-development": SHAPE.lily,
  "cascata-group": SHAPE.cascata,
  "northern-vessel": SHAPE.nv,
};
const HOLD_S = 5;
const LEAVE_MS = 120; // grace period so the gaps between titles don't flick back to PDS
const PILL = { default: { type: "spring", visualDuration: 0.45, bounce: 0.15 }, opacity: { duration: 0.25 } } as const;
type Box = { x: number; y: number; width: number; height: number };

export function HeroMorph({ projects }: { projects: HeroProject[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const morph = useRef<MorphControls | null>(null);
  const leave = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [reduced, setReduced] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pdsList = useRef<HTMLUListElement>(null);
  const pdsBtns = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<Box | null>(null);

  const dial = useDialKit(
    "Hero morph",
    {
      stipple: {
        grain: [D.grain, 0.5, 4, 0.05],
        boilFps: [D.boilFps, 0, 30, 1],
        tone: [D.tone, 0.4, 2.5, 0.05],
        contrast: [D.contrast, 1, 4, 0.05],
        falloff: [D.falloff, 0, 0.6, 0.01],
        quality: [D.quality, 0.25, 1, 0.05],
      },
      shape: {
        size: [D.size, 0.6, 1.4, 0.01],
        sharpness: [D.sharpness, 12, 80, 1],
        pyramidTilt: [D.pyramidTilt, -10, 35, 1],
      },
      motion: {
        spin: [D.spin, 0, 4, 0.05],
        hold: [HOLD_S, 1, 12, 0.5],
        melt: [D.melt, 0.3, 4, 0.05],
        wobble: [D.wobble, 0, 1.5, 0.01],
        twist: [D.twist, 0, 3, 0.05],
      },
      marks: {
        logoSize: [D.logoSize, 0.6, 1.5, 0.01],
        logoDepth: [D.logoDepth, 0.02, 0.6, 0.01],
        logoBevel: [D.logoBevel, 0, 0.08, 0.002],
        logoTilt: [D.logoTilt, -30, 30, 1],
        logoTurn: [D.logoTurn, 0, 60, 1],
        logoSway: [D.logoSway, 0, 0.5, 0.01],
        markSpin: [D.markSpin, 0, 180, 1],
        coupePour: [D.coupePour, -90, 90, 1],
      },
    },
    { id: "home-hero-morph", persist: true },
  );
  const [active, select] = useCycle(PDS.length, dial.motion.hold * 1000, reduced || hovered !== null);

  useEffect(() => {
    if (!stage.current) return;
    const rm = prefersReducedMotion();
    setReduced(rm);
    morph.current = mountMorph(stage.current, { reducedMotion: rm });
    return () => {
      clearTimeout(leave.current);
      morph.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // `hold` rides along unused; useCycle reads it
    morph.current?.setParams({ ...dial.stipple, ...dial.shape, ...dial.motion, ...dial.marks });
  }, [dial]);

  // measure the active word so the pill can spring there (re-measure on resize:
  // the list is a row on mobile, a column on lg)
  useLayoutEffect(() => {
    const measure = () => {
      const b = pdsBtns.current[active];
      if (b) setPill({ x: b.offsetLeft, y: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (pdsList.current) ro.observe(pdsList.current);
    return () => ro.disconnect();
  }, [active]);

  const mark = hovered ? MARKS[hovered] : undefined;
  useEffect(() => morph.current?.setShape(mark ?? PDS[active].shape), [active, mark]);

  const enter = (slug: string) => {
    clearTimeout(leave.current);
    setHovered(slug);
  };
  const exit = () => {
    clearTimeout(leave.current);
    leave.current = setTimeout(() => setHovered(null), LEAVE_MS);
  };

  return (
    <>
      <div className="relative z-10 mt-14 w-fit">
        <p className="text-sm text-black/60">Featured Work</p>
        <ul className="mt-2 space-y-0.5 text-sm" onMouseLeave={exit} onBlur={exit}>
          {projects.map((p) => {
            const on = p.slug === hovered;
            return (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => enter(p.slug)}
                  onFocus={() => enter(p.slug)}
                  className={`inline-flex items-center transition-colors duration-300 ${
                    on ? "text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-out ${
                      on ? "w-6" : "w-0"
                    }`}
                  >
                    →
                  </span>
                  {p.descriptor}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* mobile: a row under the titles. lg: top right, level with the name. */}
      <ul ref={pdsList} className="relative z-10 mt-10 flex flex-wrap gap-1 text-sm lg:absolute lg:right-0 lg:top-[90px] lg:mt-0 lg:w-[216px] lg:flex-col lg:gap-0">
        {pill && (
          <motion.li
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-black"
            initial={{ ...pill, opacity: 0 }}
            animate={{ ...pill, opacity: hovered === null ? 1 : 0 }}
            transition={PILL}
          />
        )}
        {PDS.map((p, i) => {
          const on = i === active && hovered === null;
          return (
            <li key={p.word}>
              <button
                ref={(el) => {
                  pdsBtns.current[i] = el;
                }}
                type="button"
                aria-pressed={on}
                onClick={() => select(i)}
                className={`relative flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1 transition-colors duration-300 ${
                  on ? "text-white" : "text-black/60 hover:text-black"
                }`}
              >
                <svg className="relative" width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true">
                  {p.icon}
                </svg>
                <span className="relative">{p.word}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* mobile: in flow, square. lg: floats behind the text, centered on the page.
          The canvas inside overscans this box vertically (see morphEngine.ts). */}
      <div
        ref={stage}
        aria-hidden="true"
        className="pointer-events-none relative mt-8 aspect-square w-full lg:absolute lg:inset-x-0 lg:top-[179px] lg:mt-0 lg:aspect-auto lg:h-[880px]"
      />
      {/* Pass the flag ourselves: DialKit's own check reads process?.env?.NODE_ENV,
          which Next can't inline in the browser, so it would show in production. */}
      <DialRoot position="bottom-right" productionEnabled={process.env.NODE_ENV !== "production"} />
    </>
  );
}
