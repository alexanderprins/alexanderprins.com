// Simplify the heavy old Lily wordmark paths and re-bake lib/lilyWordmark.ts.
// Old export carries thousands of anchor points; svgo's convertPathData
// reduces precision + merges curves without visibly changing the letterforms
// at display size. mergePaths is disabled so we keep 4 separate contours.
import { optimize } from "svgo";
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "/Users/alexanderprins/Documents/projects/alexanderprinsdotcom/projects/Lily Development/Typography Morph";
const OUT = new URL("../lib/lilyWordmark.ts", import.meta.url);

const svgoCfg = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          mergePaths: false,
          convertShapeToPath: false, // keep the bg <rect> a rect, not a 5th path
          convertPathData: { floatPrecision: 1, transformPrecision: 1 },
          cleanupNumericValues: { floatPrecision: 1 },
        },
      },
    },
  ],
};

const startX = (d) => {
  const m = /^\s*[Mm]\s*(-?\d*\.?\d+)[,\s]+(-?\d*\.?\d+)/.exec(d);
  return m ? parseFloat(m[1]) : 0;
};
const orderedPaths = (svg) => {
  const ds = [...svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return ds.sort((a, b) => startX(a) - startX(b));
};

const rawOld = readFileSync(`${SRC}/lily-old.svg`, "utf8");
const rawNew = readFileSync(`${SRC}/lily-new.svg`, "utf8");

const optOld = optimize(rawOld, svgoCfg).data;
const old = orderedPaths(optOld);
const neu = orderedPaths(rawNew);
if (old.length !== 4 || neu.length !== 4) {
  throw new Error(`Expected 4 contours each, got old=${old.length} new=${neu.length}`);
}

console.log(`old: ${rawOld.length}B -> ${optOld.length}B optimized`);

const arr = (name, xs) =>
  `export const ${name}: string[] = [\n  ${xs.map((x) => JSON.stringify(x)).join(",\n  ")},\n];\n`;

const header =
  "// Real Lily wordmark geometry, baked from the Typography Morph exports.\n" +
  "// 4 contours each (L, I, L, Y), ordered left-to-right so old[i] pairs\n" +
  "// with new[i]. Source canvas 1920x1080; viewBox below frames the letters.\n" +
  "// Old paths simplified via svgo (scripts/simplifyOld.mjs); new left as-is.\n\n" +
  'export const lilyWordmarkViewBox = "350 355 1150 372";\n\n';

writeFileSync(OUT, header + arr("lilyOld", old) + "\n" + arr("lilyNew", neu));
console.log("re-baked", OUT.pathname);
