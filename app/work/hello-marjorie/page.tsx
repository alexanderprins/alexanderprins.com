"use client";

// Hello, Marjorie — an interactive cocktail-menu study. A two-card stack (new
// menu in front, the original peeking behind) that flips and shuffles, with
// annotations explaining the design decisions. Motion values were tuned in the
// /lab/hm-menu sandbox (DialKit) and baked in here. Faces are supersampled PNGs
// (card renders at 2x, scales 0.5) so the 3D flip stays crisp.
//
// Responsive: desktop (>=918px of content width) shows the full-size stage with
// hover dots + popups. Narrower screens scale the whole flippable stack to fit
// and list the reasoning as numbered notes below it (hover/positioned popups
// don't translate to touch).

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "motion/react";
import { AnnotationLayer, annotationCss } from "./AnnotationLayer";
import { MenuGallery } from "./MenuGallery";
import { frontAnnotations } from "./annotations";

const NEW = {
  front: "/work/hello-marjorie/front-3x.png",
  back: "/work/hello-marjorie/back-3x.png",
  frontSm: "/work/hello-marjorie/front-sm.png",
  backSm: "/work/hello-marjorie/back-sm.png",
  nw: 1836, nh: 2379, // desktop (supersampled) face size
  smNw: 864, smNh: 1119, // mobile face size
  dw: 918, dh: 1189.5,
};
const OLD = {
  front: "/work/hello-marjorie/old-front-3x.png",
  back: "/work/hello-marjorie/old-back-3x.png",
  frontSm: "/work/hello-marjorie/old-front-sm.png",
  backSm: "/work/hello-marjorie/old-back-sm.png",
  nw: 1225, nh: 2377,
  smNw: 576, smNh: 1117,
  dw: 612.5, dh: 1188.5,
};

const SCENE_W = 918;
const SCENE_H = 1190;

type Menu = { front: string; back: string; nw: number; nh: number; dw: number; dh: number };
type Slot = { x: number; y: number; rotate: number; z: number };

// On mobile, use small face images + small native dims so the flip's 3D
// composited layers stay tiny. Full-res faces at desktop scale blow past phone
// GPU/texture memory and crash the tab on flip/pinch.
function pickMenu(base: typeof NEW | typeof OLD, mobile: boolean): Menu {
  return mobile
    ? { front: base.frontSm, back: base.backSm, nw: base.smNw, nh: base.smNh, dw: base.dw, dh: base.dh }
    : { front: base.front, back: base.back, nw: base.nw, nh: base.nh, dw: base.dw, dh: base.dh };
}

// --- tuned constants (from the DialKit sandbox) ---
const PERSPECTIVE = 5000;
const FLIP_SPRING: Transition = { type: "spring", visualDuration: 0.6, bounce: 0.15 };
const SHUFFLE_SPRING: Transition = { type: "spring", visualDuration: 0.5, bounce: 0.14 };
const OLD_BACK = { x: -170, y: -10, rotate: -10 };
const NEW_BACK = { x: 50, y: 20, rotate: -9 };
const STAGGER = 0.05;
const DOT_ENTRANCE: Transition = { type: "spring", visualDuration: 0.23, bounce: 0.16 };
const SHADOW = "0px 20px 100px -20px rgba(0,0,0,0.4)";

