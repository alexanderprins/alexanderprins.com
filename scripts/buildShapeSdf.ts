// Bake the hero's project shapes (coupe, Lily, Cascata, NV, Patient Pipeline) into one
// signed-distance-field atlas: public/home/shape-sdf.png.
// Run after changing any SVG in scripts/hero-shapes/: npx tsx scripts/buildShapeSdf.ts
// THEN bump the ?v= on ATLAS.src in components/home/morphEngine.ts (cache bust).
//
// What's an SDF? Each pixel stores "how far is the nearest edge of the logo,
// and am I inside or outside it". The hero shader reads that to raymarch the
// logo as a 3D extrusion (or, for the coupe, a revolved solid) and to melt it
// into the sphere / cube / pyramid. Baking it here keeps that work off the
// visitor's machine.
//
// Atlas layout: 3x2 grayscale grid, each cell QUAD px square.
//   top row:    coupe | lily | cascata
//   bottom row: nv    | pp   | (empty)
// Each quadrant spans [-M, M] shape units; the logo's longest side spans [-1, 1].
// Gray 128 = on the edge; each step of 1/255 = 2R/255 units (clamped at +-R).
// Keep M, R and the order in sync with ATLAS in components/home/morphEngine.ts.

import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const QUAD = 512;
const SS = 2; // build at 2x, then average down
const M = 1.2;
const R = 0.12;
const SHAPES = [
  { file: "coupe", mirror: true }, // revolved in 3D, so make the silhouette exactly symmetric
  { file: "lily", mirror: false },
  { file: "cascata", mirror: false },
  { file: "nv", mirror: false },
  { file: "pp", mirror: false }, // Patient Pipeline (job pages only, never the homepage list)
];
const COLS = 3, ROWS = 2;

// ---------- 1D squared-distance transform (Felzenszwalb & Huttenlocher) ----------
const INF = 1e20;
function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}
// distance (px) from each pixel to the nearest pixel where `seed` is true
function edt(seed: Uint8Array, n: number): Float64Array {
  const g = new Float64Array(n * n);
  for (let i = 0; i < n * n; i++) g[i] = seed[i] ? 0 : INF;
  const f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) f[y] = g[y * n + x];
    edt1d(f, n, d, v, z);
    for (let y = 0; y < n; y++) g[y * n + x] = d[y];
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) f[x] = g[y * n + x];
    edt1d(f, n, d, v, z);
    for (let x = 0; x < n; x++) g[y * n + x] = Math.sqrt(d[x]);
  }
  return g;
}

function quadrant(file: string, mirror: boolean): Uint8Array {
  // rasterize big, find the logo's bounding box
  const svg = readFileSync(`scripts/hero-shapes/${file}.svg`, "utf8");
  const img = new Resvg(svg, { fitTo: { mode: "width", value: 2048 } }).render();
  const { width: W, height: H, pixels } = img;
  const ink = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && pixels[(y * W + x) * 4 + 3] > 127;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (ink(x, y)) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
  const cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2;
  const half = Math.max(x1 - x0 + 1, y1 - y0 + 1) / 2; // px per shape unit

  // resample into the quadrant at SSx
  const n = QUAD * SS;
  const inside = new Uint8Array(n * n), outside = new Uint8Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const qx = -M + ((i + 0.5) / n) * 2 * M;
      const qy = M - ((j + 0.5) / n) * 2 * M;
      const sx = Math.floor(cx + qx * half), sy = Math.floor(cy - qy * half);
      const on = ink(sx, sy) || (mirror && ink(Math.floor(cx - qx * half), sy));
      inside[j * n + i] = on ? 1 : 0;
      outside[j * n + i] = on ? 0 : 1;
    }
  const toIn = edt(inside, n), toOut = edt(outside, n);
  const unit = (2 * M) / n; // shape units per px

  const out = new Uint8Array(QUAD * QUAD);
  for (let j = 0; j < QUAD; j++)
    for (let i = 0; i < QUAD; i++) {
      let sum = 0;
      for (let b = 0; b < SS; b++)
        for (let a = 0; a < SS; a++) {
          const k = (j * SS + b) * n + (i * SS + a);
          sum += inside[k] ? -(toOut[k] - 0.5) : toIn[k] - 0.5; // negative inside
        }
      const d = (sum / (SS * SS)) * unit;
      out[j * QUAD + i] = Math.round(Math.min(Math.max(0.5 + d / (2 * R), 0), 1) * 255);
    }
  console.log(`${file}: ${x1 - x0 + 1}x${y1 - y0 + 1}px logo`);
  return out;
}

// ---------- minimal grayscale PNG encoder ----------
const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf: Buffer) => {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(gray: Uint8Array, width: number, height: number) {
  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0; // filter: none
    raw.set(gray.subarray(y * width, (y + 1) * width), y * (width + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // grayscale
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const AW = QUAD * COLS, AH = QUAD * ROWS;
const atlas = new Uint8Array(AW * AH).fill(255); // unused cells read as "far outside", so edge filtering can't bleed ink
SHAPES.forEach(({ file, mirror }, k) => {
  const q = quadrant(file, mirror);
  const ox = (k % COLS) * QUAD, oy = Math.floor(k / COLS) * QUAD;
  for (let j = 0; j < QUAD; j++) atlas.set(q.subarray(j * QUAD, (j + 1) * QUAD), (oy + j) * AW + ox);
});
const file = png(atlas, AW, AH);
writeFileSync("public/home/shape-sdf.png", file);
console.log(`wrote public/home/shape-sdf.png (${(file.length / 1024).toFixed(0)} KB)`);
