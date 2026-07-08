import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

// Project-page meta cell: plain heading (no mono, no line), body beneath.
function MetaColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-black">{label}</h2>
      <div className="space-y-1 text-sm leading-relaxed text-black/60">
        {children}
      </div>
    </div>
  );
}

// Case-study writeup on the left (Scope / Role / Impact), a wide gap, then
// Skills + Tools grouped tight on the far right. Used only on /work/[slug].
export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
      {/* the writeup — three columns, takes the left */}
      <div className="grid w-full max-w-[760px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
        <MetaColumn label="Scope">
          <p>{project.description}</p>
        </MetaColumn>
        <MetaColumn label="Role">
          <p>{project.role}</p>
        </MetaColumn>
        {/* Impact copy. The client testimonial (when present) renders as its
            own callout block below this row, in app/work/[slug]/page.tsx. */}
        <MetaColumn label="Impact">
          <p>{project.impact}</p>
        </MetaColumn>
      </div>
      {/* Skills + Tools — grouped tight, aligned far right */}
      <div className="flex gap-12">
        <MetaColumn label="Skills">
          <ul className="space-y-1">
            {project.disciplines.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </MetaColumn>
        <MetaColumn label="Tools">
          <ul className="space-y-1">
            {project.tools.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </MetaColumn>
      </div>
    </div>
  );
}
