"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EmailCopy } from "@/components/EmailCopy";
import { ColophonButton } from "@/components/ColophonButton";

// Logo left; nav right. "Made with [crab]" (ColophonButton) stays visible at all
// sizes. On desktop the Video/About/Email links sit inline; below `lg` they
// collapse into a hamburger dropdown (the colophon stays out of it, per design).

const EMAIL = "hello@alexanderprins.com";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-8">
      {/* No opacity dim on hover: the logo's shape re-composition (globals.css
          .logo-mark) IS the hover feedback. */}
      <Link href="/" aria-label="Home" className="text-black">
        <Logo size={28} />
      </Link>

      <nav className="flex items-center">
        <ColophonButton />

        {/* desktop: inline links */}
        <span
          className="mx-6 hidden h-3.5 w-px bg-black/20 lg:block"
          aria-hidden="true"
        />
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/video"
            className="font-mono text-sm text-black/60 hover:text-black"
          >
            Video
          </Link>
          <Link
            href="/about"
            className="font-mono text-sm text-black/60 hover:text-black"
          >
            About
          </Link>
          <EmailCopy />
        </div>

        {/* mobile: hamburger (two lines -> X) */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative ml-5 flex h-6 w-6 flex-col items-center justify-center gap-1.5 lg:hidden"
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

      {/* mobile dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-10 lg:hidden"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-6 top-full z-20 mt-3 flex min-w-40 flex-col border border-black/10 bg-white p-2 shadow-sm lg:hidden">
            <Link
              href="/video"
              onClick={() => setOpen(false)}
              className="px-3 py-2 font-mono text-sm text-black/60 hover:text-black"
            >
              Video
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="px-3 py-2 font-mono text-sm text-black/60 hover:text-black"
            >
              About
            </Link>
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
