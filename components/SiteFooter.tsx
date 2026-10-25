"use client";

import { usePathname } from "next/navigation";
import { isHomeLayout } from "@/lib/home";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { CtaEmail } from "@/components/CtaEmail";
import { CtaResume } from "@/components/CtaResume";
import { ColophonButton } from "@/components/ColophonButton";

const LINKEDIN = "https://www.linkedin.com/in/alexander-prins-81694a259/";
const GITHUB = "https://github.com/alexanderprins";

export function SiteFooter() {
  // homepage: the 1416 grid (1440 frame, 12px margins); other pages keep the
  // original frame until they move to the new grid
  const home = isHomeLayout(usePathname());
  return (
    // max-w-[1488px] + px-6 -> a 1440 content column that matches the grid
    // overlay and the rest of the site chrome (header, page mains).
    <footer className={`mx-auto w-full ${home ? "max-w-[1440px] px-3" : "max-w-[1488px] px-6"}`}>
      {/* CTA: the email is the statement (no form). Shown openly, not hover.
          py is a grid multiple (72 = 3 majors) to keep the block on the grid. */}
      <div className="[box-shadow:inset_0_1px_0_color-mix(in_srgb,var(--color-black)_10%,transparent)] py-[72px] text-center text-sm leading-6">
        <p className="text-sm leading-6 text-black/60">Get in touch</p>
        <CtaEmail />
        {/* job pages only: their tailored resume, directly below the email */}
        <div>
          <CtaResume />
        </div>
      </div>

      {/* bottom bar: 3 equal columns so legal pins to the far-left grid edge,
          P/D/S is truly page-centered, and "Made with" + socials pin to the far-right edge. */}
      <div className="grid grid-cols-1 justify-items-center gap-4 [box-shadow:inset_0_1px_0_color-mix(in_srgb,var(--color-black)_10%,transparent)] py-6 text-sm leading-6 text-black/60 sm:grid-cols-3 sm:items-center">
        <span className="sm:justify-self-start">&copy; Alexander Prins 2026, All Rights Reserved</span>
        <span className="hidden items-center gap-3 text-sm sm:flex sm:justify-self-center">
          <span className="flex items-center gap-1.5">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true"><circle cx="4.5" cy="4.5" r="4.5"/></svg>
            Play
          </span>
          <span>|</span>
          <span className="flex items-center gap-1.5">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true"><rect width="8" height="8"/></svg>
            Discover
          </span>
          <span>|</span>
          <span className="flex items-center gap-1.5">
            <svg width="9" height="8" viewBox="0 0 9 8" fill="currentColor" aria-hidden="true"><polygon points="4.5,0 9,8 0,8"/></svg>
            Systematize
          </span>
        </span>
        <div className="flex items-center gap-4 sm:justify-self-end">
          <ColophonButton placement="up" />
          <a
            href={LINKEDIN}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={GITHUB}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
