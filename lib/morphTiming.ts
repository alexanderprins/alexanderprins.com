// Shared morph timing so the on-site loop (WordmarkMorph) and the rendered
// video (scripts/renderMorph.ts) stay identical. Snappy but refined: a
// quart ease-in-out, no overshoot/bounce.

export const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

export type MorphTiming = {
  /** ms of travel in one direction (old -> new). */
  duration: number;
  /** ms held at each end. */
  hold: number;
};

/** One seamless cycle, starting on the OLD hold so the loop point is clean:
 *  hold old -> morph to new -> hold new -> morph back to old. Returns the
 *  eased parameter t in [0,1] (0 = old, 1 = new) for an elapsed time. */
export function morphPhase(elapsedMs: number, { duration, hold }: MorphTiming): number {
  const period = 2 * hold + 2 * duration;
  const e = ((elapsedMs % period) + period) % period;

  if (e < hold) return 0; // hold old
  if (e < hold + duration) return easeInOutQuart((e - hold) / duration); // old -> new
  if (e < 2 * hold + duration) return 1; // hold new
  return easeInOutQuart(1 - (e - 2 * hold - duration) / duration); // new -> old
}

export const morphPeriodMs = ({ duration, hold }: MorphTiming): number =>
  2 * hold + 2 * duration;

/** Fade opacities for the Before/After labels, keyed off the eased morph
 *  parameter t (0 = old mark, 1 = new mark). "Before" holds full on the old
 *  end and fades out by the time the letters are mid-travel; "After" stays
 *  hidden until past the midpoint, then fades up on the new end. The gap in
 *  the middle keeps both labels clear of the busiest part of the morph. */
export function labelOpacities(t: number): { before: number; after: number } {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  return {
    before: clamp((0.45 - t) / 0.45),
    after: clamp((t - 0.55) / 0.45),
  };
}
