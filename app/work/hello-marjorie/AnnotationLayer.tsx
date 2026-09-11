// The annotation overlay for the typography study. Two layers inside the figure:
//   1. .hm-annotations — the numbered dots, in 612x793 design space scaled 1.5 to
//      match the menu. Dots stagger in on hover.
//   2. .hm-callout-layer — the popup, in SCREEN space (unscaled) so it renders at
//      its exact designed pixel size regardless of the menu zoom.
//
// Visibility: dots stagger in/out on hover; flipping to the back hides everything
// INSTANTLY (outer opacity, no transition); flipping to front holds the dots
// hidden until the flip finishes (parent sets frontSettled), then they stagger in.
// An open note "pins" the dots up even after the mouse leaves.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import type { Annotation } from "./annotations";
import { Marker } from "./Marker";

const SCALE = 1.5; // the menu / dots display scale; used to map dot -> screen coords
const FIG_W = 918;
const FIG_H = 1190;
const CALLOUT_W = 294;
const DOT_R = 15; // visible dot radius on screen (20px design * 1.5 / 2)
const GAP = 16;

// Place the popup beside the active dot, in screen pixels. Flip to the other side
// near the right edge; clamp vertically so it stays on the figure.
function calloutStyle(a: Annotation): React.CSSProperties {
  const dotX = a.x * SCALE;
  const dotY = a.y * SCALE;
  const placeLeft = dotX + DOT_R + GAP + CALLOUT_W > FIG_W;
  const left = placeLeft
    ? dotX - DOT_R - GAP - CALLOUT_W
    : dotX + DOT_R + GAP;
  const top = Math.min(Math.max(dotY - 32, 8), FIG_H - 250);
  return { width: CALLOUT_W, left, top };
}

export function AnnotationLayer({
  annotations,
  frontSettled,
  hovered,
  stagger,
  entrance,
}: {
  annotations: Annotation[];
  frontSettled: boolean; // front is up AND the flip has finished
  hovered: boolean;
  stagger: number; // seconds between each dot
  entrance: Transition; // spring each dot uses to pop in (from DialKit)
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = annotations.find((a) => a.id === activeId) ?? null;

  useEffect(() => {
    if (!frontSettled) setActiveId(null);
  }, [frontSettled]);

  const showDots = frontSettled && (hovered || active !== null);
  const toggle = (id: string) =>
    setActiveId((cur) => (cur === id ? null : id));

  return (
    <>
      {/* dots — design space, scaled 1.5 */}
      <div
        className="hm-annotations"
        data-visible={showDots}
        style={{ opacity: frontSettled ? 1 : 0 }} // instant flip-hide, no fade
      >
        <motion.div
          className="hm-markers"
          initial="hidden"
          animate={showDots ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: stagger, delayChildren: 0.03 } },
            hidden: {
              transition: {
                staggerChildren: Math.max(stagger * 0.4, 0.005),
                staggerDirection: -1,
              },
            },
          }}
        >
          {annotations.map((a) => (
            <Marker
              key={a.id}
              annotation={a}
              active={activeId === a.id}
              onSelect={toggle}
              entrance={entrance}
            />
          ))}
        </motion.div>
      </div>

      {/* popup — screen space, true pixel size */}
      <div
        className="hm-callout-layer"
        style={{ opacity: frontSettled ? 1 : 0 }}
      >
        <AnimatePresence>
          {active ? (
            <motion.div
              key={active.id}
              className="hm-callout"
              style={calloutStyle(active)}
              initial={{ opacity: 0, scale: 0.96, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ type: "spring", visualDuration: 0.28, bounce: 0.14 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hm-callout-head">
                <span className="hm-callout-n">{active.n}</span>
                <span className="hm-callout-title">{active.title}</span>
                <button
                  type="button"
                  className="hm-callout-x"
                  aria-label="Close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(null);
                  }}
                >
                  ×
                </button>
              </div>
              <p className="hm-callout-body">{active.body}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

export const annotationCss = `
  /* Annotations live in 612x793 design space and scale up 1.5 themselves, so the
     markers land on the same coordinates the menu was designed at. */
  .hm-annotations {
    position:absolute; top:0; left:0; width:612px; height:793px;
    transform:scale(1.5); transform-origin:top left;
    z-index:5; pointer-events:none;
  }
  .hm-markers { position:absolute; inset:0; pointer-events:none; }
  .hm-annotations[data-visible="false"] .hm-marker-hit { pointer-events:none; }

  /* Frame A: fixed 44x44 hit target. Never scales, so the hover edge never moves.
     Grid-centers the dot (block child centers reliably in a button; the flex quirk
     only bites text). */
  .hm-marker-hit {
    position:absolute; pointer-events:auto; cursor:pointer;
    width:44px; height:44px; padding:0; border:0; background:none;
    display:grid; place-items:center;
  }
  /* Frame B: the visible dot + number. Only this scales on hover/tap, via plain CSS
     (no spring, no moving hit edge -> can't wobble). */
  .hm-marker {
    display:block; pointer-events:none;
    width:20px; height:20px; border-radius:50%;
    background:#145740; color:#E5E3DF;
    text-align:center; line-height:20px;
    font-family:var(--font-sans); font-weight:600; font-size:11px;
    box-shadow:0 2px 8px rgba(0,0,0,.35);
    transition:transform 0.15s ease-out;
  }
  .hm-marker-hit:hover .hm-marker { transform:scale(1.1); }
  .hm-marker-hit:active .hm-marker { transform:scale(0.94); }
  .hm-marker.is-active { background:#231F20; }

  /* Popup — screen space, exact designed pixels. Site type system (Aktiv Grotesk).
     Box just wraps the body: 12 padding all round, 270 inner (badge+title+X share
     the header row across that same 270, body spans it with no indent). */
  .hm-callout-layer { position:absolute; inset:0; z-index:6; pointer-events:none; }
  .hm-callout {
    position:absolute; pointer-events:auto; box-sizing:border-box;
    width:294px; padding:12px; border-radius:8px;
    background:#221e19; color:#eae6df; border:1px solid rgba(234,230,223,0.08);
    box-shadow:0 18px 60px rgba(0,0,0,.5), 0 2px 8px rgba(0,0,0,.4);
    font-family:var(--font-sans);
  }
  /* Header row: badge(22) + 8 + title + 8 + close(22), spanning the 270 inner. H22.
     Badge inverted for dark: light circle, green number (menu dots stay green). */
  .hm-callout-head { display:flex; align-items:center; gap:8px; min-height:22px; }
  .hm-callout-n {
    flex:0 0 auto; width:22px; height:22px; border-radius:50%;
    background:#eae6df; color:#145740;
    display:grid; place-items:center;
    font-size:12px; font-weight:600; line-height:1;
  }
  .hm-callout-title {
    flex:1 1 auto; min-width:0;
    font-size:16px; font-weight:500; line-height:22px; color:#eae6df;
  }
  .hm-callout-x {
    flex:0 0 auto; width:22px; height:22px; padding:0; border:0; background:none;
    cursor:pointer; color:rgba(234,230,223,0.45); font-size:20px; line-height:1;
    display:grid; place-items:center; transition:color 0.12s ease;
  }
  .hm-callout-x:hover { color:#eae6df; }
  /* Body: full 270 inner (aligned left with the badge), 8 gap under the header. */
  .hm-callout-body {
    margin:8px 0 0 0;
    font-size:14px; line-height:24px; color:rgba(234,230,223,0.62);
  }
`;
