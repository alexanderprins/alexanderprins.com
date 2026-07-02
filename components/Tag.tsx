// Minimal tag chip. Square corners (only the project status pill is rounded).
export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block border border-black/15 px-2.5 py-0.5 text-sm text-black/60">
      {label}
    </span>
  );
}
