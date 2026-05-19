import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostButton } from "@/components/ui/GhostButton";
import { SwatchTile } from "@/components/materiale/SwatchTile";
import { swatches } from "@/data/materiale";

export function MaterialeStrip() {
  const items = swatches.slice(0, 8);
  return (
    <Section variant="elevated">
      <Eyebrow>Materiale</Eyebrow>
      <h2 className="mt-3 font-display text-display max-w-2xl">Finisaje pe care le lucrăm zilnic.</h2>
      <p className="mt-4 max-w-2xl text-text-muted">
        O selecție din peste 200 de finisaje disponibile prin furnizorii noștri din Cluj.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {items.map((s) => (
          <SwatchTile key={s.slug} swatch={s} compact />
        ))}
      </div>
      <div className="mt-10">
        <GhostButton href="/materiale">Explorează paleta</GhostButton>
      </div>
    </Section>
  );
}
