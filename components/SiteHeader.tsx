import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EmailCopy } from "@/components/EmailCopy";
import { ColophonButton } from "@/components/ColophonButton";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-8">
      {/* No opacity dim on hover: the logo's shape re-composition (globals.css
          .logo-mark) IS the hover feedback. */}
      <Link href="/" aria-label="Home" className="text-black">
        <Logo size={28} />
      </Link>
      <nav className="flex items-center">
        <ColophonButton />
        <span className="mx-6 h-3.5 w-px bg-black/20" aria-hidden="true" />
        <div className="flex items-center gap-6">
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
      </nav>
    </header>
  );
}
