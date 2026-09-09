"use client";

// Scene-setting photo gallery for the top of the study: a column of thumbnails +
// a large 4:5 portrait main image. Selecting a thumbnail swaps the main image
// INSTANTLY (no transition) — the thumbs load the same files, so every photo is
// already cached by the time you click. Selected thumb gets a gray (#757575) box.

import { useState } from "react";

const PHOTOS = [1, 2, 3, 4, 5].map((n) => `/work/hello-marjorie/photos/${n}.jpg`);

export function MenuGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full items-start gap-2 lg:w-auto">
      {/* thumbnail column */}
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

      {/* main image + caption (8px below the image, in flow). Fluid up to 432px
          so it fits narrow screens; fixed 432 on desktop. */}
      <figure className="min-w-0 flex-1 lg:flex-none">
        <div
          className="w-full overflow-hidden lg:w-[432px]"
          style={{ aspectRatio: "4 / 5" }}
        >
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
  );
}
