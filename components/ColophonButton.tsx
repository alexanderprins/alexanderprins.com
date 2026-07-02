import { ClaudeCrab } from "@/components/ClaudeCrab";

// "Made with [crab]" colophon. Hover-only (purely informational, no user
// action). Crab is ink, turns #FF6A3D on hover. The popover sits flush under
// the trigger (top-full + a transparent pt bridge) so the hover doesn't drop.
export function ColophonButton() {
  return (
    <div className="group relative">
      <div className="flex items-center gap-2 font-mono text-sm text-black/60">
        <span>Made with</span>
        <span className="text-black transition-colors duration-200 group-hover:text-[#FF6A3D]">
          <ClaudeCrab />
        </span>
      </div>
      <div className="invisible absolute right-0 top-full z-10 w-72 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
        <div className="border border-black/10 bg-white p-4 shadow-sm">
          <p className="flex items-center gap-2 font-mono text-sm text-black/60">
            <span className="text-[#FF6A3D]">
              <ClaudeCrab />
            </span>
            Built with Claude Code
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/60">
            This site was proudly designed and built with Claude Code, run in
            the terminal. It&rsquo;s a Next.js app (React, TypeScript, Tailwind)
            with licensed type, deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
