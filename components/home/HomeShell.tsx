"use client";

import { Fragment, useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Media } from "@/components/Media";
import { GridOverlay } from "@/components/GridOverlay";
import { CaseStudyPanel } from "@/components/home/CaseStudyPanel";
import { getProject } from "@/lib/projects";
import { VideoFigure } from "@/components/VideoFigure";
import { CASE_STUDIES, HOME_SECTIONS, MARKS, OTHER_WORK, homeCaseSlug, type HomeJob, type HomeSection } from "@/lib/home";
import { MOTION_REEL } from "@/lib/motionReel";

// The single-scroll homepage on the 1416 grid: 12 columns (96 + 24 gutters),
// centered in 1440 with 12px margins. Columns 1-3 hold the table-of-contents nav,
// 4-11 the work, 12 the grid/light/dark toggles; the nav and toggles stay put
// (sticky) while the work scrolls. Vertical rhythm is 24/72: 24 gaps (label to image: 12), 144
// between case studies, 216 between sections. Image heights scale from their
// 1440 sizes (456x264 tiles, 264x264 marks, 264x456 motion) so every box lands
// on the 24 grid at full width.

// Always dark (Noah Stokes, 2026-10-26: "the work pops better"): the
// `home-dark` class on <html>, set before paint by the layout's inline script
// and kept in step by RouteTheme. Only /logos keeps a light/dark toggle.

// phones get tighter gaps than the 144/216 desktop rhythm (72/144)
const SECTION_GAP = "mt-[144px] lg:mt-[216px]";

// Other Work can be switched off (section + nav link) while it's thin.
const SHOW_OTHER_WORK = true;

// Phones have no sidebar, so each section gets its sidebar name as a title.
function MobileTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-6 h-6 text-black lg:hidden">{children}</h2>;
}

// The open case study is the URL (/work/<slug>, see lib/home.ts). Opening pushes
// it; closing goes Back when this page pushed it (so Back/Forward stay in step),
// else swaps it for "/" (a direct visit to /work/<slug>).
let pushedHere = false;
function openCase(slug: string) {
  pushedHere = true;
  window.history.pushState(null, "", `/work/${slug}`);
}
function closeCase() {
  if (pushedHere) {
    pushedHere = false;
    window.history.back();
  } else {
    window.history.replaceState(null, "", "/");
  }
}
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
// A button (opens the panel) or, with `href`, a link to a page of its own.
function SeeMore({ onClick, href }: { onClick?: () => void; href?: string }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-2 -translate-x-2 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        →
      </span>
      See more
    </>
  );
  const cls = "group relative shrink-0 cursor-pointer text-black";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
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

const SECTION_LABEL: Record<HomeSection, string> = {
  marks: "Marks",
  motion: "Motion",
  "other-work": "Other Work",
};

