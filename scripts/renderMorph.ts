// Render the Lily wordmark morph to looping video. Run: npx tsx scripts/renderMorph.ts
// Renders transparent letter frames once via resvg, then ffmpeg composites
// them into: solid-bg mp4, solid-bg webm, and a transparent (alpha) webm.
import { interpolate } from "flubber";
import { Resvg } from "@resvg/resvg-js";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { lilyOld, lilyNew } from "../lib/lilyWordmark";
import { morphPhase, morphPeriodMs } from "../lib/morphTiming";

// ---- knobs ---------------------------------------------------------------
const DURATION = 1100; // ms travel each direction (snappy)
const HOLD = 2000; // ms hold on old and on new
const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080; // output resolution
// Framing: a 16:9 window onto the source coords that sits the wordmark at
// ~80% width, centered with even margins (vs. the loose full-source frame).
const FRAME = "243 140 1392 783";
const BG = "#F7F6F7"; // Lily white
const INK = "#1e1e1e"; // site black
const OUT_DIR =
  "/Users/alexanderprins/Documents/projects/alexanderprinsdotcom/projects/Lily Development/Typography Morph/render";
const FRAMES_DIR = `${process.env.CLAUDE_JOB_DIR ?? "/tmp"}/tmp/morph-frames`;
// --------------------------------------------------------------------------

const timing = { duration: DURATION, hold: HOLD };
const period = morphPeriodMs(timing);
const totalFrames = Math.round((period * FPS) / 1000); // seamless: last frame != first

const interps = lilyOld.map((d, i) => interpolate(d, lilyNew[i], { maxSegmentLength: 3 }));

rmSync(FRAMES_DIR, { recursive: true, force: true });
mkdirSync(FRAMES_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

console.log(`Rendering ${totalFrames} frames (${(period / 1000).toFixed(2)}s loop @ ${FPS}fps)…`);
for (let f = 0; f < totalFrames; f++) {
  const t = morphPhase((f / FPS) * 1000, timing);
  const paths = interps.map((fn) => `<path d="${fn(t)}" fill="${INK}"/>`).join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" ` +
    `viewBox="${FRAME}">${paths}</svg>`;
  const png = new Resvg(svg, {
    fitTo: { mode: "original" },
    background: "rgba(0,0,0,0)",
  })
    .render()
    .asPng();
  writeFileSync(`${FRAMES_DIR}/f_${String(f).padStart(4, "0")}.png`, png);
}

const input = ["-framerate", String(FPS), "-i", `${FRAMES_DIR}/f_%04d.png`];
const bgInput = ["-f", "lavfi", "-i", `color=c=${BG}:s=${WIDTH}x${HEIGHT}:r=${FPS}`];
const run = (args: string[]) => execFileSync("ffmpeg", ["-y", ...args], { stdio: "inherit" });

console.log("Encoding solid mp4…");
run([
  ...input, ...bgInput,
  "-filter_complex", "[1:v][0:v]overlay=shortest=1,format=yuv420p[v]",
  "-map", "[v]", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
  `${OUT_DIR}/lily-wordmark-morph.mp4`,
]);

console.log("Encoding solid webm…");
run([
  ...input, ...bgInput,
  "-filter_complex", "[1:v][0:v]overlay=shortest=1[v]",
  "-map", "[v]", "-c:v", "libvpx-vp9", "-crf", "24", "-b:v", "0", "-pix_fmt", "yuv420p",
  `${OUT_DIR}/lily-wordmark-morph.webm`,
]);

console.log("Encoding transparent (alpha) webm…");
run([
  ...input,
  "-c:v", "libvpx-vp9", "-crf", "24", "-b:v", "0", "-pix_fmt", "yuva420p",
  "-auto-alt-ref", "0",
  `${OUT_DIR}/lily-wordmark-morph-alpha.webm`,
]);

console.log("Encoding transparent ProRes 4444 mov…");
run([
  ...input,
  "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
  "-alpha_bits", "16", "-vendor", "apl0",
  `${OUT_DIR}/lily-wordmark-morph-alpha.mov`,
]);

rmSync(FRAMES_DIR, { recursive: true, force: true });
console.log(`\nDone -> ${OUT_DIR}`);
