import type { Metadata } from "next";
import Image from "next/image";
import { bio } from "@/lib/about";

export const metadata: Metadata = { title: "About — Alexander Prins" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-2">
      <div className="relative mb-8 aspect-square w-40 overflow-hidden bg-black/[0.04]">
        <Image
          src="/headshot.jpg"
          alt="Alexander Prins"
          fill
          sizes="160px"
          className="object-cover"
        />
      </div>
      <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">About</h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-black/80">
        {bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </main>
  );
}
