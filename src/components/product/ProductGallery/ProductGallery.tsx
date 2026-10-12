"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageBroken } from "@phosphor-icons/react";

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string | null }[];
  productName: string;
}

/** Main image in an ink frame with a numbered thumbnail column (row on mobile). */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] border-2 border-line-strong bg-surface-1 flex flex-col items-center justify-center gap-2 text-ink-subtle">
        <ImageBroken size={40} />
        <span className="u-cond text-sm">No image supplied</span>
      </div>
    );
  }

  const current = images[selectedIndex];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {images.length > 1 && (
        <ol className="list-none m-0 p-0 flex md:flex-col gap-2 overflow-auto md:max-h-[520px] no-scrollbar">
          {images.map((image, index) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                className={`relative block w-16 h-16 md:w-[76px] md:h-[76px] bg-white cursor-pointer border-2 ${
                  index === selectedIndex ? "border-coal outline-2 outline-hivis -outline-offset-4" : "border-line hover:border-line-strong"
                }`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`${productName} — image ${index + 1}`}
                aria-current={index === selectedIndex}
              >
                <Image src={image.url} alt="" fill sizes="76px" className="object-contain p-1" />
                <span className="absolute left-0 bottom-0 bg-coal text-white font-mono text-[0.6rem] leading-none px-1 py-0.5">
                  {index + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      <figure className="relative flex-1 m-0 aspect-square sm:aspect-[4/3] bg-white border-2 border-line-strong">
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain p-4 sm:p-8"
          priority
        />
        {images.length > 1 && (
          <figcaption className="absolute right-0 top-0 bg-coal text-hivis font-mono text-xs px-2 py-1">
            {selectedIndex + 1}/{images.length}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
