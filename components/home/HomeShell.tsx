"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { Media } from "@/components/Media";
import { GridOverlay } from "@/components/GridOverlay";
import { CaseStudyPanel } from "@/components/home/CaseStudyPanel";
import { getProject } from "@/lib/projects";
import { CASE_STUDIES, MARKS, OTHER_WORK } from "@/lib/home";
import { MOTION_REEL } from "@/lib/motionReel";

// The single-scroll homepage on the 1416 grid: 12 columns (96 + 24 gutters),
// centered in 1440 with 12px margins. Columns 1-3 hold the table-of-contents nav,
// 4-11 the work, 12 the grid/light/dark toggles; the nav and toggles stay put
// (sticky) while the work scrolls. Vertical rhythm is 24/72: 24 gaps, 144
// between case studies, 216 between sections. Image heights scale from their
// 1440 sizes (456x264 tiles, 264x264 marks, 264x456 motion) so every box lands
// on the 24 grid at full width.

// Light/dark lives on <html> as the `home-dark` class (set before paint by the
// layout's inline script, re-applied by RouteTheme on client nav), so it's read
// as an external store: no hydration mismatch, one source of truth. The choice
// is remembered per viewer in localStorage ("home-theme"). One of light/dark is
// always selected; the grid is a separate on/off switch on top of either.
type Theme = "light" | "dark";
const THEME_EVENT = "home-theme";
const theme = {
  subscribe(cb: () => void) {
    window.addEventListener(THEME_EVENT, cb);
    return () => window.removeEventListener(THEME_EVENT, cb);
  },
  get: (): Theme => (document.documentElement.classList.contains("home-dark") ? "dark" : "light"),
  server: (): Theme => "light",
  set(t: Theme) {
    document.documentElement.classList.toggle("home-dark", t === "dark");
    try {
      localStorage.setItem("home-theme", t);
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  },
};

const SECTION_GAP = "mt-[216px]";
const STICKY_TOP = 216; // where sections land under the fixed header

// Snappier than native smooth scroll (which scales with distance): a fixed
// ~420ms ease-out, whatever the distance.
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const from = window.scrollY;
  const to = el.getBoundingClientRect().top + from - STICKY_TOP;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return window.scrollTo(0, to);
  const start = performance.now();
  const dur = 420;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    const ease = 1 - Math.pow(1 - t, 3);
    window.scrollTo(0, from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Sidebar nav hover, as on the old homepage's featured list: an arrow grows in
// from the left and nudges the label right.
function NavArrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-0 overflow-hidden whitespace-nowrap transition-[width] duration-300 ease-out group-hover:w-6 group-focus-visible:w-6"
    >
      →
    </span>
  );
}

