import { PillButton } from "@/components/ui/PillButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="bg-walnut text-text py-20 md:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <h2 className="font-display text-display max-w-2xl">
            Gata să discutăm despre proiectul tău?
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <PillButton href="/contact" withArrow>Trimite un mesaj</PillButton>
            <GhostButton href={`tel:${site.phone}`}>{site.phoneDisplay}</GhostButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
