"use client";

// Scene-setting bar photos.
//   Desktop: a thumbnail column + a large 4:5 main image (click a thumb to swap).
//   Mobile:  a full-width swipe carousel with a pagination pill — the active dot
//            is brightest and the rest fade by distance from it.

import { useRef, useState } from "react";

const PHOTOS = [1, 2, 3, 4, 5].map((n) => `/work/hello-marjorie/photos/${n}.jpg`);

// dot brightness by distance from the active slide (0 = active)
const DOT_OPACITY = [1, 0.6, 0.42, 0.3, 0.24];

export function MenuGallery() {
  const [active, setActive] = useState(0); // desktop main image
  const [slide, setSlide] = useState(0); // mobile carousel index
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      {/* MOBILE: swipe carousel + pagination pill */}
      <figure className="w-full lg:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            style={{ scrollbarWidth: "none" }}
            className="flex snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {PHOTOS.map((src) => (
              <div
                key={src}
                className="w-full shrink-0 snap-center overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2.5"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                onClick={() => goTo(i)}
                className="h-2.5 w-2.5 rounded-full transition-[background-color] duration-200"
                style={{
                  backgroundColor: `rgba(255,255,255,${
                    DOT_OPACITY[Math.min(Math.abs(i - slide), DOT_OPACITY.length - 1)]
                  })`,
                }}
              />
            ))}
          </div>
        </div>
        <figcaption className="mt-2 text-sm italic leading-6 text-black/60">
          All photography by me
        </figcaption>
      </figure>

      {/* DESKTOP: thumbnail column + main image */}
      <div className="hidden items-start gap-2 lg:flex">
        <div className="flex flex-col gap-2">
          {PHOTOS.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              style={{ width: 44, height: 44 }}
              className={`block shrink-0 overflow-hidden ${
                i === active
                  ? "outline outline-1 outline-offset-2 outline-[#757575]"
                  : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <figure>
          <div className="w-[432px] overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[active]}
              alt="Hello, Marjorie bar"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-2 whitespace-nowrap text-sm italic leading-6 text-black/60">
            All photography by me
          </figcaption>
        </figure>
      </div>
    </>
  );
}
