"use client";

import { useCallback, useEffect, useState } from "react";

// Carousel-style auto-advance: steps through `count` items every `ms`.
// select(i) jumps to an item AND restarts the clock, so a click "takes over"
// for a full interval before auto-advance resumes. `paused` stops the clock
// (used for prefers-reduced-motion).
export function useCycle(count: number, ms: number, paused = false) {
  const [index, setIndex] = useState(0);
  const [nonce, setNonce] = useState(0); // bumps on every select, even to the same item

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), ms);
    return () => clearTimeout(t);
  }, [index, nonce, count, ms, paused]);

  const select = useCallback((i: number) => {
    setIndex(i);
    setNonce((n) => n + 1);
  }, []);

  return [index, select] as const;
}
