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
