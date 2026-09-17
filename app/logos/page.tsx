"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Grid2x2 } from "lucide-react";
import { Agentation } from "agentation";
import { GridOverlay } from "@/components/GridOverlay";

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
  // 24pt minor / 72pt major craft grid, toggled by the visitor-facing control
  // in the header row (shows the build discipline behind the page).
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("logos-dark", dark);
  }, [dark]);

  return (
    <main className="mx-auto w-full max-w-[1488px] px-6 pb-24">
      {/* Page heading + controls share a row, sitting ~1 major below the header
          (baseline on the block line); controls baseline-align with the H1. */}
      <div className="mt-[76px] flex items-center justify-between">
        <h1 className="font-serif text-sm font-medium text-black">Logos</h1>
        {/* Each control is a 24px box (one minor cell) with the glyph centered.
            Sun + moon boxes sit adjacent (no gap) so they read as a pair. */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            aria-label="Toggle layout grid"
            aria-pressed={showGrid}
            className={`flex h-6 w-6 items-center justify-center ${
              showGrid ? "text-black" : "text-black/40 hover:text-black"
            }`}
          >
            <Grid2x2 size={18} strokeWidth={1.5} />
          </button>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setDark(false)}
              aria-label="Light mode"
              aria-pressed={!dark}
              className={`flex h-6 w-6 items-center justify-center ${
                dark ? "text-black/40 hover:text-black" : "text-black"
              }`}
            >
              <Sun size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setDark(true)}
              aria-label="Dark mode"
              aria-pressed={dark}
              className={`flex h-6 w-6 items-center justify-center ${
                dark ? "text-black" : "text-black/40 hover:text-black"
              }`}
            >
              <Moon size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Logo grid: row 1 top sits 4 majors (288px) down from the top */}
      <div style={{ marginTop: 124 }}>
        {/* 3 columns of 360px boxes (5 majors), 144px (2 major) gaps,
            left-aligned. Box edges land on major lines; each logo fills a
            312x312 inner area (24px = 1 minor inset per side). */}
        <div
          className="grid w-fit gap-[144px]"
          style={{ gridTemplateColumns: "repeat(3, 360px)" }}
        >
          {LOGOS.map((logo) => {
            const hasSplit = logo.darkSrc && logo.lightSrc;
            const src = hasSplit
              ? (dark ? logo.darkSrc! : logo.lightSrc!)
              : logo.src!;
            const invert = !hasSplit && dark;
            return (
              <div key={logo.id} className="flex flex-col">
                <div className="h-[360px] w-[360px] p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={logo.label}
                    className="h-full w-full object-contain"
                    style={invert ? { filter: "invert(1)" } : undefined}
                  />
                </div>
                {/* Name + year sit in the major block directly under the box:
                    kept tight together, pinned to the block's bottom line. */}
                <div className="flex h-[72px] flex-col justify-end">
                  <p className="text-sm font-medium text-black">{logo.label}</p>
                  <p className="text-sm text-black/40">{logo.year}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GridOverlay show={showGrid} />
      <Agentation />
    </main>
  );
}
