"use client";

import { useEffect, useState } from "react";
import { getProject } from "@/lib/projects";
import { CaseStudyBody } from "@/components/CaseStudyBody";

// "See more" on a homepage case study: the /work/<slug> page slides in from the
// right as an overlay, under the fixed header. It stays inside the homepage's
// 1440 frame: its left edge sits 24px in from the frame's left edge (so on wide
// screens it never runs past the page), its right edge on the content edge.
// Hovering the left edge eases only the CARD 24px further right (the contents
// stay still) to reveal more of the sidebar nav, a hint that a click goes back.
// Clicking that edge (or anywhere outside), or Escape, closes it.
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
    html.dataset.caseOpen = ""; // header fade goes solid above the panel (globals.css)
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      delete html.dataset.caseOpen;
    };
  }, [open, onClose]);

  const peeking = open && peek;

  return (
    <>
      {open ? <div className="fixed inset-0 z-30" aria-hidden="true" onClick={onClose} /> : null}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project ? `${project.title} case study` : undefined}
        aria-hidden={!open}
        style={{ left: `calc(${FRAME} + 24px)`, right: `calc(${FRAME} + 12px)` }}
        className={`fixed bottom-0 top-[96px] z-30 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-[calc(100%+160px)]"
        }`}
      >
        {/* the card: background, white top/left edge, shadow. Only this layer
            moves on peek, so the contents above it don't shift. */}
        <div
          aria-hidden="true"
          className={`case-card absolute inset-y-0 right-0 border-l border-t bg-[var(--background)] shadow-[-8px_-4px_48px_rgba(0,0,0,0.10),0_0_96px_rgba(0,0,0,0.10)] transition-[left] duration-300 ease-out ${
            peeking ? "left-6" : "left-0"
          }`}
        />
        <div className="absolute inset-0 overflow-y-auto overscroll-contain px-12 pb-24 pt-12">
          {project ? <CaseStudyBody project={project} /> : null}
        </div>
        {/* left edge: hover to peek, click to go back */}
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
          className="absolute inset-y-0 left-0 z-10 w-12 cursor-pointer"
        />
      </div>
    </>
  );
}
