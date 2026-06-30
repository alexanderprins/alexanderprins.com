import { splitPathString } from "flubber";

// Helpers for turning two exported wordmark SVGs into the `from` / `to`
// contour arrays that <WordmarkMorph> expects. The correspondence step
// (which old contour becomes which new contour) is a spatial heuristic:
// sort both lists left-to-right, then top-to-bottom. For a word with no
// enclosed counters (e.g. "Lily" => L, i-stem, i-dot, l, y) this lines the
// glyph parts up correctly. Inspect the result; if a pair is mismatched,
// hand-reorder the arrays.

/** Pull every `d` attribute out of an SVG string and split each into its
 *  single-contour subpaths. */
export function svgToContours(svg: string): string[] {
  const ds = [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  return ds.flatMap((d) => splitPathString(d));
}

/** Cheap centroid from the raw coordinate numbers in a path `d` string.
 *  Good enough to sort contours by position; not a true area centroid. */
export function contourCenter(d: string): { x: number; y: number } {
  const nums = (d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    sx += nums[i];
    sy += nums[i + 1];
    n++;
  }
  return n ? { x: sx / n, y: sy / n } : { x: 0, y: 0 };
}

/** Sort contours left-to-right then top-to-bottom. `xTolerance` groups
 *  parts that share a column (like an i-stem and its dot) so the secondary
 *  y-sort decides their order. */
export function orderContours(contours: string[], xTolerance = 12): string[] {
  return [...contours].sort((a, b) => {
    const ca = contourCenter(a);
    const cb = contourCenter(b);
    if (Math.abs(ca.x - cb.x) > xTolerance) return ca.x - cb.x;
    return ca.y - cb.y;
  });
}

/** Build paired `from` / `to` arrays from two SVG strings. Throws if the
 *  contour counts differ (the two marks must outline to the same number of
 *  pieces to morph 1:1). */
export function correspondSvgs(
  fromSvg: string,
  toSvg: string,
): { from: string[]; to: string[] } {
  const from = orderContours(svgToContours(fromSvg));
  const to = orderContours(svgToContours(toSvg));
  if (from.length !== to.length) {
    throw new Error(
      `Contour count mismatch: old has ${from.length}, new has ${to.length}. ` +
        `Outline both to the same number of pieces (no enclosed counters / same glyphs).`,
    );
  }
  return { from, to };
}
