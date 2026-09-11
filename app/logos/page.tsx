"use client";

import { useState, useEffect } from "react";
import { Agentation } from "agentation";

// Each logo has a `src` (the dark/black export).
// Dark mode: invert(1) → white on dark bg.
// Light mode: as-is → black on white bg.
// `lightSrc` + `darkSrc` override both for logos with explicit per-mode files.
type LogoEntry = {
  id: string;
  label: string;
  year: string;
  src?: string;
  darkSrc?: string;
  lightSrc?: string;
  imgClass?: string;
};

const LOGOS: LogoEntry[] = [
  {
    id: "lily",
    label: "Lily Development",
    year: "2026",
    darkSrc: "/logos/lily-white.svg",
    lightSrc: "/logos/lily-black.svg",
    imgClass: "h-full w-full",
  },
  { id: "cascata-group",           label: "Cascata Group",           year: "2025", src: "/logos/cascata-group.png" },
  { id: "hammer-basketball",       label: "Hammer Basketball",       year: "2025", src: "/logos/hammer-basketball.png" },
  { id: "patient-pipeline",        label: "Patient Pipeline",        year: "2025", src: "/logos/patient-pipeline.png" },
  { id: "wills-family-orchard",    label: "Wills Family Orchard",    year: "2024", src: "/logos/wills-family-orchard.png" },
  { id: "pepps-pizzeria",          label: "Pepp's Pizzeria",         year: "2024", src: "/logos/pepps-pizzeria.png" },
  { id: "campari",                 label: "Campari",                 year: "2023", src: "/logos/campari.png" },
  { id: "justin-meyer",            label: "Justin Meyer Photography", year: "2023", src: "/logos/justin-meyer-photography.png" },
  { id: "secret-admirer",          label: "Secret Admirer",          year: "2022", src: "/logos/secret-admirer.png" },
  { id: "super-secret-brunch-club", label: "Super Secret Brunch Club", year: "2022", src: "/logos/super-secret-brunch-club.png" },
  { id: "northern-vessel",         label: "Northern Vessel",         year: "2022", src: "/logos/northern-vessel.png" },
  { id: "northern-vessel-2",       label: "Northern Vessel",         year: "2022", src: "/logos/northern-vessel-2.png" },
  { id: "northern-vessel-3",       label: "Northern Vessel",         year: "2022", src: "/logos/northern-vessel-3.png" },
  { id: "northern-vessel-4",       label: "Northern Vessel",         year: "2022", src: "/logos/northern-vessel-4.png" },
  { id: "good-news-darling",       label: "Good News, Darling",      year: "2021", src: "/logos/good-news-darling.png" },
];

export default function LogosPage() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("logos-dark", dark);
  }, [dark]);

  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-[90px]">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-sm font-medium text-black">Logos</h1>
        <div className="flex gap-5 font-mono text-sm">
          <button
            onClick={() => setDark(false)}
            className={dark ? "text-black/40" : "text-black underline underline-offset-4"}
          >
            Light
          </button>
          <button
            onClick={() => setDark(true)}
            className={dark ? "text-black underline underline-offset-4" : "text-black/40"}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-32 sm:grid-cols-3">
          {LOGOS.map((logo) => {
            const hasSplit = logo.darkSrc && logo.lightSrc;
            const src = hasSplit
              ? (dark ? logo.darkSrc! : logo.lightSrc!)
              : logo.src!;
            const invert = !hasSplit && dark;
            return (
              <div key={logo.id} className="flex flex-col gap-3">
                {/* pb-[100%] makes height = width (square), regardless of contents */}
                <div className="relative w-full pb-[100%]">
                  <div className="absolute inset-0 p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={logo.label}
                      className="h-full w-full object-contain"
                      style={invert ? { filter: "invert(1)" } : undefined}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{logo.label}</p>
                  <p className="text-sm text-black/40">{logo.year}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Agentation />
    </main>
  );
}
