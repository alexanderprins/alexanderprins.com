// Homepage hero: one stipple-lit shape that melts between sphere, cube and pyramid
// (Play / Discover / Systematize), and into a project's mark when its title is
// hovered (coupe glass, Lily, Cascata, NV). Plain Three.js, no React; HeroMorph.tsx mounts it.
//
// How it draws: raymarching. Every shape is a "distance function": give it a
// point, it says how far the nearest surface is (negative = inside). For each
// pixel we fire a ray from the camera and step forward by that distance until we
// touch the surface. Melting = blending the distance functions, so any shape can
// melt into any other, even ones with holes and separate pieces like the logos.
//   sphere / cube / pyramid: exact math, so edges are truly sharp
//   logos: a baked 2D distance atlas (scripts/buildShapeSdf.ts), extruded
//   coupe: the same atlas, spun around its vertical axis (a lathe)
//
// Two passes: the costly raymarch renders light values into a smaller offscreen
// layer (`quality`), then a full-resolution pass turns them into stipple dots, so
// dots stay one device pixel sharp while the 3D work stays affordable.
//
// The canvas is transparent and overscans its box (OVERSCAN above and below), so
// corners and mid-melt bulges never get cut off. It takes no pointer events (it
// overlaps the text and the featured list); drag + cursor run on window with a hit test.

import * as THREE from "three";
import { HASH, INK, NOISE, PAPER } from "@/lib/stipple";

export type MorphParams = {
  grain: number; // stipple cell, CSS px (floored at 1 device px)
  boilFps: number; // grain reshuffles per second, 0 = frozen
  tone: number; // gamma on the light: >1 = more ink, <1 = more paper
  contrast: number; // light gain before the stipple threshold
  falloff: number; // light distance falloff
  size: number; // shape scale inside the box
  sharpness: number; // cube/pyramid edge crispness (higher = smaller edge rounding)
  pyramidTilt: number; // degrees the upright pyramid leans its apex toward the viewer
  spin: number; // idle rotation speed multiplier
  melt: number; // seconds per melt
  wobble: number; // noise bulge during a melt
  twist: number; // twist during a melt
  logoSize: number; // logos + coupe: half the longest side, shape units (sphere radius = 1)
  logoDepth: number; // logos: half the extrusion thickness
  logoBevel: number; // logos: edge rounding
  logoTilt: number; // logos + coupe: degrees tipped back
  logoTurn: number; // logos + coupe: degrees of side-to-side sway on top of the spin
  logoSway: number; // logos + coupe: sway cycles per second
  markSpin: number; // logos + coupe: spin around the vertical axis, degrees per second
  coupePour: number; // coupe: degrees tipped sideways, like it's pouring
  quality: number; // raymarch resolution vs. the screen (lower = faster, softer edges)
};

export const MORPH_DEFAULTS: MorphParams = {
  grain: 0.5,
  boilFps: 30,
  tone: 1.05,
  contrast: 3.25,
  falloff: 0.23,
  size: 1,
  sharpness: 80,
  pyramidTilt: 3,
  spin: 2.4,
  melt: 0.9,
  wobble: 0.61,
  twist: 0.15,
  logoSize: 0.89,
  logoDepth: 0.26,
  logoBevel: 0,
  logoTilt: 0,
  logoTurn: 24,
  logoSway: 0,
  markSpin: 15,
  coupePour: -12,
  quality: 0.6,
};

// Shape ids. 0-2 are the PDS words; 3+ are project marks.
export const SHAPE = { sphere: 0, cube: 1, pyramid: 2, coupe: 3, lily: 4, cascata: 5, nv: 6, pp: 7 } as const;

export type MorphControls = {
  setShape: (i: number) => void;
  setParams: (p: Partial<MorphParams>) => void;
  dispose: () => void;
};

// Atlas layout, in sync with scripts/buildShapeSdf.ts: a 3x2 grid of cells
// (top: coupe, lily, cascata; bottom: nv, pp). Each cell spans [-M, M] units;
// texture uv origin is bottom-left (flipY), so the top row is v 0.5..1.
// ?v= busts browser caches (the PNG is cached ~4h). BUMP IT whenever you rerun
// scripts/buildShapeSdf.ts, or visitors can pair new code with an old atlas.
const ATLAS = { src: "/home/shape-sdf.png?v=3x2-pp", M: 1.2, R: 0.12, texel: (2 * 1.2) / 512 };
const FOV = 20;
const FIT = 1.25; // half-height of the box, in shape units (sphere radius = 1)
const OVERSCAN = 0.4; // extra canvas above and below, as a fraction of the box height
const BOUND = 1.75; // every shape fits inside this sphere; rays only march inside it
const MAX_DPR = 2;

