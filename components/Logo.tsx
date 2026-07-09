// Inlined logomark: bounding box + the three Bauhaus shapes (circle, square,
// triangle), each individually targetable for the hover micro-animation and
// the Play / Discover / Systematize concept later. Uses currentColor so it
// adapts to light/dark surfaces. Negative space is transparent (no fill bg).
//
// The hover re-composition (reference: context/Logo Hover.mov) lives in
// globals.css under .logo-mark. Both rest and hover transforms are CSS, so
// the square's rest rotation is declared there, NOT as an SVG attribute
// (a CSS transform would silently override an attribute transform and break
// the rest state). Its x/y below place it unrotated at the same center the
// old rotate(17.58 232.164 178.584) attribute produced.
export function Logo({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 416 416"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Alexander Prins logomark"
      className={`logo-mark ${className}`}
    >
      <rect
        data-shape="frame"
        x="9.07227"
        y="7.31201"
        width="400"
        height="400"
        stroke="currentColor"
        strokeWidth="16"
      />
      <rect
        data-shape="square"
        x="200.78"
        y="201.56"
        width="180"
        height="180"
        fill="currentColor"
      />
      <path
        data-shape="circle"
        d="M107.828 182.137C159.361 182.137 201.271 224.045 201.271 275.577C201.271 327.11 159.361 369.018 107.828 369.018V369.047C56.2942 369.047 14.3855 327.139 14.3853 275.606C14.3853 224.074 56.2941 182.137 107.828 182.137Z"
        fill="currentColor"
      />
      <path
        data-shape="triangle"
        d="M156.93 8.41017L171.443 221.005L335.712 124.359L156.93 8.41017Z"
        fill="currentColor"
      />
    </svg>
  );
}
