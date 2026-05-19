import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwatchGroup } from "@/components/materiale/SwatchGroup";
import { swatchesByGroup } from "@/data/materiale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Materiale",
  "Paletă reprezentativă de finisaje pentru mobilier la comandă — PAL melaminat, lemn masiv, MDF vopsit.",
);

export default function MaterialePage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <Eyebrow>Materiale</Eyebrow>
          <h1 className="mt-3 font-display text-display max-w-3xl">
            Paletă reprezentativă, finisaje selectate.
          </h1>
          <p className="mt-5 text-text-muted">
            Iată o selecție din finisajele cu care lucrăm cel mai des. La cerere accesăm peste 200 de decoruri disponibile prin furnizorii noștri din Cluj.
          </p>
        </Container>
      </section>
      <section className="pb-24 md:pb-32">
        <Container>
          <div className="space-y-16 md:space-y-20">
            <SwatchGroup groupKey="uni" swatches={swatchesByGroup("uni")} />
            <SwatchGroup groupKey="imitatie-lemn" swatches={swatchesByGroup("imitatie-lemn")} />
            <SwatchGroup groupKey="stone" swatches={swatchesByGroup("stone")} />
            <SwatchGroup groupKey="lemn-masiv" swatches={swatchesByGroup("lemn-masiv")} />
          </div>
          <p className="mt-16 text-sm text-text-dim italic">
            Paletă reprezentativă — la cerere lucrăm cu peste 200 de finisaje disponibile prin furnizorii noștri din Cluj.
          </p>
        </Container>
      </section>
    </>
  );
}
