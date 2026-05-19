import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32 text-center">
      <Container>
        <p className="font-display text-hero">404</p>
        <p className="mt-4 text-text-muted">Pagina căutată nu există.</p>
        <div className="mt-10">
          <PillButton href="/">Înapoi acasă</PillButton>
        </div>
      </Container>
    </section>
  );
}
