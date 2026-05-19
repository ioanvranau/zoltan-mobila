"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { MaterialSwatch } from "@/data/types";
import { projectBySlug } from "@/data/projects";
import { BlurImage } from "@/components/ui/BlurImage";
import { GhostButton } from "@/components/ui/GhostButton";

export function SwatchModal({ swatch, onClose }: { swatch: MaterialSwatch; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const examples = swatch.exampleProjectSlugs.map(projectBySlug).filter(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swatch-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
    >
      <button
        aria-label="Închide"
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-3xl bg-bg-elevated text-text rounded-t-2xl md:rounded-2xl border border-line max-h-[90vh] overflow-y-auto">
        <button
          aria-label="Închide"
          onClick={onClose}
          className="absolute right-4 top-4 h-11 w-11 flex items-center justify-center text-text-muted hover:text-text z-10"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <div className="grid md:grid-cols-[1fr_1fr]">
          <div className="aspect-square w-full relative">
            {swatch.swatchType === "photo" && swatch.swatchSrc ? (
              <BlurImage
                src={swatch.swatchSrc}
                alt={swatch.name}
                fill
                sizes="(min-width:768px) 384px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: swatch.swatchCss }} />
            )}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{swatch.tag}</p>
            <h2 id="swatch-title" className="mt-2 font-display text-title">{swatch.name}</h2>
            {swatch.description && (
              <p className="mt-3 text-text-muted">{swatch.description}</p>
            )}
            {examples.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-text-muted">Folosit în:</p>
                <ul className="mt-2 space-y-1">
                  {examples.map((p) => (
                    <li key={p!.slug}>
                      <GhostButton href={`/portofoliu/${p!.slug}`}>{p!.title}</GhostButton>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
