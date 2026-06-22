import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { CtaEmail } from "@/components/CtaEmail";

const LINKEDIN = "https://www.linkedin.com/in/alexander-prins-81694a259/";
// TODO: real GitHub URL once the account exists (pushing this repo there
// publicly would be strong proof for an AI-native role).
const GITHUB = "#";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-6">
      {/* CTA: the email is the statement (no form). Shown openly, not hover. */}
      <div className="border-t border-black/10 py-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
          Get in touch
        </p>
        <CtaEmail />
      </div>

      {/* bottom bar: legal left, P/D/S middle, socials right */}
      <div className="flex flex-col items-center gap-4 border-t border-black/10 py-8 font-mono text-[11px] uppercase tracking-[0.08em] text-black/40 sm:flex-row sm:justify-between">
        <span>&copy; Alexander Prins 2026, All Rights Reserved</span>
        <span className="hidden sm:inline">Play | Discover | Systematize</span>
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
