"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const EMAIL = "hello@alexanderprins.com";

// Footer CTA: the email shown big in serif, click-to-copy (no mailto). Copy
// icon mirrors the nav. No orange (reserved for Claude Code).
export function CtaEmail() {
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
    <button
      onClick={copy}
      aria-label="Copy email address"
      className="group mt-4 inline-flex items-center gap-3 font-serif text-4xl tracking-tight sm:text-5xl"
    >
      <span>{EMAIL}</span>
      <span className="text-black/30 transition-colors group-hover:text-black/60">
        {copied ? <Check size={24} /> : <Copy size={24} />}
      </span>
    </button>
  );
}