const stageCss = `
  .hm-scene { position:relative; width:918px; height:1190px; overflow:visible; }
  .hm-figure { position:absolute; inset:0; }
  /* neon-pink back-halo (the bar's sign glowing behind the menu). Sits behind
     the opaque cream sheet, so the pink spills around its edges. */
  .hm-glow {
    position:absolute; left:50%; top:50%; width:1650px; height:1650px;
    transform:translate(-50%,-50%); border-radius:50%; pointer-events:none;
    background:radial-gradient(circle, rgba(224,2,120,0.55) 0%, rgba(224,2,120,0.30) 42%, rgba(224,2,120,0.11) 66%, rgba(224,2,120,0) 88%);
    filter:blur(40px);
  }
  .hm-card-slot { position:absolute; inset:0; margin:auto; cursor:pointer; }
  .hm-persp { position:absolute; inset:0; }
  .hm-cardscale {
    position:absolute; top:0; left:0;
    transform-origin:top left; transform-style:preserve-3d;
  }
  .hm-flipcard { position:absolute; inset:0; transform-style:preserve-3d; }
  .hm-face {
    position:absolute; inset:0; overflow:hidden;
    backface-visibility:hidden; -webkit-backface-visibility:hidden;
  }
  .hm-face-front { transform:rotateY(0deg); }
  .hm-face-back  { transform:rotateY(180deg); }
  .hm-sheet-img { position:absolute; top:0; left:0; display:block; max-width:none; }
  .hm-ann-wrap { position:absolute; inset:0; z-index:3; pointer-events:none; }

  .hm-toggle { display:flex; gap:14px; margin-bottom:64px; font-family:var(--font-sans); font-size:14px; line-height:1; }
  .hm-toggle button { color:#757575; background:none; border:0; padding:0; cursor:pointer; }
  .hm-toggle button.is-front { color:var(--color-black); text-decoration:underline; text-underline-offset:3px; }

  /* mobile numbered notes */
  .hm-note-n {
    flex:0 0 auto; width:22px; height:22px; border-radius:50%;
    background:#145740; color:#F4F1EA; display:grid; place-items:center;
    font-family:var(--font-sans); font-size:12px; font-weight:600; line-height:1;
  }
`;

