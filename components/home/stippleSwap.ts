// Featured-work image swap: the old cover disintegrates into stipple dust and the
// new one condenses out of it. No black-and-white band in between; every dot
// keeps the color of the image it came from. Plain Three.js; FeaturedWork.tsx mounts it.
//
// Each grain cell gets a "turn": its distance from the origin (a point, or a line
// sweeping at an angle), roughened by noise and per-cell jitter. A front moves
// through those turns. Near the front a cell flips at random between old dot,
// empty (the gap), and new dot, with odds set by how far the front has passed it.
// Dissolving dots also drift away from the origin; arriving dots drift in.
//
// Assumes every cover is 16:9, same as the frame (true for all current covers).
// Renders only while a swap is running; otherwise the canvas holds its last frame.

import * as THREE from "three";
import { HASH, INK, NOISE, PAPER } from "@/lib/stipple";

export type SwapParams = {
  duration: number; // seconds
  grain: number; // dot size, CSS px (floored at 1 device px)
  boilFps: number; // dot reshuffles per second during a swap, 0 = frozen
  mode: "point" | "sweep"; // radiate from (originX, originY), or sweep across at `angle`
  originX: number; // 0 left .. 1 right
  originY: number; // 0 top .. 1 bottom
  angle: number; // sweep direction, degrees (0 = left to right, 90 = top to bottom)
  band: number; // width of the dissolving front (soft = wide)
  edgeNoise: number; // how ragged the front is
  noiseScale: number; // size of the ragged blobs (higher = smaller blobs)
  jitter: number; // per-dot randomness in when it goes
  gap: number; // 0 = straight dot crossfade, 1 = old fully gone before new arrives
  gapColor: "paper" | "ink";
  lumaBias: number; // dark old dots linger, dark new dots land first (negative flips it)
  drift: number; // how far dots travel as they leave/arrive (fraction of width)
};

export const SWAP_DEFAULTS: SwapParams = {
  duration: 1.6,
  grain: 1,
  boilFps: 12,
  mode: "point",
  originX: 0,
  originY: 1,
  angle: 0,
  band: 0.18,
  edgeNoise: 0.35,
  noiseScale: 3,
  jitter: 0.25,
  gap: 0.35,
  gapColor: "paper",
  lumaBias: 0.3,
  drift: 0.03,
};

