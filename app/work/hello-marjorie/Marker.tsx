// One interest-point dot, built like the Figma model:
//   Frame A (.hm-marker-hit) = a fixed 44x44 hit target. It's the SOLE Motion
//     element (direct child of the stagger container) and owns positioning + the
//     staggered pop-in (opacity + scale). It never scales on hover.
//   Frame B (.hm-marker) = the visible 20px dot + number, centered inside A.
//     Its hover/tap scale is plain CSS (see annotationCss) — a fixed hit target +
//     a non-spring CSS transition can't wobble, and keeping B out of Motion means
//     A stays the single Motion child, so the stagger propagates cleanly.

import { motion, type Transition } from "motion/react";
import type { Annotation } from "./annotations";

const hitVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1 },
};

export function Marker({
  annotation,
  active,
  onSelect,
  entrance,
}: {
  annotation: Annotation;
  active: boolean;
  onSelect: (id: string) => void;
  entrance: Transition;
}) {
  return (
    <motion.button
      type="button"
      className="hm-marker-hit"
      style={{ left: annotation.x, top: annotation.y, x: "-50%", y: "-50%" }}
      aria-label={annotation.title}
      variants={hitVariants}
      transition={entrance}
      onClick={(e) => {
        e.stopPropagation(); // don't bubble to the flip
        onSelect(annotation.id);
      }}
    >
      <span className={`hm-marker${active ? " is-active" : ""}`}>
        {annotation.n}
      </span>
    </motion.button>
  );
}
