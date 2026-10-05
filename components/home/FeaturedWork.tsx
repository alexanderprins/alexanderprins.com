"use client";

// Homepage featured work: the covers, auto-cycling every 10s, with the active
// project's title on the left. (The full title list lives in the hero, where
// hovering a title melts the morph into that project's mark.) The cover
// disintegrates into stipple dust and the next one condenses out of it
// (stippleSwap.ts), a nod to the hero morph. DialKit tunes it in dev; the panel
// lives in HeroMorph's <DialRoot />. Copy dialed values into SWAP_DEFAULTS / HOLD_S.
// A plain <img> of the active cover sits underneath as the no-WebGL fallback.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDialKit } from "dialkit";
import { Media } from "@/components/Media";
import type { ProjectImage } from "@/lib/projects";
import { useCycle } from "@/lib/useCycle";
import { prefersReducedMotion } from "@/lib/stipple";
import { SWAP_DEFAULTS as D, mountSwap, type SwapControls } from "./stippleSwap";

export type FeaturedItem = { slug: string; descriptor: string; cover: ProjectImage };

const HOLD_S = 10;

export function FeaturedWork({ items }: { items: FeaturedItem[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const swap = useRef<SwapControls | null>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const dial = useDialKit(
    "Featured swap",
    {
      replay: { type: "action", label: "Replay transition" },
      timing: {
        hold: [HOLD_S, 2, 20, 0.5],
        duration: [D.duration, 0.3, 4, 0.05],
        boilFps: [D.boilFps, 0, 30, 1],
      },
      dots: {
        grain: [D.grain, 0.5, 4, 0.05],
        gap: [D.gap, 0, 1, 0.01],
        gapColor: { type: "select", options: ["paper", "ink"], default: D.gapColor },
        lumaBias: [D.lumaBias, -1, 1, 0.01],
        drift: [D.drift, 0, 0.2, 0.005],
      },
      origin: {
        mode: { type: "select", options: ["point", "sweep"], default: D.mode },
        originX: [D.originX, 0, 1, 0.01],
        originY: [D.originY, 0, 1, 0.01],
        angle: [D.angle, -180, 180, 1],
      },
      front: {
        band: [D.band, 0.01, 0.6, 0.01],
        edgeNoise: [D.edgeNoise, 0, 1, 0.01],
        noiseScale: [D.noiseScale, 0.5, 12, 0.1],
        jitter: [D.jitter, 0, 1, 0.01],
      },
    },
    { id: "home-featured-swap", persist: true, onAction: () => swap.current?.replay() },
  );
  const [active] = useCycle(items.length, dial.timing.hold * 1000, reduced);

  useEffect(() => {
    if (!frame.current) return;
    const rm = prefersReducedMotion();
    setReduced(rm);
    swap.current = mountSwap(frame.current, items.map((it) => it.cover.src ?? ""), {
      reducedMotion: rm,
      onReady: () => setReady(true),
    });
    return () => swap.current?.dispose();
  }, [items]);

  useEffect(() => {
    swap.current?.setParams({
      ...dial.timing, // `hold` rides along unused; useCycle reads it
      ...dial.dots,
      ...dial.origin,
      ...dial.front,
      gapColor: dial.dots.gapColor as "paper" | "ink",
      mode: dial.origin.mode as "point" | "sweep",
    });
  }, [dial]);

  useEffect(() => swap.current?.show(active), [active]);

  const current = items[active];

  return (
    <section className="pb-24 lg:grid lg:grid-cols-2">
      <div>
        <p className="text-sm text-black/60">Featured Work</p>
        <Link href={`/work/${current.slug}`} className="mt-3 block text-sm text-black hover:underline">
          {current.descriptor}
        </Link>
      </div>

      <Link
        href={`/work/${current.slug}`}
        aria-label={current.descriptor}
        className="relative mt-6 block aspect-video w-full overflow-hidden bg-black/[0.04] lg:mt-0"
      >
        <Media img={current.cover} className="absolute inset-0 h-full w-full object-cover" />
        <div
          ref={frame}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      </Link>
    </section>
  );
}
