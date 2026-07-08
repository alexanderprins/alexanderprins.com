"use client";

import { useEffect, useMemo, useRef } from "react";
import { interpolate } from "flubber";
import { morphPhase, morphPeriodMs, labelOpacities } from "@/lib/morphTiming";

// Morphs one set of vector outlines into another by tweening the geometry
// itself (the thing Figma Smart Animate can't do across differently-shaped
// outlines). `from` and `to` are arrays of SINGLE-contour path `d` strings,
// paired by index: from[i] morphs into to[i]. Split a multi-contour glyph
// (e.g. a dotted "i") into separate entries and pair the stem with the stem,
// the dot with the dot. See lib/morph.ts for turning exported SVGs into this.
type Props = {
  from: string[];
  to: string[];
  viewBox: string;
  className?: string;
  fill?: string;
  /** ms for one direction of travel (old -> new). */
  duration?: number;
  /** ms to hold at each end before reversing. */
  hold?: number;
  /** true = ping-pong old<->new forever; false = play old->new once and stay. */
  loop?: boolean;
  /** Label that fades in over the OLD mark (e.g. "Before"). */
  beforeLabel?: string;
  /** Label that fades in over the NEW mark (e.g. "After"). */
  afterLabel?: string;
};

export function WordmarkMorph({
  from,
  to,
  viewBox,
  className,
  fill = "currentColor",
  duration = 1100,
  hold = 2000,
  loop = true,
  beforeLabel,
  afterLabel,
}: Props) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const beforeRef = useRef<HTMLSpanElement | null>(null);
  const afterRef = useRef<HTMLSpanElement | null>(null);

  // Build one interpolator per contour. flubber handles differing point
  // counts (it resamples + rotates for least travel), so two similar serif
  // outlines morph cleanly even though their anchor points don't match.
  const interps = useMemo(
    () =>
      from.map((d, i) =>
        interpolate(d, to[i] ?? d, { maxSegmentLength: 2 }),
      ),
    [from, to],
  );

  useEffect(() => {
    const paths = pathRefs.current;
    const apply = (t: number) => {
      interps.forEach((fn, i) => paths[i]?.setAttribute("d", fn(t)));
      const { before, after } = labelOpacities(t);
      if (beforeRef.current) beforeRef.current.style.opacity = String(before);
      if (afterRef.current) afterRef.current.style.opacity = String(after);
    };

    // Respect reduced-motion: settle on the new mark, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    const svg = paths[0]?.ownerSVGElement ?? null;
    const timing = { duration, hold };
    const period = morphPeriodMs(timing);
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const abs = now - start;

      // Non-loop: settle on the new mark once the first travel completes.
      if (!loop && abs >= hold + duration) {
        apply(1);
        raf = 0;
        return;
      }

      apply(morphPhase(loop ? abs % period : abs, timing));
      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      if (!raf) {
        start = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Only burn frames while the mark is on screen.
    let io: IntersectionObserver | null = null;
    if (svg && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : stop()),
        { threshold: 0.1 },
      );
      io.observe(svg);
    } else {
      play();
    }

    return () => {
      stop();
      io?.disconnect();
    };
  }, [interps, duration, hold, loop]);

  const svg = (
    <svg
      viewBox={viewBox}
      className={className}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {from.map((d, i) => (
        <path
          key={i}
          ref={(el) => {
            pathRefs.current[i] = el;
          }}
          d={d}
        />
      ))}
    </svg>
  );

  if (!beforeLabel && !afterLabel) return svg;

  // Before/After labels sit above and below the mark, cross-fading with the
  // morph. Always in the DOM (opacity-only) so the layout never shifts.
  const labelClass =
    "text-sm font-medium uppercase tracking-[0.12em] text-black";
  return (
    <div className="flex flex-col items-center">
      {beforeLabel && (
        <span ref={beforeRef} className={`mb-8 ${labelClass}`} style={{ opacity: 1 }}>
          {beforeLabel}
        </span>
      )}
      {svg}
      {afterLabel && (
        <span ref={afterRef} className={`mt-8 ${labelClass}`} style={{ opacity: 0 }}>
          {afterLabel}
        </span>
      )}
    </div>
  );
}
