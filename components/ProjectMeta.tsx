import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

function MetaList({
  icon,
  label,
  items,
}: {
  icon: ReactNode;
  label: string;
  items: string[];
}) {
  return (
    <div>
      {/* title/icon box with bottom line; icon 8px from label */}
      <div className="flex items-center gap-2 border-b border-black/15 pb-1 text-black/60">
        {icon}
        <span className="font-mono text-xs uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>
      {/* 12px from the title box to the list */}
      <ul className="mt-3 space-y-1 text-sm text-black/60">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  return (
    // Skills list 72px from Tools list
    <div className="flex flex-col gap-[72px]">
      <MetaList
        icon={
          // Custom SVGs live in /public. eslint-disable-next-line keeps the
          // Next <img> lint quiet — these are tiny fixed-size chrome icons.
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/fingerprint.svg" alt="" className="h-[18px] w-auto" />
        }
        label="Skills"
        items={project.disciplines}
      />
      <MetaList
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/tools.svg" alt="" className="h-[18px] w-auto" />
        }
        label="Tools"
        items={project.tools}
      />
    </div>
  );
}
