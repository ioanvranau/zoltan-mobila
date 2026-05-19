import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BlurImage } from "@/components/ui/BlurImage";

const steps = [
  { n: "01", title: "Discuție", body: "Vizităm spațiul, măsurăm, ascultăm. Plecăm cu o idee clară despre cum vrei să arate piesa finală." },
  { n: "02", title: "Proiect 3D", body: "Primești schițe și render-uri realiste, cu materialele și finisajele propuse. Ajustăm până la varianta cu care rezonezi." },
  { n: "03", title: "Atelier & montaj", body: "Construim în atelier, livrăm și montăm la tine. Te ținem la curent pe parcurs și predăm curat la final." },
];

export function ProcessSteps() {
  return (
    <Section variant="warm">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <BlurImage
            src="/process/atelier.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <Eyebrow>Cum lucrăm</Eyebrow>
          <h2 className="mt-3 font-display text-display">De la idee la montaj — în trei pași.</h2>
          <ol className="mt-10 space-y-8">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="font-display text-3xl text-brass shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-display text-title">{s.title}</h3>
                  <p className="mt-1.5 text-text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
