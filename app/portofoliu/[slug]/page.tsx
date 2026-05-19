import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BlurImage } from "@/components/ui/BlurImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { ProjectMeta } from "@/components/portfolio/ProjectMeta";
import { GalleryLightbox } from "@/components/portfolio/GalleryLightbox";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { projects, projectBySlug } from "@/data/projects";
import { CATEGORY_LABELS } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMetadata(p.title, p.description[0]);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const similar = projects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative h-[60vh] w-full overflow-hidden">
        <BlurImage src={project.cover} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>{CATEGORY_LABELS[project.category]}</Eyebrow>
              <h1 className="mt-3 font-display text-display">{project.title}</h1>
              <div className="mt-8">
                <ProjectMeta project={project} />
              </div>
              <div className="mt-8 space-y-5 text-text-muted">
                {project.description.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>
            <div>
              <GalleryLightbox photos={[project.cover, ...project.gallery]} alt={project.title} />
            </div>
          </div>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="bg-bg-elevated py-16 md:py-24">
          <Container>
            <Eyebrow>Proiecte similare</Eyebrow>
            <h2 className="mt-3 font-display text-display">Alte {CATEGORY_LABELS[project.category].toLowerCase()}</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {similar.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </Container>
        </section>
      )}

      <div className="md:hidden sticky bottom-0 z-30 bg-bg-elevated border-t border-line p-4">
        <PillButton href="/contact" className="w-full justify-center">Discută un proiect similar</PillButton>
      </div>
    </>
  );
}
