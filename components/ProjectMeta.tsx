import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";
import { Fingerprint, Wrench } from "lucide-react";

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
      <div className="flex items-center gap-2 border-b border-black/15 pb-1 text-black/70">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>
      {/* 12px from the title box to the list */}
      <ul className="mt-3 space-y-1 text-sm text-black/70">
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
        icon={<Fingerprint size={18} strokeWidth={1.5} />}
        label="Skills"
        items={project.disciplines}
      />
      <MetaList
        icon={<Wrench size={18} strokeWidth={1.5} />}
        label="Tools"
        items={project.tools}
      />
    </div>
  );
}
