"use client";

import { useState } from "react";
import type { MaterialSwatch, SwatchGroupKey } from "@/data/types";
import { SWATCH_GROUP_LABELS } from "@/data/types";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwatchTile } from "@/components/materiale/SwatchTile";
import { SwatchModal } from "@/components/materiale/SwatchModal";

export function SwatchGroup({ groupKey, swatches }: { groupKey: SwatchGroupKey; swatches: MaterialSwatch[] }) {
  const [open, setOpen] = useState<MaterialSwatch | null>(null);
  const labels = SWATCH_GROUP_LABELS[groupKey];

  return (
    <div>
      <Eyebrow>{labels.eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-title">{labels.title}</h2>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {swatches.map((s) => (
          <SwatchTile key={s.slug} swatch={s} onClick={() => setOpen(s)} />
        ))}
      </div>
      {open && <SwatchModal swatch={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
