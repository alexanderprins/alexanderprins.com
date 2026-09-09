"use client";

// Hello, Marjorie — an interactive cocktail-menu study. A two-card stack: the new
// menu in front, the old (pre-redesign) menu peeking behind. Click the front card
// to flip it, click the peeking card (or the Old/New words) to shuffle it forward.
// Hover the new menu for numbered annotations explaining the design decisions.
//
// Motion values here were tuned live in the /lab/hm-menu sandbox (DialKit) and
// baked in as constants. Faces are supersampled PNGs (card renders at 2x, scales
// 0.5) so the 3D flip stays crisp.

import { useState } from "react";
import { motion, type Transition } from "motion/react";
import { AnnotationLayer, annotationCss } from "./AnnotationLayer";
import { MenuGallery } from "./MenuGallery";
import { frontAnnotations } from "./annotations";

const NEW = {
  front: "/work/hello-marjorie/front-3x.png",
  back: "/work/hello-marjorie/back-3x.png",
  nw: 1836,
  nh: 2379,
  dw: 918,
  dh: 1189.5,
};
const OLD = {
  front: "/work/hello-marjorie/old-front-3x.png",
  back: "/work/hello-marjorie/old-back-3x.png",
  nw: 1225,
  nh: 2377,
  dw: 612.5,
  dh: 1188.5,
};

type Menu = typeof NEW;
type Slot = { x: number; y: number; rotate: number; z: number };

// --- tuned constants (from the DialKit sandbox) ---
const PERSPECTIVE = 5000;
const FLIP_SPRING: Transition = { type: "spring", visualDuration: 0.6, bounce: 0.15 };
const SHUFFLE_SPRING: Transition = { type: "spring", visualDuration: 0.5, bounce: 0.14 };
const OLD_BACK = { x: -170, y: -10, rotate: -10 }; // old menu's peek (default view)
const NEW_BACK = { x: 50, y: 20, rotate: -9 }; // new menu's peek (once old is front)
const STAGGER = 0.05;
const DOT_ENTRANCE: Transition = { type: "spring", visualDuration: 0.23, bounce: 0.16 };
// dialed 0 / 10 / 50 / -10 @ 0.4; doubled to cancel the 0.5 card scale (shadow is
// on the faces so it foreshortens with the flip)
const SHADOW = "0px 20px 100px -20px rgba(0,0,0,0.4)";

const stageCss = `
  .hm-scene { position:relative; width:918px; height:1190px; overflow:visible; }
  .hm-figure { position:absolute; inset:0; }
  .hm-card-slot { position:absolute; inset:0; margin:auto; cursor:pointer; }
  .hm-persp { position:absolute; inset:0; }
  .hm-cardscale {
    position:absolute; top:0; left:0;
    transform:scale(0.5); transform-origin:top left; transform-style:preserve-3d;
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

  .hm-toggle { position:relative; z-index:30; display:flex; gap:14px; margin-bottom:64px; font-family:var(--font-sans); font-size:14px; line-height:1; }
  .hm-toggle button { color:#757575; background:none; border:0; padding:0; cursor:pointer; }
  .hm-toggle button.is-front { color:#1e1e1e; text-decoration:underline; text-underline-offset:3px; }
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
        <div className="hm-cardscale" style={{ width: menu.nw, height: menu.nh }}>
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
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-[90px]">
      <style dangerouslySetInnerHTML={{ __html: stageCss + annotationCss }} />

      <div className="flex items-start justify-between gap-12">
        <header className="shrink-0" style={{ width: 600 }}>
          <h1 className="font-serif text-sm font-medium leading-tight text-black">
            Hello, Marjorie Menu Redesign
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-black/60">2025</p>
          <p className="mt-16 text-sm leading-6 text-black/60">
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

      <div className="flex justify-center" style={{ marginTop: 90 }}>
        <div style={{ width: 918 }}>
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
          <div className="hm-scene">
            <div
              className="hm-figure"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <StackCard
                menu={OLD}
                slot={oldSlot}
                flipped={oldFlipped}
                onClick={clickOld}
              />
              <StackCard
                menu={NEW}
                slot={newSlot}
                flipped={newFlipped}
                onClick={clickNew}
                onSettle={markSettled}
              />

              <div className="hm-ann-wrap">
                <AnnotationLayer
                  annotations={frontAnnotations}
                  frontSettled={annActive}
                  hovered={hovered}
                  stagger={STAGGER}
                  entrance={DOT_ENTRANCE}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
