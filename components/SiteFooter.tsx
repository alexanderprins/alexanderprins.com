import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { CtaEmail } from "@/components/CtaEmail";

const LINKEDIN = "https://www.linkedin.com/in/alexander-prins-81694a259/";
const GITHUB = "https://github.com/alexanderprins";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-6">
      {/* CTA: the email is the statement (no form). Shown openly, not hover. */}
      <div className="border-t border-black/10 py-20 text-center">
        <p className="text-sm text-black/60">Get in touch</p>
        <CtaEmail />
      </div>

      {/* bottom bar: legal left, P/D/S middle, socials right */}
      <div className="flex flex-col items-center gap-4 border-t border-black/10 py-8 text-sm text-black/60 sm:flex-row sm:justify-between">
        <span>&copy; Alexander Prins 2026, All Rights Reserved</span>
        <span className="hidden items-center gap-3 text-sm sm:inline-flex">
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
            Systemize
          </span>
        </span>
        <div className="flex items-center gap-4">
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
