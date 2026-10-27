// Craft grid overlay: a minor grid (default 24px) + a major grid (default 72px),
// anchored to the content column (centered `maxWidth`, 24px = px-6 gutters) so
// the lines start at the content's left edge. Lines use var(--color-black) via
// color-mix, so they adapt to light/dark. pointer-events:none. Positioned
// `absolute` (not fixed) inside the `relative` <body>, so it spans the full
// document height and scrolls WITH the page, starting at the document top.
// `behind`: the furthest-back layer instead of on top. z-index -1 in the root
// stacking context paints over the page color (body's background goes to the
// canvas) but under every bit of content, so images and panels cover it.
export function GridOverlay({
  show,
  minor = 24,
  major = 72,
  maxWidth = 1488, // -> 1440 content = 20 clean major blocks (60 minor cells)
  gutter = 24, // px-6
  behind = false,
}: {
  show: boolean;
  minor?: number;
  major?: number;
  maxWidth?: number;
  gutter?: number;
  behind?: boolean;
}) {
  if (!show) return null;

  const majorLine = "color-mix(in srgb, var(--color-black) 15%, transparent)";
  const minorLine = "color-mix(in srgb, var(--color-black) 7%, transparent)";

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: behind ? -1 : 50, pointerEvents: "none" }}
    >
      {/* matches the page's `mx-auto max-w-[1440px] px-6` content column */}
      <div
        style={{
          height: "100%",
          maxWidth,
          margin: "0 auto",
          paddingLeft: gutter,
          paddingRight: gutter,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundImage: [
              `linear-gradient(to right, ${majorLine} 0 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${majorLine} 0 1px, transparent 1px)`,
              `linear-gradient(to right, ${minorLine} 0 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${minorLine} 0 1px, transparent 1px)`,
            ].join(", "),
            backgroundSize: `${major}px ${major}px, ${major}px ${major}px, ${minor}px ${minor}px, ${minor}px ${minor}px`,
          }}
        />
      </div>
    </div>
  );
}
