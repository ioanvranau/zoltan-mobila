"use client";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { BlurImage } from "@/components/ui/BlurImage";

export function GalleryLightbox({ photos, alt }: { photos: string[]; alt: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setOpenAt(i)}
            className="relative aspect-square overflow-hidden rounded-xl bg-bg-elevated"
            aria-label={`Deschide foto ${i + 1}`}
          >
            <BlurImage
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 220px, 33vw"
              className="object-cover transition-transform duration-[600ms] ease-out motion-safe:hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={openAt !== null}
        index={openAt ?? 0}
        close={() => setOpenAt(null)}
        slides={photos.map((src) => ({ src }))}
      />
    </>
  );
}
