import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BlurImage } from "@/components/ui/BlurImage";

const cards = [
  { slug: "bucatarii", label: "Bucătării",  src: "/categorii/bucatarii.jpg" },
  { slug: "dressing",  label: "Dressing",   src: "/categorii/dressing.jpg" },
  { slug: "living",    label: "Living",     src: "/categorii/living.jpg" },
  { slug: "dormitor",  label: "Dormitor",   src: "/categorii/dormitor.jpg" },
];

export function CategoryCards() {
  return (
    <Section id="dupa-hero" variant="bg">
      <Eyebrow>Ce construim</Eyebrow>
      <h2 className="mt-3 font-display text-display max-w-2xl">Patru piese de mobilier, executate la cheie.</h2>
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.slug}
            href={`/portofoliu?cat=${c.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-bg-elevated"
          >
            <BlurImage
              src={c.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/20 to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-2xl text-text">{c.label}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
