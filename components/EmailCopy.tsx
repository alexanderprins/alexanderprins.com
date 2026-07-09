"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

const EMAIL = "hello@alexanderprins.com";

// Hover-reveal on desktop (consistent with the colophon); press-to-toggle on
// touch, where hover doesn't exist (tap outside closes). The copy button
// inside is the only other click action. Popover sits flush under the trigger
// (top-full + transparent pt bridge) so the hover doesn't drop.
export function EmailCopy() {
  const [copied, setCopied] = useState(false);
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

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; no-op
    }
  }

  return (
    <div ref={rootRef} className="group relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`font-mono text-sm group-hover:text-black ${
          open ? "text-black" : "text-black/60"
        }`}
      >
        Email
      </button>
      <div
        className={`absolute right-0 top-full z-10 pt-3 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 border border-black/10 bg-white px-3 py-2 shadow-sm">
          <span className="whitespace-nowrap font-mono text-sm text-black/60">
            {EMAIL}
          </span>
          <button
            onClick={copy}
            aria-label="Copy email address"
            className="text-black/40 hover:text-black"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
