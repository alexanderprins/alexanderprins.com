"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { getProject } from "@/lib/projects";
import { CaseStudyBody } from "@/components/CaseStudyBody";

// "See more" on a homepage case study: the /work/<slug> page slides in from the
// right as an overlay, under the fixed header bar (the header's fade sits below
// it, so the shadow diffuses over the top edge too). Its left edge sits 24px in
// from the 1440 frame's left edge; it runs to the browser's right edge, while
// its contents keep the frame's right content edge. Hovering anywhere left of
// the panel eases only the CARD 24px further right (the contents stay still) to
// reveal more of the sidebar nav, a hint that a click goes back. Clicking there
// (or anywhere outside), or Escape, closes it. Phones: 12px from the left edge,
// 24px padding, a Close button (no hover there); Back/swipe-back also close it.
const FRAME = "max(0px, (100vw - 1440px) / 2)"; // the 1440 frame's offset on wide screens

export function CaseStudyPanel({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const open = slug !== null;
  const [peek, setPeek] = useState(false);
  // keep the last project mounted while the panel slides out
  const [shown, setShown] = useState<string | null>(slug);
  if (slug && slug !== shown) setShown(slug);
  const project = shown ? getProject(shown) : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden"; // the panel scrolls, the page behind doesn't
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open, onClose]);

  const peeking = open && peek;
  // the card and the fade over its top edge move together on peek
  const cardLeft = `transition-[left] duration-300 ease-out ${peeking ? "left-6" : "left-0"}`;

  return (
    <>
      {open ? <div className="fixed inset-0 z-30" aria-hidden="true" onClick={onClose} /> : null}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project ? `${project.title} case study` : undefined}
        aria-hidden={!open}
        style={{ "--frame": FRAME } as CSSProperties}
        // closed: pushed fully past the window's right edge (plus the shadow's
        // reach) and hidden once the slide ends, so no width ever shows it.
        // Tailwind 4's translate-x-* sets `translate`, not `transform`: the
        // transition has to name `translate` or the slide snaps.
        className={`fixed bottom-0 left-3 right-0 top-[72px] z-30 transition-[translate,visibility] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:left-[calc(var(--frame)_+_24px)] lg:top-[96px] ${
          open ? "visible translate-x-0" : "invisible translate-x-[calc(100%+240px)]"
        }`}
      >
        {/* the card: background, white top/left edge, rounded top-left corner,
            shadow. Only this layer moves on peek, so the contents don't shift. */}
        <div
          aria-hidden="true"
          className={`case-card absolute inset-y-0 right-0 rounded-tl-[24px] border-l border-t bg-[var(--background)] shadow-[-8px_-4px_48px_rgba(0,0,0,0.10),0_0_96px_rgba(0,0,0,0.10)] ${cardLeft}`}
        />
        <div
          // inset 1px top/left, inside the card's border (scrolled content painted
          // over it: a crack above the fade), and rounded to match the card so
          // full-bleed phone images clip to the corner instead of squaring it off
          className="absolute bottom-0 left-px right-0 top-px overflow-y-auto overscroll-contain rounded-tl-[23px] px-6 pb-24 pt-[47px] lg:pl-12 lg:pr-[calc(var(--frame)_+_60px)]"
        >
          {project ? <CaseStudyBody project={project} /> : null}
        </div>
        {/* the case study dissolves under the panel's top edge (globals.css) */}
        <div
          aria-hidden="true"
          className={`case-fade pointer-events-none absolute right-0 top-px ml-px rounded-tl-[23px] ${cardLeft}`}
        />
        {/* everything left of the panel (plus its first 48px): hover to peek,
            click to go back */}
        <button
          type="button"
          aria-label="Back to the homepage"
          tabIndex={open ? 0 : -1}
          onMouseEnter={() => setPeek(true)}
          onMouseLeave={() => setPeek(false)}
          onFocus={() => setPeek(true)}
          onBlur={() => setPeek(false)}
          onClick={() => {
            setPeek(false);
            onClose();
          }}
          style={{ left: `calc(-1 * (${FRAME} + 24px))`, width: `calc(${FRAME} + 24px + 48px)` }}
          className="absolute inset-y-0 z-10 hidden cursor-pointer lg:block"
        />
        {/* phones: no hover, so a plain Close in the top-right corner */}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
          className="absolute right-2 top-3 z-10 flex h-6 cursor-pointer items-center bg-[var(--background)] px-2 text-black lg:hidden"
        >
          Close
        </button>
      </div>
    </>
  );
}
