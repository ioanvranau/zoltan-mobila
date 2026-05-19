"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, type Category } from "@/data/types";

const FILTERS: { value: ""; label: "Toate" }[] = [{ value: "", label: "Toate" }];
const CATEGORY_OPTIONS: { value: Category; label: string }[] = (Object.keys(CATEGORY_LABELS) as Category[])
  .map((c) => ({ value: c, label: CATEGORY_LABELS[c] }));

export function PortfolioFilter() {
  const params = useSearchParams();
  const active = (params.get("cat") ?? "") as "" | Category;

  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filtrează portofoliul">
      {[...FILTERS, ...CATEGORY_OPTIONS].map((opt) => {
        const isActive = active === opt.value;
        const href = opt.value ? `/portofoliu?cat=${opt.value}` : "/portofoliu";
        return (
          <Link
            key={opt.value || "all"}
            href={href}
            role="tab"
            aria-selected={isActive}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors min-h-11",
              isActive
                ? "border-brass text-brass bg-brass/10"
                : "border-line text-text-muted hover:text-text hover:border-text-muted",
            )}
          >
            {isActive && <Check className="h-3.5 w-3.5" aria-hidden />}
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
