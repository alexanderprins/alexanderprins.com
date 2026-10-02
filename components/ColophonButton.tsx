"use client";

import { useEffect, useRef, useState } from "react";
import { ClaudeCrab } from "@/components/ClaudeCrab";

// "Made with [crab]" colophon. Hover-reveal on desktop; press-to-toggle on
// touch, where hover doesn't exist (tap outside closes). Crab is ink (gray in
// the footer, like the rest of it), turns
// #FF6A3D on hover/open. The popover sits flush against the trigger (a
// transparent padding bridge) so the hover doesn't drop. `placement="up"` opens
// it above the trigger, for the footer.
export function ColophonButton({ placement = "down" }: { placement?: "down" | "up" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={rootRef} className="group relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-mono text-sm text-black/60"
      >
        <span>Made with</span>
        <span
          className={`transition-colors duration-200 group-hover:text-[#FF6A3D] ${
            open ? "text-[#FF6A3D]" : placement === "up" ? "text-black/60" : "text-black"
          }`}
        >
          <ClaudeCrab />
        </span>
      </button>
      {/* Mobile: fixed + centered on the viewport (any trigger-anchored
          position runs a w-72 panel off a narrow frame; the trigger sits
          mid-nav). top-16 = header pt-8 + trigger line + the 12px bridge.
          Desktop (sm+): back to absolute, right-aligned to the trigger. */}
      {/* Up (footer): above the trigger, centered on mobile where the footer
          column is centered, right-aligned on sm+ where it sits far right. */}
      <div
        className={`${
          placement === "up"
            ? "absolute bottom-full left-1/2 -translate-x-1/2 pb-3 sm:left-auto sm:right-0 sm:translate-x-0"
            : "fixed left-1/2 top-16 -translate-x-1/2 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:translate-x-0 sm:pt-3"
        } z-10 w-72 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="hm-pop border border-black/10 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 font-mono text-sm text-black/60">
            <span className="text-[#FF6A3D]">
              <ClaudeCrab />
            </span>
            Built with Claude Code
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/60">
            Designed by me. Shipped with Claude Code, run in the terminal.
            It&rsquo;s a Next.js app (React, TypeScript, Tailwind)
            with licensed type, deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
