"use client";

import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { RESUMES, resumeDownloadName, resumeFile } from "@/lib/resumes";

// Footer CTA, second line: the tailored resume for this job page, styled to
// match CtaEmail (same type, icon mirrors its copy icon). Only renders on job
// pages that have a resume in lib/resumes.ts. The URL path is neutral (no company).
export function CtaResume() {
  const slug = usePathname().replace(/^\/|\/$/g, "");
  if (!RESUMES[slug]) return null;

  return (
    <a
      href={resumeFile(slug)}
      download={resumeDownloadName}
      className="group mt-1 inline-flex items-center gap-2 font-serif text-sm font-medium text-black"
    >
      <span>Download resume</span>
      <span className="text-black/40 transition-colors group-hover:text-black">
        <Download size={14} />
      </span>
    </a>
  );
}