const VERT = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// Pass 1: raymarch. Writes the light value (red) where the ray hits, transparent where it misses.
const FRAG = NOISE + /* glsl */ `
  uniform vec3 uLight;
  uniform float uFalloff, uContrast, uTone;
  uniform vec2 uRes; uniform float uCamZ, uTan, uAspect;
  uniform mat3 uRot, uInvRot;
  uniform vec4 uWa, uWb;            // weights: (sphere, cube, pyramid, pp), (coupe, lily, cascata, nv)
  uniform float uRound, uTwistA, uNoise, uTime, uStep;
  uniform sampler2D uAtlas; uniform float uLogoSize, uDepth, uBevel;

  const float M = ${ATLAS.M.toFixed(3)}, R = ${ATLAS.R.toFixed(3)}, EDGE = M - ${(ATLAS.texel * 1.5).toFixed(4)};
  const vec2 CELL = vec2(1.0 / 3.0, 0.5); // one cell's size in uv (3 columns, 2 rows)

  float sdBox(vec3 p, float b, float r) {
    vec3 q = abs(p) - (b - r);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
  }
  // square pyramid, base half-size 0.5, height h, base at y = 0 (Inigo Quilez)
  float sdPyramid(vec3 p, float h) {
    float m2 = h * h + 0.25;
    p.xz = abs(p.xz);
    p.xz = (p.z > p.x) ? p.zx : p.xz;
    p.xz -= 0.5;
    vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);
    float s = max(-q.x, 0.0);
    float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);
    float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
    float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);
    float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);
    return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
  }
  // 2D distance to a mark in the atlas; outside the quadrant, add the distance to it
  float atlas(vec2 q, vec2 base) {
    vec2 qc = clamp(q, -EDGE, EDGE);
    float v = textureLod(uAtlas, base + (qc / M * 0.5 + 0.5) * CELL, 0.0).r;
    return (v - 0.5) * 2.0 * R + length(q - qc);
  }
  float sdLogo(vec3 p, vec2 base) {
    float d2 = atlas(p.xy / uLogoSize, base) * uLogoSize;
    vec2 w = vec2(d2 + uBevel, abs(p.z) - uDepth + uBevel);
    return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - uBevel;
  }
  float sdCoupe(vec3 p) {
    return atlas(vec2(length(p.xz), p.y) / uLogoSize, vec2(0.0, 0.5)) * uLogoSize;
  }

  float map(vec3 p) {
    float a = uTwistA * p.y;                                   // twist around the vertical axis
    p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    float d = 0.0;
    if (uWa.x > 0.0) d += uWa.x * (length(p) - 1.0);
    if (uWa.y > 0.0) d += uWa.y * sdBox(p, 0.8, uRound);
    if (uWa.z > 0.0) d += uWa.z * (sdPyramid((p + vec3(0.0, 0.95, 0.0)) / 1.9, 1.0) * 1.9 - uRound);
    if (uWb.x > 0.0) d += uWb.x * sdCoupe(p);
    if (uWb.y > 0.0) d += uWb.y * sdLogo(p, vec2(1.0 / 3.0, 0.5));
    if (uWb.z > 0.0) d += uWb.z * sdLogo(p, vec2(2.0 / 3.0, 0.5));
    if (uWb.w > 0.0) d += uWb.w * sdLogo(p, vec2(0.0, 0.0));
    if (uWa.w > 0.0) d += uWa.w * sdLogo(p, vec2(1.0 / 3.0, 0.0));
    if (uNoise > 0.0) d -= uNoise * snoise(p * 1.6 + vec3(0.0, uTime * 0.4, uTime * 0.15));
    return d;
  }
  vec3 normalAt(vec3 p, float e) {
    const vec2 k = vec2(1.0, -1.0);
    return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e)
                   + k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
  }

  void main() {
    vec2 ndc = gl_FragCoord.xy / uRes * 2.0 - 1.0;
    vec3 ro = vec3(0.0, 0.0, uCamZ);
    vec3 rd = normalize(vec3(ndc.x * uTan * uAspect, ndc.y * uTan, -1.0));
    // only march where the ray crosses the bounding sphere
    float b = dot(ro, rd), h = b * b - dot(ro, ro) + ${(BOUND * BOUND).toFixed(4)};
    if (h < 0.0) discard;
    h = sqrt(h);
    float t = -b - h, tEnd = -b + h;
    vec3 o = uInvRot * ro, dir = uInvRot * rd;                 // march in the shape's own space
    float pix = 2.0 * uTan / uRes.y;                           // world size of a pixel, per unit distance
    bool hit = false;
    for (int i = 0; i < 110; i++) {
      float d = map(o + dir * t);
      if (d < pix * t * 0.5) { hit = true; break; }
      t += d * uStep;
      if (t > tEnd) break;
    }
    if (!hit) discard;

    vec3 n = normalize(uRot * normalAt(o + dir * t, max(pix * t, 0.0015)));
    vec3 p = ro + rd * t;
    vec3 L = normalize(uLight - p); vec3 V = -rd;
    float dist = length(uLight - p);
    float att = 1.0 / (1.0 + uFalloff * dist * dist);        // light falls off with distance
    float l = smoothstep(0.03, 0.95, max(dot(n, L), 0.0) * att * uContrast);
    l -= pow(1.0 - abs(dot(n, V)), 2.0) * 0.25;               // darken toward the silhouette
    gl_FragColor = vec4(pow(clamp(l, 0.0, 1.0), uTone), 0.0, 0.0, 1.0);
  }`;

