import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostButton } from "@/components/ui/GhostButton";
import { BlurImage } from "@/components/ui/BlurImage";

export function DespreTeaser() {
  return (
    <Section variant="bg">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <BlurImage
            src="/despre/portrait.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <Eyebrow>Despre atelier</Eyebrow>
          <h2 className="mt-3 font-display text-display">Un singur meșter, fiecare proiect — al lui.</h2>
          <p className="mt-5 text-text-muted max-w-xl">
            Lucrez de aproape două decenii cu PAL melaminat și lemn masiv. Iau puține proiecte în
            paralel, ca să pot urmări fiecare detaliu — de la măsurătoarea inițială până la
            ultimul șurub pus la fața locului.
          </p>
          <div className="mt-8">
            <GhostButton href="/despre">Citește povestea</GhostButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
