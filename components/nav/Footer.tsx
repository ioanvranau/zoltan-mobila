import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-bg-elevated text-text border-t border-line">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">{site.brandShort}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.18em] text-text-muted">
              {site.brandSuffix}
            </p>
            <p className="mt-4 text-sm text-text-muted">{site.tagline}</p>
          </div>
          <div className="text-sm">
            <p className="text-text-muted">Contact</p>
            <p className="mt-2">
              <a href={`tel:${site.phone}`} className="hover:text-brass">{site.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-brass">{site.email}</a>
            </p>
            <p className="mt-4 text-text-muted">{site.program}</p>
          </div>
          <nav className="text-sm">
            <p className="text-text-muted">Navigare</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/portofoliu" className="hover:text-brass">Portofoliu</Link></li>
              <li><Link href="/materiale" className="hover:text-brass">Materiale</Link></li>
              <li><Link href="/despre" className="hover:text-brass">Despre</Link></li>
              <li><Link href="/contact" className="hover:text-brass">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-line pt-6 text-xs text-text-dim flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.brand}</p>
          <p>Realizat în Cluj-Napoca.</p>
        </div>
      </Container>
    </footer>
  );
}