// Pass 2: full resolution. Light value = odds a dot is paper. The layer is
// filtered, so coverage (alpha) is smooth and thresholding it gives clean edges.
const DOTS = HASH + /* glsl */ `
  uniform sampler2D uLit; uniform vec2 uScreen; uniform vec3 uInk, uPaper; uniform float uGrain, uSeed;
  void main() {
    vec4 s = texture2D(uLit, gl_FragCoord.xy / uScreen);
    if (s.a < 0.5) discard;
    float r = hash(floor(gl_FragCoord.xy / uGrain) + uSeed);
    gl_FragColor = vec4(r < min(s.r / s.a, 0.94) ? uPaper : uInk, 1.0);  // cap: lit faces never vanish into the page
  }`;

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

// ink/paper override the site colors (the lab's negative version passes white ink on black)
export function mountMorph(
  root: HTMLElement,
  opts: { reducedMotion: boolean; ink?: string; paper?: string },
): MorphControls {
  const P: MorphParams = { ...MORPH_DEFAULTS };

  // Hex colors in, same hex out. (Color management would darken them into linear space.)
  THREE.ColorManagement.enabled = false;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(PAPER, 0);
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { display: "block", position: "absolute", left: "0", pointerEvents: "none" });
  root.append(canvas);

  // marks are blank until the atlas arrives; until then they stand in as the sphere
  let atlasReady = false;
  const atlas = new THREE.TextureLoader().load(ATLAS.src, () => {
    atlasReady = true;
    if (target >= SHAPE.coupe) setShape(target, true);
  });
  atlas.colorSpace = THREE.NoColorSpace;
  atlas.minFilter = atlas.magFilter = THREE.LinearFilter;
  atlas.generateMipmaps = false;

  const lit = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const dotU = {
    uLit: { value: lit.texture },
    uScreen: { value: new THREE.Vector2(1, 1) },
    uInk: { value: new THREE.Color(opts.ink ?? INK) },
    uPaper: { value: new THREE.Color(opts.paper ?? PAPER) },
    uGrain: { value: 1 },
    uSeed: { value: 0 },
  };
  const uniforms = {
    uLight: { value: new THREE.Vector3() },
    uFalloff: { value: 0 },
    uContrast: { value: 0 },
    uTone: { value: 1 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uCamZ: { value: 8 },
    uTan: { value: Math.tan((FOV / 2) * (Math.PI / 180)) },
    uAspect: { value: 1 },
    uRot: { value: new THREE.Matrix3() },
    uInvRot: { value: new THREE.Matrix3() },
    uWa: { value: new THREE.Vector4(1, 0, 0, 0) },
    uWb: { value: new THREE.Vector4() },
    uRound: { value: 0 },
    uTwistA: { value: 0 },
    uNoise: { value: 0 },
    uTime: { value: 0 },
    uStep: { value: 0.9 },
    uAtlas: { value: atlas },
    uLogoSize: { value: 1 },
    uDepth: { value: 0.1 },
    uBevel: { value: 0 },
  };
  const tan = uniforms.uTan.value;
  const plane = new THREE.PlaneGeometry(2, 2);
  const marchMat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, blending: THREE.NoBlending });
  const dotMat = new THREE.ShaderMaterial({ uniforms: dotU, vertexShader: VERT, fragmentShader: DOTS, transparent: true });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(plane, marchMat);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new THREE.Camera(); // the vertex shader writes clip space directly

  // ---------- size: the box fits FIT/size units tall; the canvas overscans above and below ----------
  let camZ = 8;
  function resize() {
    const W = root.clientWidth;
    const H = root.clientHeight;
    const pad = Math.round(H * OVERSCAN);
    const Hc = H + 2 * pad;
    canvas.style.top = `${-pad}px`;
    renderer.setSize(W, Hc);
    renderer.getDrawingBufferSize(dotU.uScreen.value);
    const q = THREE.MathUtils.clamp(P.quality, 0.2, 1);
    lit.setSize(Math.max(1, Math.round(dotU.uScreen.value.x * q)), Math.max(1, Math.round(dotU.uScreen.value.y * q)));
    uniforms.uRes.value.set(lit.width, lit.height);
    const aspect = W / Hc;
    const fit = FIT / P.size;
    // tall enough that the box spans `fit` vertically; wide enough for a widest-case shape sideways
    camZ = Math.max((fit * Hc) / (H * tan), (fit * 1.3) / (tan * aspect));
    uniforms.uCamZ.value = camZ;
    uniforms.uAspect.value = aspect;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  // skip rendering while the hero is scrolled offscreen
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  // ---------- melt: from wherever we are now, toward the target shape ----------
  const N = 8;
  const w = new Float32Array(N); // live weights
  const from = new Float32Array(N);
  const to = new Float32Array(N);
  w[0] = to[0] = 1;
  let target = 0;
  let meltStart = -1e9;
  function setShape(i: number, force = false) {
    if (i === target && !force) return;
    target = i;
    const shown = i >= SHAPE.coupe && !atlasReady ? SHAPE.sphere : i;
    from.set(w);
    to.fill(0);
    to[shown] = 1;
    meltStart = performance.now();
  }

  // ---------- light follows the cursor anywhere on the page; drag the shape to spin ----------
  const mouse = new THREE.Vector2(-0.5, 0.55);
  const lightXY = mouse.clone();
  const ndc = new THREE.Vector2();
  let dragging = false;
  let hovering = false;
  let last = { x: 0, y: 0 };
  const vel = new THREE.Vector2();
  const IDLE = new THREE.Vector2(0.0022, 0.0006);
  const idle = new THREE.Vector2();
  const toNdc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  const rayDir = new THREE.Vector3();
  const overShape = (e: PointerEvent) => {
    if ((e.target as Element | null)?.closest?.("a, button, input, .dialkit-root")) return false;
    toNdc(e);
    rayDir.set(ndc.x * tan * uniforms.uAspect.value, ndc.y * tan, -1).normalize();
    const b = camZ * rayDir.z; // ray from (0,0,camZ) vs a 1.3-radius sphere at the origin
    return b * b - camZ * camZ + 1.3 * 1.3 > 0;
  };
  const setCursor = (c: string) => (document.documentElement.style.cursor = c);
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" || e.button !== 0 || !overShape(e)) return; // touch scrolls the page instead
    e.preventDefault(); // no text selection while dragging
    dragging = true;
    last = { x: e.clientX, y: e.clientY };
    setCursor("grabbing");
  };
  const onMove = (e: PointerEvent) => {
    toNdc(e);
    mouse.set(THREE.MathUtils.clamp(ndc.x, -1.6, 1.6), THREE.MathUtils.clamp(ndc.y, -1.6, 1.6));
    if (dragging) {
      vel.set((e.clientX - last.x) * 0.008, (e.clientY - last.y) * 0.008);
      last = { x: e.clientX, y: e.clientY };
    } else if (e.pointerType !== "touch") {
      const over = overShape(e);
      if (over !== hovering) setCursor(over ? "grab" : "");
      hovering = over;
    }
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    setCursor(hovering ? "grab" : "");
  };
  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  // ---------- orientation ----------
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.5, 0.7, 0.2));
  const AX = new THREE.Vector3(1, 0, 0);
  const AY = new THREE.Vector3(0, 1, 0);
  const tq = new THREE.Quaternion();
  const ID = new THREE.Quaternion();
  const up = new THREE.Vector3();
  const upright = new THREE.Vector3();
  const AZ = new THREE.Vector3(0, 0, 1);
  const pose = new THREE.Quaternion();
  let markYaw = 0;
  const m4 = new THREE.Matrix4();

  // ---------- loop ----------
  let raf = 0, lastSeed = 0, prev = performance.now(), clock = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    if (!visible) return;
    clock += dt;
    if (!opts.reducedMotion && P.boilFps > 0 && now - lastSeed > 1000 / P.boilFps) {
      dotU.uSeed.value = Math.random() * 97; // "boil": reshuffle the grain
      lastSeed = now;
    }

    // clamp: a frame's timestamp can land a hair BEFORE meltStart, and the easing curve blows up below 0
    const u = THREE.MathUtils.clamp((now - meltStart) / 1000 / (opts.reducedMotion ? 0.001 : P.melt), 0, 1);
    const s = smoother(u);
    for (let k = 0; k < N; k++) w[k] = from[k] + (to[k] - from[k]) * s;
    uniforms.uWa.value.set(w[0], w[1], w[2], w[7]);
    uniforms.uWb.value.set(w[3], w[4], w[5], w[6]);
    const melting = Math.sin(Math.PI * u);
    uniforms.uNoise.value = melting * P.wobble * 0.2;
    uniforms.uTwistA.value = melting * P.wobble * P.twist;
    uniforms.uStep.value = 0.9 - melting * 0.35; // twist + noise bend the distances; step carefully mid-melt
    uniforms.uTime.value = clock;

    lightXY.lerp(mouse, 0.08);
    uniforms.uLight.value.set(lightXY.x * camZ * tan * uniforms.uAspect.value, lightXY.y * camZ * tan, 2.2);

    // Sphere + cube tumble. The pyramid stands upright (leaning toward the viewer)
    // and only spins around its own vertical axis. Marks spin around the vertical
    // axis too, tipped back by logoTilt; the coupe is also tipped sideways (pouring),
    // so its spin reads as a slow circling pour.
    const isMark = target >= SHAPE.coupe;
    const standUp = target === SHAPE.pyramid;
    const tilt = THREE.MathUtils.degToRad(P.pyramidTilt);
    upright.set(0, Math.cos(tilt), Math.sin(tilt));
    idle.copy(IDLE).multiplyScalar(opts.reducedMotion || isMark ? 0 : P.spin);
    if (standUp) idle.y = 0;
    if (!dragging) vel.lerp(idle, isMark ? 0.15 : 0.03); // coast back to the slow idle turn
    quat.premultiply(tq.setFromAxisAngle(standUp ? upright : AY, vel.x)).premultiply(tq.setFromAxisAngle(AX, vel.y));
    if (!dragging && standUp) {
      up.set(0, 1, 0).applyQuaternion(quat);
      tq.setFromUnitVectors(up, upright);
      quat.premultiply(ID.clone().slerp(tq, 1 - Math.exp(-dt * 4)));
    } else if (!dragging && isMark) {
      if (!opts.reducedMotion) markYaw += dt * THREE.MathUtils.degToRad(P.markSpin);
      const sway = opts.reducedMotion ? 0 : Math.sin(clock * P.logoSway * Math.PI * 2) * THREE.MathUtils.degToRad(P.logoTurn);
      const d2r = THREE.MathUtils.degToRad;
      // read right to left: pour (coupe only), then spin, then tip back
      pose.setFromAxisAngle(AX, target === SHAPE.coupe ? d2r(P.logoTilt) : -d2r(P.logoTilt))
        .multiply(tq.setFromAxisAngle(AY, markYaw + sway))
        .multiply(tq.setFromAxisAngle(AZ, target === SHAPE.coupe ? d2r(P.coupePour) : 0));
      quat.slerp(pose, 1 - Math.exp(-dt * 5));
    }
    if (dragging) vel.multiplyScalar(0.6); // holding still = stop
    quat.normalize();
    uniforms.uRot.value.setFromMatrix4(m4.makeRotationFromQuaternion(quat));
    uniforms.uInvRot.value.copy(uniforms.uRot.value).transpose();

    quad.material = marchMat; // pass 1: light values into the offscreen layer
    renderer.setRenderTarget(lit);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    quad.material = dotMat; // pass 2: dots on screen
    renderer.setRenderTarget(null);
    renderer.setClearColor(PAPER, 0);
    renderer.clear();
    renderer.render(scene, camera);
  }

  function setParams(p: Partial<MorphParams>) {
    Object.assign(P, p);
    dotU.uGrain.value = Math.max(1, P.grain * dpr);
    uniforms.uFalloff.value = P.falloff;
    uniforms.uContrast.value = P.contrast;
    uniforms.uTone.value = P.tone;
    uniforms.uRound.value = 0.5 / P.sharpness;
    uniforms.uLogoSize.value = P.logoSize;
    uniforms.uDepth.value = P.logoDepth;
    uniforms.uBevel.value = Math.min(P.logoBevel, P.logoDepth * 0.9);
    if (p.size !== undefined || p.quality !== undefined) resize();
  }

  setParams({});
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setShape,
    setParams,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setCursor("");
      atlas.dispose();
      lit.dispose();
      plane.dispose();
      marchMat.dispose();
      dotMat.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
