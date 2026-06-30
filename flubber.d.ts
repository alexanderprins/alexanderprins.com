// Minimal type declarations for flubber (ships no types).
// Covers only what this project uses.
declare module "flubber" {
  type Interpolator = (t: number) => string;
  interface Options {
    maxSegmentLength?: number;
    string?: boolean;
  }
  export function interpolate(
    fromShape: string | number[][],
    toShape: string | number[][],
    options?: Options,
  ): Interpolator;
  export function interpolateAll(
    fromList: (string | number[][])[],
    toList: (string | number[][])[],
    options?: Options & { single?: boolean; match?: boolean },
  ): Interpolator[];
  export function splitPathString(d: string): string[];
  export function toPathString(ring: number[][]): string;
  export function separate(
    fromShape: string | number[][],
    toShapes: (string | number[][])[],
    options?: Options,
  ): Interpolator;
  export function combine(
    fromShapes: (string | number[][])[],
    toShape: string | number[][],
    options?: Options,
  ): Interpolator;
}