export type SwapControls = {
  show: (i: number) => void;
  replay: () => void;
  setParams: (p: Partial<SwapParams>) => void;
  dispose: () => void;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const FRAG = HASH + NOISE + /* glsl */ `
  uniform sampler2D uFrom, uTo; uniform vec3 uGapColor; uniform vec2 uRes, uOrigin, uDir;
  uniform float uT, uGrain, uSeed, uSweep, uBand, uEdge, uNoiseScale, uJitter, uGap, uLuma, uDrift;
  varying vec2 vUv;
  float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  void main() {
    // everything is per grain cell, so each dot is one solid color
    vec2 cell = floor(gl_FragCoord.xy / uGrain);
    vec2 uv = (cell + 0.5) * uGrain / uRes;
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y), o = vec2(uOrigin.x * aspect, uOrigin.y);

    // 0..1 distance from where the dissolve starts
    float d; vec2 away;
    if (uSweep > 0.5) {
      vec2 c0 = vec2(0.0), c1 = vec2(aspect, 0.0), c2 = vec2(0.0, 1.0), c3 = vec2(aspect, 1.0);
      float lo = min(min(dot(c0, uDir), dot(c1, uDir)), min(dot(c2, uDir), dot(c3, uDir)));
      float hi = max(max(dot(c0, uDir), dot(c1, uDir)), max(dot(c2, uDir), dot(c3, uDir)));
      d = (dot(p, uDir) - lo) / (hi - lo);
      away = uDir;
    } else {
      float far = max(max(length(o), length(o - vec2(aspect, 0.0))), max(length(o - vec2(0.0, 1.0)), length(o - vec2(aspect, 1.0))));
      d = length(p - o) / far;
      away = normalize(p - o + 1e-5);
    }
    float s = d + uEdge * 0.5 * snoise(vec3(uv * vec2(aspect, 1.0) * uNoiseScale, 4.0))
                + uJitter * (hash(cell) - 0.5);
    float sMin = -0.5 * (uEdge + uJitter), sMax = 1.0 + 0.5 * (uEdge + uJitter);
    float front = mix(sMin - uBand, sMax + uBand, uT);
    float q = smoothstep(s - uBand, s + uBand, front);   // 0 = untouched old, 1 = settled new

    // old dots leave over [0, 1 - gap/2], new dots arrive over [gap/2, 1]
    float h = 0.5 * uGap;
    float qOld = clamp(q / (1.0 - h), 0.0, 1.0);
    float qNew = clamp((q - h) / (1.0 - h), 0.0, 1.0);

    // dust drifts outward on the way out, inward on the way in
    vec2 wob = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
    vec2 dirUv = vec2(away.x / aspect, away.y);
    vec3 a = texture2D(uFrom, uv + (dirUv + wob) * uDrift * qOld * qOld).rgb;
    vec3 b = texture2D(uTo, uv - (dirUv + wob) * uDrift * (1.0 - qNew) * (1.0 - qNew)).rgb;

    // per-dot odds, leaned by brightness (kept in 0..1 so nothing pops at the end):
    // dark old dots linger, dark new dots land first
    float r = hash(cell + uSeed), L = abs(uLuma);
    float la = uLuma >= 0.0 ? 1.0 - lum(a) : lum(a), lb = uLuma >= 0.0 ? lum(b) : 1.0 - lum(b);
    vec3 c = uGapColor;
    if ((r + L * lb) / (1.0 + L) < qNew) c = b;
    else if ((r + L * la) / (1.0 + L) > qOld) c = a;
    if (q <= 0.0) c = a;
    if (q >= 1.0) c = b;
    gl_FragColor = vec4(c, 1.0);
  }`;

export function mountSwap(
  root: HTMLElement,
  srcs: string[],
  opts: { reducedMotion: boolean; onReady: () => void },
): SwapControls {
  const P: SwapParams = { ...SWAP_DEFAULTS };
  THREE.ColorManagement.enabled = false; // hex/texels in, same values out

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  root.append(canvas);

  const loader = new THREE.TextureLoader();
  const textures = srcs.map((src) => {
    const t = loader.load(src, () => {
      if (textures.every((x) => x.image)) {
        render();
        opts.onReady();
      }
    });
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; // drifting dots smear the edge texel instead of wrapping
    t.generateMipmaps = false;
    return t;
  });

  const uniforms = {
    uFrom: { value: textures[0] },
    uTo: { value: textures[0] },
    uT: { value: 1 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uGrain: { value: 1 },
    uSeed: { value: 0 },
    uGapColor: { value: new THREE.Color(PAPER) },
    uOrigin: { value: new THREE.Vector2() },
    uDir: { value: new THREE.Vector2(1, 0) },
    uSweep: { value: 0 },
    uBand: { value: 0 },
    uEdge: { value: 0 },
    uNoiseScale: { value: 0 },
    uJitter: { value: 0 },
    uGap: { value: 0 },
    uLuma: { value: 0 },
    uDrift: { value: 0 },
  };
  const scene = new THREE.Scene();
  const camera = new THREE.Camera(); // the vertex shader writes clip space directly
  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }),
  );
  scene.add(quad);
  const render = () => renderer.render(scene, camera);

  function resize() {
    renderer.setSize(root.clientWidth, root.clientHeight, false);
    renderer.getDrawingBufferSize(uniforms.uRes.value);
    render();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(root);

  let raf = 0, start = 0, lastSeed = 0;
  function tick(now: number) {
    const u = Math.max(0, Math.min((now - start) / 1000 / P.duration, 1)); // frame time can land a hair before start
    uniforms.uT.value = u * u * (3 - 2 * u); // ease in-out
    if (P.boilFps > 0 && now - lastSeed > 1000 / P.boilFps) {
      uniforms.uSeed.value = Math.floor(Math.random() * 97);
      lastSeed = now;
    }
    render();
    if (u < 1) raf = requestAnimationFrame(tick);
  }

  let current = 0, previous = 0;
  function run(fromI: number, toI: number) {
    cancelAnimationFrame(raf);
    uniforms.uFrom.value = textures[fromI];
    uniforms.uTo.value = textures[toI];
    if (opts.reducedMotion) {
      uniforms.uT.value = 1;
      render();
      return;
    }
    start = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function show(i: number) {
    if (i === current) return;
    // start from what's on screen now (mid-swap counts as "done" to keep it simple)
    previous = current;
    current = i;
    run(previous, current);
  }

  function setParams(p: Partial<SwapParams>) {
    Object.assign(P, p);
    const a = THREE.MathUtils.degToRad(P.angle);
    uniforms.uGrain.value = Math.max(1, Math.round(P.grain * dpr));
    uniforms.uGapColor.value.set(P.gapColor === "ink" ? INK : PAPER);
    uniforms.uOrigin.value.set(P.originX, 1 - P.originY); // GL y is up
    uniforms.uDir.value.set(Math.cos(a), -Math.sin(a)); // screen degrees, clockwise from right
    uniforms.uSweep.value = P.mode === "sweep" ? 1 : 0;
    uniforms.uBand.value = P.band;
    uniforms.uEdge.value = P.edgeNoise;
    uniforms.uNoiseScale.value = P.noiseScale;
    uniforms.uJitter.value = P.jitter;
    uniforms.uGap.value = P.gap;
    uniforms.uLuma.value = P.lumaBias;
    uniforms.uDrift.value = P.drift;
    if (uniforms.uT.value >= 1) render(); // mid-swap, the next tick picks it up
  }
  setParams({});

  return {
    show,
    replay: () => run(previous === current ? (current + 1) % textures.length : previous, current),
    setParams,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      textures.forEach((t) => t.dispose());
      quad.geometry.dispose();
      quad.material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