function StackCard({
  menu,
  slot,
  flipped,
  onClick,
  onSettle,
}: {
  menu: Menu;
  slot: Slot;
  flipped: boolean;
  onClick: () => void;
  onSettle?: () => void;
}) {
  return (
    <motion.div
      className="hm-card-slot"
      style={{ width: menu.dw, height: menu.dh, zIndex: slot.z }}
      animate={{ x: slot.x, y: slot.y, rotate: slot.rotate }}
      transition={SHUFFLE_SPRING}
      onClick={onClick}
      onAnimationComplete={onSettle}
    >
      <div className="hm-persp" style={{ perspective: `${PERSPECTIVE}px` }}>
        <div
          className="hm-cardscale"
          style={{
            width: menu.nw,
            height: menu.nh,
            transform: `scale(${menu.dw / menu.nw})`,
          }}
        >
          <motion.div
            className="hm-flipcard"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={FLIP_SPRING}
            onAnimationComplete={onSettle}
          >
            <div className="hm-face hm-face-front" style={{ boxShadow: SHADOW }}>
              <img
                className="hm-sheet-img"
                src={menu.front}
                alt=""
                style={{ width: menu.nw, height: menu.nh }}
              />
            </div>
            <div className="hm-face hm-face-back" style={{ boxShadow: SHADOW }}>
              <img
                className="hm-sheet-img"
                src={menu.back}
                alt=""
                style={{ width: menu.nw, height: menu.nh }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HelloMarjoriePage() {
  const [frontCard, setFrontCard] = useState<"new" | "old">("new");
  const [newFlipped, setNewFlipped] = useState(false);
  const [oldFlipped, setOldFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [newSettled, setNewSettled] = useState(true);

  // Fit-to-width: scale the fixed 918px stack down to the available width.
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      const avail = el.clientWidth;
      setScale(Math.min(1, avail / SCENE_W));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const isFull = scale >= 1; // desktop: interactive dots. else: numbered list.
  const mobile = ready && scale < 1; // small faces once we know we're scaled down
  const newMenu = pickMenu(NEW, mobile);
  const oldMenu = pickMenu(OLD, mobile);

  const FRONT_SLOT: Slot = { x: 0, y: 0, rotate: 0, z: 2 };
  const oldBackSlot: Slot = { ...OLD_BACK, z: 1 };
  const newBackSlot: Slot = { ...NEW_BACK, z: 1 };
  const newSlot = frontCard === "new" ? FRONT_SLOT : newBackSlot;
  const oldSlot = frontCard === "old" ? FRONT_SLOT : oldBackSlot;

  const clickNew = () => {
    setNewSettled(false);
    if (frontCard === "new") setNewFlipped((v) => !v);
    else setFrontCard("new");
  };
  const clickOld = () => {
    if (frontCard === "old") setOldFlipped((v) => !v);
    else {
      setNewSettled(false);
      setFrontCard("old");
    }
  };
  const showOld = () => {
    if (frontCard !== "old") {
      setNewSettled(false);
      setFrontCard("old");
    }
  };
  const showNew = () => {
    if (frontCard !== "new") {
      setNewSettled(false);
      setFrontCard("new");
    }
  };
  const markSettled = () => {
    if (frontCard === "new" && !newFlipped) setNewSettled(true);
  };

  const annActive = frontCard === "new" && !newFlipped && newSettled;

  return (
    <main className="mx-auto w-full max-w-[1440px] overflow-x-clip px-6 pb-24 pt-[90px] lg:overflow-x-visible">
      <style dangerouslySetInnerHTML={{ __html: stageCss + annotationCss }} />

      {/* intro + gallery: stacked on mobile, side by side on desktop */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <header className="w-full lg:w-[600px] lg:shrink-0">
          <h1 className="font-serif text-sm font-medium leading-tight text-black">
            Hello, Marjorie Menu Redesign
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-black/60">2025</p>
          <p className="mt-8 text-sm leading-6 text-black/60 lg:mt-16">
            When approaching the Hello, Marjorie redesign, the primary focus was
            improving readability for the bar&rsquo;s patrons. The bar is
            naturally a very dark environment lit primarily by vintage lamps hung
            from the ceiling and the hallmark neon sign featured near the entrance
            to the bar. Other considerations were primarily to devise a better
            visual organization to represent a change in how the bar approached
            its beverage program, placing greater emphasis on classic cocktails
            while still featuring house cocktails.
          </p>
        </header>

        <MenuGallery />
      </div>

      {/* the interactive stack, scaled to fit */}
      <section ref={sectionRef} className="mt-[90px]">
        <div
          className="mx-auto"
          style={{ width: SCENE_W * scale, opacity: ready ? 1 : 0 }}
        >
          <div className="hm-toggle">
            <button
              className={frontCard === "old" ? "is-front" : ""}
              onClick={showOld}
            >
              Old
            </button>
            <button
              className={frontCard === "new" ? "is-front" : ""}
              onClick={showNew}
            >
              New
            </button>
          </div>

          <div style={{ width: SCENE_W * scale, height: SCENE_H * scale }}>
            <div
              style={{
                position: "relative",
                width: SCENE_W,
                height: SCENE_H,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
              }}
            >
              <div className="hm-glow" aria-hidden="true" />
              <div className="hm-scene">
                <div
                  className="hm-figure"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <StackCard
                    menu={oldMenu}
                    slot={oldSlot}
                    flipped={oldFlipped}
                    onClick={clickOld}
                  />
                  <StackCard
                    menu={newMenu}
                    slot={newSlot}
                    flipped={newFlipped}
                    onClick={clickNew}
                    onSettle={markSettled}
                  />

                  {isFull && (
                    <div className="hm-ann-wrap">
                      <AnnotationLayer
                        annotations={frontAnnotations}
                        frontSettled={annActive}
                        hovered={hovered}
                        stagger={STAGGER}
                        entrance={DOT_ENTRANCE}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* touch fallback: the reasoning as a numbered list */}
        {ready && !isFull && (
          <ol className="mx-auto mt-12 max-w-[520px] space-y-7">
            {frontAnnotations.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="hm-note-n">{a.n}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black">{a.title}</p>
                  <p className="mt-1 text-sm leading-6 text-black/60">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
