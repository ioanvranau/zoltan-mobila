import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostButton } from "@/components/ui/GhostButton";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { featuredProjects } from "@/data/projects";

export function PortfolioTeaser() {
  const items = featuredProjects().slice(0, 6);
  return (
    <Section variant="bg">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow>Portofoliu</Eyebrow>
          <h2 className="mt-3 font-display text-display">Proiecte recente</h2>
        </div>
        <GhostButton href="/portofoliu" className="hidden md:inline-flex">Vezi tot portofoliul</GhostButton>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} />
        ))}
      </div>
      <div className="mt-10 md:hidden">
        <GhostButton href="/portofoliu">Vezi tot portofoliul</GhostButton>
      </div>
    </Section>
  );
}
