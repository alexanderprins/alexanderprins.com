"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ColophonButton } from "@/components/ColophonButton";

// Logo left; "Made with [crab]" + a hamburger right, at ALL sizes. Every page
// link lives in the dropdown so the nav never runs out of room as pages are
// added. To add a page: build the route, then add it to NAV below.

const EMAIL = "hello@alexanderprins.com";

const NAV: { label: string; href: string }[] = [
  { label: "Video", href: "/video" },
  { label: "About", href: "/about" },
  // add pages here as they ship, e.g.:
  // { label: "Logos", href: "/logos" },
  // { label: "Photography", href: "/photography" },
  // { label: "Shirts", href: "/shirts" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-8">
      {/* No opacity dim on hover: the logo's shape re-composition (globals.css
          .logo-mark) IS the hover feedback. */}
      <Link href="/" aria-label="Home" className="text-black">
        <Logo size={28} />
      </Link>

      <nav className="flex items-center gap-5">
        <ColophonButton />
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-6 w-6 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`h-0.5 w-6 bg-black transition-transform duration-200 ${
              open ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-black transition-transform duration-200 ${
              open ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="hm-pop absolute right-6 top-full z-20 mt-3 flex min-w-40 flex-col border border-black/10 bg-white p-2 shadow-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 font-mono text-sm text-black/60 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => setOpen(false)}
              className="px-3 py-2 font-mono text-sm text-black/60 hover:text-black"
            >
              Email
            </a>
          </div>
        </>
      )}
    </header>
  );
}
