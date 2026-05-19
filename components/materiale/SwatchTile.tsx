import type { MaterialSwatch } from "@/data/types";
import { BlurImage } from "@/components/ui/BlurImage";
import { cn } from "@/lib/cn";

export function SwatchTile({
  swatch, compact = false, onClick,
}: { swatch: MaterialSwatch; compact?: boolean; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group block w-full text-left",
        onClick && "cursor-pointer",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line">
        {swatch.swatchType === "photo" && swatch.swatchSrc ? (
          <BlurImage src={swatch.swatchSrc} alt={swatch.name} fill sizes="200px" className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: swatch.swatchCss }} />
        )}
      </div>
      <p className={cn("mt-2.5 font-medium", compact ? "text-sm" : "text-base")}>{swatch.name}</p>
      <p className="text-xs text-text-muted">{swatch.tag}</p>
    </Tag>
  );
}
