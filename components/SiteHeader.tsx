import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EmailCopy } from "@/components/EmailCopy";
import { ColophonButton } from "@/components/ColophonButton";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 pt-8">
      <Link href="/" aria-label="Home" className="text-black hover:opacity-70">
        <Logo size={28} />
      </Link>
      <nav className="flex items-center">
        <ColophonButton />
        <span className="mx-6 h-3.5 w-px bg-black/20" aria-hidden="true" />
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/50 hover:text-black"
          >
            About
          </Link>
          <EmailCopy />
        </div>
      </nav>
    </header>
  );
}
