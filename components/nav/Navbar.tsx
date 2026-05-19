"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { PillButton } from "@/components/ui/PillButton";
import { site } from "@/data/site";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/portofoliu", label: "Portofoliu" },
  { href: "/materiale", label: "Materiale" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [navH, setNavH] = useState(72);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const measure = () => { if (navRef.current) setNavH(navRef.current.offsetHeight); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        transparent ? "bg-transparent" : "bg-bg/95 backdrop-blur-sm border-b border-line",
      )}
    >
      <nav className="mx-auto flex max-w-shell items-center justify-between px-5 md:px-8 lg:px-12 py-4 text-text">
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${site.brand} — acasă`}>
          <span className="font-display text-xl md:text-2xl font-semibold tracking-tight">
            {site.brandShort}
          </span>
          <span className="hidden md:inline text-text-muted">·</span>
          <span className="hidden md:inline text-xs uppercase tracking-[0.18em] text-text-muted">
            {site.brandSuffix}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "text-sm font-medium transition-opacity hover:opacity-70",
                    active && "text-brass",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <PillButton href="/contact">Cere o ofertă</PillButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        style={{ top: navH, height: `calc(100dvh - ${navH}px)` }}
        className={cn(
          "md:hidden fixed inset-x-0 z-30 overflow-y-auto bg-bg text-text border-t border-line",
          "transition-[opacity,transform] duration-150 ease-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto"
               : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="flex min-h-full flex-col px-5 pt-4 pb-8">
          <ul className="flex flex-col divide-y divide-line">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "flex items-center py-4 font-display text-2xl",
                      active && "text-brass",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <PillButton href="/contact" className="w-full justify-center">Cere o ofertă</PillButton>
          </div>
        </div>
      </div>
    </header>
  );
}
