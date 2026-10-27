"use client";

// The Play / Discover / Systematize morph on its own (About page): the stipple
// shape melts sphere -> cube -> pyramid on a clock, and clicking a word takes
// over and restarts it. The active word wears one pill that springs between
// words (same as the old homepage hero, HeroMorph.tsx). White ink on the dark
// page; the defaults from morphEngine (no DialKit here). The Three.js lives in
// morphEngine.ts.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useCycle } from "@/lib/useCycle";
import { prefersReducedMotion } from "@/lib/stipple";
import { SHAPE, mountMorph, type MorphControls } from "./morphEngine";

const PDS = [
  { word: "Play", shape: SHAPE.sphere, icon: <circle cx="4.5" cy="4.5" r="4.5" /> },
  { word: "Discover", shape: SHAPE.cube, icon: <rect x="0.5" y="0.5" width="8" height="8" /> },
  { word: "Systematize", shape: SHAPE.pyramid, icon: <polygon points="4.5,0.5 9,8.5 0,8.5" /> },
];
const HOLD_MS = 5000;
const PILL = { default: { type: "spring", visualDuration: 0.45, bounce: 0.15 }, opacity: { duration: 0.25 } } as const;
type Box = { x: number; y: number; width: number; height: number };

export function PdsMorph({ ink = "#ffffff", paper = "#111111" }: { ink?: string; paper?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const morph = useRef<MorphControls | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);
  const [pill, setPill] = useState<Box | null>(null);
  const [active, select] = useCycle(PDS.length, HOLD_MS, reduced);

  useEffect(() => {
    if (!stage.current) return;
    const rm = prefersReducedMotion();
    setReduced(rm);
    morph.current = mountMorph(stage.current, { reducedMotion: rm, ink, paper });
    // Full-res lighting pass. The engine's default (0.6) raymarches the light at
    // 60% of screen resolution, tuned for the old full-width hero; the dots are
    // full-res but the silhouette they follow came from that coarser image, so
    // curved edges (the sphere) stair-stepped. This box is ~1/3 of the hero's
    // area, so 1.0 here costs about what the hero did at 0.6.
    morph.current.setParams({ quality: 1 });
    return () => morph.current?.dispose();
  }, [ink, paper]);

  useEffect(() => morph.current?.setShape(PDS[active].shape), [active]);

  useLayoutEffect(() => {
    const measure = () => {
      const b = btns.current[active];
      if (b) setPill({ x: b.offsetLeft, y: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [active]);

  return (
    <div>
      <ul ref={list} className="relative flex flex-wrap gap-1 text-base leading-6">
        {pill && (
          <motion.li
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-black"
            initial={{ ...pill, opacity: 0 }}
            animate={{ ...pill, opacity: 1 }}
            transition={PILL}
          />
        )}
        {PDS.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.word}>
              <button
                ref={(el) => {
                  btns.current[i] = el;
                }}
                type="button"
                aria-pressed={on}
                onClick={() => select(i)}
                className={`relative flex cursor-pointer items-center gap-2 rounded-full px-2.5 transition-colors duration-300 ${
                  on ? "text-[var(--background)]" : "text-black/60 hover:text-black"
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
      {/* the canvas overscans its box vertically (see morphEngine.ts); clipped here
          so the dots never run into the copy above or below */}
      <div className="mt-6 overflow-hidden">
        <div ref={stage} aria-hidden="true" className="pointer-events-none relative aspect-square w-full" />
      </div>
    </div>
  );
}
