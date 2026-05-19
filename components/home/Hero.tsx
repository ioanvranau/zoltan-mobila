import { BlurImage } from "@/components/ui/BlurImage";
import { PillButton } from "@/components/ui/PillButton";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-[88vh] md:h-screen w-full overflow-hidden">
      <BlurImage
        src="/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/30 to-bg" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <p className="text-eyebrow uppercase tracking-[0.22em] text-brass">
          Cluj-Napoca & împrejurimi
        </p>
        <h1 className="mt-6 font-display text-hero leading-[1.05] text-text max-w-3xl">
          Mobilier făcut să rămână.
        </h1>
        <p className="mt-5 max-w-xl text-text-muted">
          Bucătării, dressing-uri, living-uri și dormitoare proiectate și montate la cheie —
          din PAL melaminat și lemn masiv.
        </p>
        <div className="mt-9">
          <PillButton href="/contact" withArrow>Cere o ofertă</PillButton>
        </div>
      </div>
      <a
        href="#dupa-hero"
        aria-label="Coboară mai jos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-text-muted hover:text-brass"
      >
        <ChevronDown className="h-6 w-6 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
