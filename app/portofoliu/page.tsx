import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { projects } from "@/data/projects";
import type { Category } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Portofoliu", "Proiecte de mobilier la comandă în Cluj-Napoca — bucătării, dressing, living, dormitor.");

export default async function PortofoliuPage(
  { searchParams }: { searchParams: Promise<{ cat?: string }> },
) {
  const { cat } = await searchParams;
  const validCats: Category[] = ["bucatarii", "dressing", "living", "dormitor"];
  const filter = (cat && (validCats as string[]).includes(cat)) ? (cat as Category) : null;
  const items = filter ? projects.filter((p) => p.category === filter) : projects;

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <Eyebrow>Portofoliu</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-display max-w-3xl">
              {projects.length} proiecte semnate de același meșter.
            </h1>
          </div>
          <div className="mt-10">
            <Suspense fallback={null}>
              <PortfolioFilter />
            </Suspense>
          </div>
        </Container>
      </section>
      <section className="pb-24 md:pb-32">
        <Container>
          <PortfolioGrid items={items} />
        </Container>
      </section>
    </>
  );
}
