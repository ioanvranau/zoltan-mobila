import Link from "next/link";
import { BlurImage } from "@/components/ui/BlurImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORY_LABELS, type Project } from "@/data/types";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/portofoliu/${project.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-2xl bg-bg-elevated">
        <BlurImage
          src={project.cover}
          alt={project.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <Eyebrow className="mt-4">{CATEGORY_LABELS[project.category]}</Eyebrow>
      <p className="mt-1 font-display text-title">{project.title}</p>
    </Link>
  );
}