// `job`: a job page on this layout (/ambrook). It reorders the case studies and
// later sections and adds its intro video: sticky in the sidebar above the nav on
// desktop (there while the work scrolls, never in front of it), and after the
// case studies on phones (work first). No job = the homepage.
export function HomeShell({ job }: { job?: HomeJob }) {
  const [grid, setGrid] = useState(false);
  const panel = homeCaseSlug(usePathname());
  const closePanel = useCallback(() => closeCase(), []);
  // opening a case study turns the grid off (it fights the panel), and it stays
  // off; it also pauses the intro video so it doesn't talk under the panel
  const openPanel = (slug: string) => {
    setGrid(false);
    document.querySelectorAll("video[controls]").forEach((v) => (v as HTMLVideoElement).pause());
    openCase(slug);
  };
  const baseTitle = job ? `Alexander Prins for ${job.company}` : "Alexander Prins";
  // the tab title follows the panel (Next only sets it on real navigations)
  useEffect(() => {
    const p = panel ? getProject(panel) : undefined;
    document.title = p ? `${p.title} — Alexander Prins` : baseTitle;
  }, [panel, baseTitle]);

  const cases = job ? job.caseOrder.flatMap((slug) => CASE_STUDIES.filter((c) => c.slug === slug)) : CASE_STUDIES;
  const sections = (job?.sections ?? HOME_SECTIONS).filter((id) => id !== "other-work" || SHOW_OTHER_WORK);

  // the sections after the case studies, placed in `sections` order
  const later: Record<HomeSection, ReactNode> = {
    marks: (
      <Fragment key="marks">
        {/* logo wall: three across (breaks the columns on purpose) */}
        <section id="marks" className={SECTION_GAP}>
          <MobileTitle>Marks</MobileTitle>
          <ul className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[72px] sm:gap-y-[72px]">
            {MARKS.map((m, i) => (
              <li key={`${m.src}-${i}`} className="sm:pb-6">
                <p className="h-6 truncate text-black/60">{m.label}</p>
                {/* phones: one mark per row, inset to 75% (centered) for air */}
                <div className="mt-3 aspect-square p-[12.5%] sm:p-0">
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
      </Fragment>
    ),
    motion: (
      <Fragment key="motion">
        {/* motion: three across, 9:16-ish tiles */}
        <section id="motion" className={SECTION_GAP}>
          <MobileTitle>Motion</MobileTitle>
          <ul className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[72px] sm:gap-y-[72px]">
            {MOTION_REEL.map((m) => (
              <li key={m.img.src}>
                <p className="h-6 truncate text-black/60">{m.label}</p>
                <div className="mt-3">
                  <Tile ratio="aspect-[264/456]">
                    <Media img={m.img} className="h-full w-full object-cover" />
                  </Tile>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Fragment>
    ),
    "other-work": (
      <Fragment key="other-work">
                  {/* other work: one-offs, placeholders for now */}
        <section id="other-work" className={SECTION_GAP}>
          <MobileTitle>Other Work</MobileTitle>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {OTHER_WORK.map((w, i) => {
              const tile = (
                <Tile ratio="aspect-[456/264]">
                  {w.img ? (
                    <Media img={w.img} className="h-full w-full object-cover" />
                  ) : (
                    <span className="sr-only">Placeholder</span>
                  )}
                </Tile>
              );
              return (
                <li key={i}>
                  <div className="flex h-6 items-center justify-between gap-6">
                    <p className="truncate text-black/60">{w.title}</p>
                    {/* only pieces with a page of their own get "See more" */}
                  {w.href ? <SeeMore href={w.href} /> : null}
                  </div>
                  <div className="mt-3">
                    {w.href ? (
                      <Link href={w.href} tabIndex={-1} aria-label={w.title} className="block">
                        {tile}
                      </Link>
                    ) : (
                      tile
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </Fragment>
    ),
  };

  const navItem = (label: string, id: string) => (
    <li key={id}>
      <button
        type="button"
        onClick={() => scrollToId(id)}
        className="group inline-flex cursor-pointer items-center text-black"
      >
        <NavArrow />
        {label}
      </button>
    </li>
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-[144px] pt-[120px] text-base leading-6 lg:px-3 lg:pb-[216px] lg:pt-[216px]">
        <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
          {/* table of contents (+ a job page's intro video), columns 1-3 */}
          <div className="sticky top-[216px] hidden self-start lg:col-span-3 lg:block">
            {/* fixed at 4 major rows (288) so the nav below always starts on a
                72 line (504), whatever the video's height at this width */}
            {job ? (
              <div className="h-[288px]">
                <p className="h-6 truncate text-black/60">{job.greeting}</p>
                <div className="mt-3">
                  <VideoFigure video={job.video} showCaption={false} />
                </div>
              </div>
            ) : null}
            <nav aria-label="Sections">
              <p className="text-black/60">Featured Branding</p>
              <ul className="pl-6">
                {cases.map((c) =>
                  navItem(c.title, c.slug),
                )}
              </ul>
              <ul>
                {sections.map((id) => navItem(SECTION_LABEL[id], id))}
                <li>
                  <Link href="/about" className="group inline-flex items-center text-black">
                    <NavArrow />
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* the work, columns 4-11 */}
          <main className="lg:col-span-8 lg:col-start-4">
            <MobileTitle>Featured Branding</MobileTitle>
            <div className="space-y-[72px] lg:space-y-[144px]">
              {cases.map((c) => (
                <section key={c.slug} id={c.slug}>
                  <div className="flex h-6 items-center justify-between gap-6">
                    <h2 className="truncate text-black/60">{c.title}</h2>
                    <SeeMore onClick={() => openPanel(c.slug)} />
                  </div>
                  {/* the tiles open the case study too (the big target on phones).
                      Phones: one column, so every image is as big as it can be. */}
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                    {c.images.map((img) => (
                      <button
                        key={img.src}
                        type="button"
                        tabIndex={-1}
                        aria-label={`${c.title} case study`}
                        onClick={() => openPanel(c.slug)}
                        className="block cursor-pointer"
                      >
                        <Tile ratio="aspect-[456/264]">
                          <Media img={img} className="h-full w-full object-cover" />
                        </Tile>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* a job page's intro video on phones: after the case studies */}
            {job ? (
              <section className={`${SECTION_GAP} lg:hidden`}>
                <MobileTitle>{job.greeting}</MobileTitle>
                <VideoFigure video={job.video} showCaption={false} />
              </section>
            ) : null}

            {sections.map((id) => later[id])}
          </main>

          {/* column 12: the layout-grid toggle (full width only) */}
          <div className="sticky top-[216px] hidden self-start lg:col-start-12 lg:flex">
            <ToggleButton
              label="Layout grid"
              on={grid}
              onClick={() => setGrid((g) => !g)}
              className="hidden min-[1440px]:flex"
            >
              <GridIcon />
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
