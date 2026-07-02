"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const EMAIL = "hello@alexanderprins.com";

// Hover-reveal (consistent with the colophon). The address shows on hover;
// the copy button inside is the only click action. Popover sits flush under
// the trigger (top-full + transparent pt bridge) so the hover doesn't drop.
export function EmailCopy() {
  const [copied, setCopied] = useState(false);

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
    <div className="group relative">
      <span className="cursor-default font-mono text-sm text-black/60 group-hover:text-black">
        Email
      </span>
      <div className="invisible absolute right-0 top-full z-10 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
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