// "See more": the label stays put; the arrow slides in from the left beside it.
function SeeMore({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  if (disabled) return <span className="text-black/30">See more</span>;
  return (
    <button type="button" onClick={onClick} className="group relative cursor-pointer text-black">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-2 -translate-x-2 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        →
      </span>
      See more
    </button>
  );
}

function Tile({ children, ratio }: { children: ReactNode; ratio: string }) {
  return <div className={`${ratio} w-full overflow-hidden bg-black/[0.04]`}>{children}</div>;
}

// 24px toggle boxes. Selected = filled (black box, background-colored glyph);
// dark mode flips the tokens, so the whole strip inverts with the page.
function ToggleButton({
  label,
  on,
  onClick,
  className = "",
  children,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-6 w-6 cursor-pointer items-center justify-center ${
        on ? "bg-black text-[var(--background)]" : "text-black hover:bg-black/10"
      } ${className}`}
    >
      {children}
    </button>
  );
}

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    {[0.6, 5.4, 10.2].flatMap((x) =>
      [0.6, 5.4, 10.2].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="3.2" height="3.2" />),
    )}
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <circle cx="7" cy="7" r="2.9" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <rect key={a} x="6.35" y="0.4" width="1.3" height="1.9" transform={`rotate(${a} 7 7)`} />
    ))}
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <path d="M8.9 1.1A5.9 5.9 0 1 0 12.9 9.6 4.7 4.7 0 0 1 8.9 1.1Z" />
  </svg>
);

export function HomeShell() {
  const current = useSyncExternalStore(theme.subscribe, theme.get, theme.server);
  const [grid, setGrid] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const closePanel = useCallback(() => setPanel(null), []);
  // opening a case study turns the grid off (it fights the panel), and it stays off
  const openPanel = (slug: string) => {
    setGrid(false);
    setPanel(slug);
  };

  const navItem = (label: string, id: string, extra?: ReactNode) => (
    <li key={id}>
      <button
        type="button"
        onClick={() => scrollToId(id)}
        className="group inline-flex cursor-pointer items-center text-black"
      >
        <NavArrow />
        {label}
        {extra}
      </button>
    </li>
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] px-3 pb-[216px] pt-[120px] text-base leading-6 lg:pt-[216px]">
        <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
          {/* table of contents, columns 1-3 */}
          <nav aria-label="Sections" className="sticky top-[216px] hidden self-start lg:col-span-3 lg:block">
            <p className="text-black/60">Branding</p>
            <ul className="pl-6">
              {CASE_STUDIES.map((c) =>
                navItem(
                  c.title,
                  c.slug,
                  getProject(c.slug)?.status === "Spec" ? (
                    <span className="ml-2 rounded-full border border-black/30 px-1.5 text-[10px] uppercase leading-4 text-black/60">
                      Spec
                    </span>
                  ) : undefined,
                ),
              )}
            </ul>
            <ul>
              {navItem("Marks", "marks")}
              {navItem("Motion", "motion")}
              {navItem("Other Work", "other-work")}
              <li>
                <Link href="/about" className="group inline-flex items-center text-black">
                  <NavArrow />
                  About
                </Link>
              </li>
            </ul>
          </nav>

          {/* the work, columns 4-11 */}
          <main className="lg:col-span-8 lg:col-start-4">
            <div className="space-y-[144px]">
              {CASE_STUDIES.map((c) => (
                <section key={c.slug} id={c.slug}>
                  <div className="flex h-6 items-center justify-between">
                    <h2 className="text-black/60">{c.title}</h2>
                    <SeeMore onClick={() => openPanel(c.slug)} />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6">
                    {c.images.map((img) => (
                      <Tile key={img.src} ratio="aspect-[456/264]">
                        <Media img={img} className="h-full w-full object-cover" />
                      </Tile>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* logo wall: three across (breaks the columns on purpose) */}
            <section id="marks" className={SECTION_GAP}>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-[72px] sm:gap-y-[72px]">
                {MARKS.map((m, i) => (
                  <li key={`${m.src}-${i}`} className="sm:pb-6">
                    <p className="h-6 text-black/60">{m.label}</p>
                    <div className="mt-6 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.src}
                        alt={`${m.label} logo`}
                        className={`h-full w-full object-contain ${m.darkSrc ? "mark-light" : "mark-img"}`}
                      />
                      {m.darkSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.darkSrc} alt="" aria-hidden="true" className="mark-dark h-full w-full object-contain" />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* motion: three across, 9:16-ish tiles */}
            <section id="motion" className={SECTION_GAP}>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-[72px] sm:gap-y-[72px]">
                {MOTION_REEL.map((m) => (
                  <li key={m.img.src}>
                    <p className="h-6 text-black/60">{m.label}</p>
                    <div className="mt-6">
                      <Tile ratio="aspect-[264/456]">
                        <Media img={m.img} className="h-full w-full object-cover" />
                      </Tile>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* other work: one-offs, placeholders for now */}
            <section id="other-work" className={SECTION_GAP}>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {OTHER_WORK.map((w, i) => (
                  <li key={i}>
                    <div className="flex h-6 items-center justify-between">
                      <p className="text-black/60">{w.title}</p>
                      <SeeMore disabled />
                    </div>
                    <div className="mt-6">
                      <Tile ratio="aspect-[456/264]">
                        <span className="sr-only">Placeholder</span>
                      </Tile>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          {/* toggles, column 12: grid on/off, then light | dark (one always on) */}
          <div className="sticky top-[216px] hidden self-start lg:col-start-12 lg:flex">
            <ToggleButton
              label="Layout grid"
              on={grid}
              onClick={() => setGrid((g) => !g)}
              className="hidden min-[1440px]:flex"
            >
              <GridIcon />
            </ToggleButton>
            <ToggleButton label="Light mode" on={current === "light"} onClick={() => theme.set("light")}>
              <SunIcon />
            </ToggleButton>
            <ToggleButton label="Dark mode" on={current === "dark"} onClick={() => theme.set("dark")}>
              <MoonIcon />
            </ToggleButton>
          </div>
        </div>
      </div>

      {/* 24/72 grid, anchored to the 1416 content edge; only at full width,
          where the layout sits exactly on it */}
      <div className="hidden min-[1440px]:block">
        <GridOverlay show={grid} maxWidth={1440} gutter={12} />
      </div>

      <CaseStudyPanel slug={panel} onClose={closePanel} />
    </>
  );
}
