import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata(
  "Contact",
  "Cere o ofertă pentru mobilier la comandă în Cluj-Napoca.",
);

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-3 font-display text-display max-w-3xl">
          Hai să discutăm despre proiectul tău.
        </h1>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6 text-text">
            <div className="flex gap-3">
              <Phone className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <div>
                <p className="text-eyebrow uppercase text-text-muted">Telefon</p>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-1 block font-medium hover:text-brass transition-colors"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <div>
                <p className="text-eyebrow uppercase text-text-muted">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block font-medium hover:text-brass transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <div>
                <p className="text-eyebrow uppercase text-text-muted">Locație</p>
                <p className="mt-1 font-medium">{site.location}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <div>
                <p className="text-eyebrow uppercase text-text-muted">Program</p>
                <p className="mt-1 font-medium">{site.program}</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mt-20">
          <iframe
            title="Hartă Cluj-Napoca"
            src="https://www.openstreetmap.org/export/embed.html?bbox=23.55%2C46.74%2C23.65%2C46.79&layer=mapnik"
            loading="lazy"
            className="w-full h-72 md:h-96 rounded-2xl border border-line"
          />
        </div>
      </Container>
    </section>
  );
}
