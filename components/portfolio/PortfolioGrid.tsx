import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/types";

export function PortfolioGrid({ items }: { items: Project[] }) {
  if (items.length === 0) {
    return (
      <p className="text-text-muted">Nu există proiecte în această categorie încă.</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <ProjectCard key={p.slug} project={p} priority={i < 3} />
      ))}
    </div>
  );
}
