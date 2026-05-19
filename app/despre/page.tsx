import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BlurImage } from "@/components/ui/BlurImage";
import { PillButton } from "@/components/ui/PillButton";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Despre atelier", "Aproape două decenii lucrând cu PAL melaminat și lemn masiv în Cluj-Napoca.");

const cumLucrez = [
  { n: "01", title: "Discuție", body: "Te ascult, măsor, înțeleg cum folosești spațiul. Nu plec până nu am răspunsul la 'cum ar trebui să arate pentru tine'." },
  { n: "02", title: "Proiect", body: "Schițe și render-uri 3D. Iterăm până când ești sigur — nu construim niciodată pe 'ne dăm seama pe parcurs'." },
  { n: "03", title: "Materiale", body: "Comand finisajele și feronăriile abia după ce ai aprobat proiectul. Nimic nu zace în atelier așteptând o decizie." },
  { n: "04", title: "Montaj", body: "Livrez și montez personal. Curăț la final și revin pentru orice ajustare în primele 30 de zile." },
];

const atelier = [
  "/despre/workshop.jpg",
  "/despre/tools.jpg",
  "/despre/raw-wood.jpg",
  "/despre/detail.jpg",
];

export default function DesprePage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <BlurImage src="/despre/portrait.jpg" alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <Eyebrow>Despre atelier</Eyebrow>
              <h1 className="mt-3 font-display text-display">Un atelier mic. Fiecare proiect — al meu.</h1>
              <p className="mt-5 text-text-muted">
                Mă numesc Zoltan. Lucrez de aproape două decenii cu mobilier la comandă, din PAL melaminat
                și lemn masiv. Iau puține proiecte în paralel, ca să pot urmări fiecare detaliu — de la
                măsurătoarea inițială până la ultimul șurub pus la fața locului.
              </p>
              <p className="mt-4 text-text-muted">
                Cred că mobilierul bun se vede în detalii — în cum se închide un sertar, cum se aliniază
                două profile, cum stă blatul perfect drept după 5 ani. Asta caut să livrez.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bg-warm py-20 md:py-28">
        <Container>
          <Eyebrow>Cum lucrez</Eyebrow>
          <h2 className="mt-3 font-display text-display max-w-3xl">Patru pași simpli, fără surprize pe parcurs.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {cumLucrez.map((s) => (
              <li key={s.n}>
                <span className="font-display text-3xl text-brass">{s.n}</span>
                <h3 className="mt-3 font-display text-title">{s.title}</h3>
                <p className="mt-2 text-text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <Eyebrow>Atelier</Eyebrow>
          <h2 className="mt-3 font-display text-display">Unde se întâmplă.</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {atelier.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-bg-elevated">
                <BlurImage src={src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-12">
            <PillButton href="/contact" withArrow>Hai să vorbim</PillButton>
          </div>
        </Container>
      </section>
    </>
  );
}
