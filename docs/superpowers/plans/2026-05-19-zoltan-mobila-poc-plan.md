# Zoltan · Mobilă la comandă — POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a 6-page, Romanian, mobile-first, Dark Editorial proof-of-concept site for Zoltan (custom furniture, Cluj-Napoca) with a working Resend-backed contact form.

**Architecture:** Next.js 16 App Router · TypeScript · Tailwind v4 · static `/data/` layer (TS files, Sanity-shaped) · `next/image` everywhere over locally-downloaded Unsplash photos · Server Action + Resend for the contact form · no analytics, no consent banner, no test suite (per spec §1).

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, `next/font/google` (Playfair Display + Inter), `yet-another-react-lightbox`, Zod, Resend, `clsx` + `tailwind-merge`, `lucide-react`.

**Reference project:** `../totalparquet` — same stack. Mirror conventions for `lib/cn.ts`, `useInView`, `Container`/`Section`/`PillButton` shape, `next/font` setup. Do **not** copy code wholesale; this site has a different palette (dark editorial vs. cream) and a different form (Server Action + Resend vs. console.log).

**Branch/deploy policy:** Main branch `develop`. The user owns all `git commit`, `git push`, and `netlify` commands. Claude must never run them.

**Source of truth for design decisions:** [`../specs/2026-05-19-zoltan-mobila-poc-design.md`](../specs/2026-05-19-zoltan-mobila-poc-design.md). When this plan and the spec disagree, the spec wins — flag the conflict to the user.

---

## File structure (locked before tasks)

```
zoltan-mobila/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                            (/ — Acasă)
│   ├── globals.css
│   ├── not-found.tsx
│   ├── portofoliu/
│   │   ├── page.tsx                        (list + filter)
│   │   └── [slug]/page.tsx                 (detail)
│   ├── materiale/page.tsx
│   ├── despre/page.tsx
│   └── contact/
│       ├── page.tsx
│       └── actions.ts                      ("use server" submitContact)
├── components/
│   ├── ui/
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── PillButton.tsx
│   │   ├── GhostButton.tsx
│   │   ├── Eyebrow.tsx
│   │   ├── BlurImage.tsx
│   │   └── DemoBanner.tsx
│   ├── nav/
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── CategoryCards.tsx
│   │   ├── PortfolioTeaser.tsx
│   │   ├── MaterialeStrip.tsx
│   │   ├── ProcessSteps.tsx
│   │   ├── DespreTeaser.tsx
│   │   └── CtaBanner.tsx
│   ├── portfolio/
│   │   ├── PortfolioGrid.tsx
│   │   ├── PortfolioFilter.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectMeta.tsx
│   │   └── GalleryLightbox.tsx
│   ├── materiale/
│   │   ├── SwatchTile.tsx
│   │   ├── SwatchGroup.tsx
│   │   └── SwatchModal.tsx
│   └── forms/
│       ├── ContactForm.tsx
│       └── FormField.tsx
├── data/
│   ├── types.ts
│   ├── site.ts
│   ├── projects.ts
│   ├── materiale.ts
│   └── testimonials.ts
├── lib/
│   ├── cn.ts
│   ├── useInView.ts
│   ├── email.ts
│   ├── validation.ts
│   └── seo.ts
├── public/                                 (downloaded Unsplash photos go here)
├── scripts/
│   └── download-photos.py
├── photo-manifest.json
├── photos-attribution.md
├── .env.example
├── .env.local                              (gitignored)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## Conventions (apply everywhere)

- **Server components by default.** `"use client"` only on: Navbar, MobileMenu, PortfolioFilter, GalleryLightbox, SwatchModal, ContactForm, useInView consumers.
- **Imports:** path alias `@/*` (configured by `create-next-app`).
- **Class merging:** `cn()` from `lib/cn.ts`.
- **Romanian copy.** Never translate UI text. Diacritics on (`ă`, `â`, `î`, `ș`, `ț`).
- **Image policy:** every photo via `next/image`. Hero gets `priority`. Below-the-fold and gallery thumbnails get `loading="lazy"` (default). Provide explicit `sizes`. Use `placeholder="blur"` with `blurDataURL` (a flat warm-dark hex) — full blur datasets are not required for the POC.
- **Accessibility:** one `<h1>` per page; `focus-visible:ring-2 ring-brass ring-offset-2 ring-offset-bg`; touch targets ≥ 44 px; skip link first child of `<body>`.
- **Motion:** every animation wrapped in `motion-safe:`.
- **Comments:** none unless the *why* is non-obvious. No section banners.

---

## Subagent dispatch boundaries

The plan groups tasks into **phases**. Foundation phases (1–4) are built by the orchestrator (Opus, this session) so subagents inherit locked conventions. Mechanical phases (5b, 6b, 7b, etc.) are dispatched in parallel to Sonnet subagents — each one builds one page or one component family with the data/types/components already in place.

**Hard rule:** never dispatch subagents during phases 1–4. Never dispatch two subagents that both write to the same file.

---

## Phase 1 — Scaffold

### Task 1: Initialize Next.js project

**Files:** repo root (creates `app/`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`)

- [ ] **Step 1: Verify the repo root is empty of code (only `docs/` and dotfiles allowed)**

Run: `ls C:/projects/smallprojects/zoltan-mobila/`
Expected: `docs/` (and possibly `.git`, `.claude`, `.gitignore`). No `package.json` yet.

- [ ] **Step 2: Run create-next-app non-interactively from the parent dir into this folder**

Run (PowerShell, from any directory):
```
npx create-next-app@16 C:/projects/smallprojects/zoltan-mobila --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --turbopack --no-git --yes
```
If `create-next-app` complains the directory is not empty, accept overwrites for `.gitignore` only; keep `docs/` intact.

Expected: `package.json`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `tailwind` configured, `tsconfig.json` with `@/*` alias.

- [ ] **Step 3: Verify scaffold**

Run: `npm install` (idempotent if already done) then `npm run build`
Expected: clean build, zero TS errors.

- [ ] **Step 4: Add runtime dependencies**

Run:
```
npm install clsx tailwind-merge lucide-react yet-another-react-lightbox zod resend
```

- [ ] **Step 5: Add `prettier` + `prettier-plugin-tailwindcss` (matching totalparquet)**

Run:
```
npm install --save-dev prettier prettier-plugin-tailwindcss
```

Create `.prettierrc.json`:
```json
{ "plugins": ["prettier-plugin-tailwindcss"] }
```

- [ ] **Step 6: Hand off — user commits the scaffold**

Say to the user: "Scaffold complete. Please `git add . && git commit -m 'scaffold: next 16 + tailwind v4'` when ready."

---

## Phase 2 — Design tokens & global CSS

### Task 2: Implement the Dark Editorial token system

**Files:**
- Modify: `app/globals.css` (replace generated body)
- Create: `lib/cn.ts`

- [ ] **Step 1: Write `lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Replace `app/globals.css` with the Dark Editorial token system**

```css
@import "tailwindcss";

@theme {
  /* Palette — see spec §2 (WCAG verified) */
  --color-bg: #0E0D0B;
  --color-bg-elevated: #161311;
  --color-bg-warm: #1C1814;
  --color-text: #E8DDC7;
  --color-text-muted: #B5AC97;
  --color-text-dim: #6E665A;
  --color-brass: #B89968;
  --color-brass-hover: #CDB07F;
  --color-walnut: #3A2E22;
  --color-line: #2A241D;
  --color-success: #7FB17F;
  --color-error: #E59489;

  /* Typography */
  --font-display: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;

  --text-hero: clamp(2.6rem, 5vw + 1rem, 5.8rem);
  --text-hero--line-height: 1.05;
  --text-display: clamp(2rem, 3vw + 1rem, 3.6rem);
  --text-display--line-height: 1.1;
  --text-title: clamp(1.4rem, 1.5vw + 0.8rem, 2rem);
  --text-title--line-height: 1.2;
  --text-eyebrow: 0.75rem;
  --text-eyebrow--line-height: 1;
  --text-eyebrow--letter-spacing: 0.22em;

  /* Container */
  --container-shell: 80rem; /* 1280px */
}

html {
  background: var(--color-bg);
  color: var(--color-text);
}

body {
  font-family: var(--font-sans);
}

/* Hide native focus rings; keep keyboard-visible ones brass */
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid var(--color-brass);
  outline-offset: 2px;
  border-radius: 2px;
}
input:focus, input:focus-visible,
textarea:focus, textarea:focus-visible,
select:focus, select:focus-visible {
  outline: none;
  box-shadow: none;
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Skip link */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--color-brass);
  color: var(--color-bg);
  padding: 0.75rem 1rem;
  z-index: 100;
}
.skip-link:focus { left: 0.5rem; top: 0.5rem; }
```

- [ ] **Step 3: Verify Tailwind v4 picks up the tokens**

Run: `npm run dev`
Expected: page renders against `#0E0D0B`; classes like `bg-bg`, `text-text`, `text-brass`, `font-display`, `text-hero` resolve in DevTools.
Stop the dev server after verifying.

---

## Phase 3 — App shell (layout + nav + footer)

### Task 3: Root layout with fonts, metadata, skip link

**Files:**
- Modify: `app/layout.tsx`
- Create: `data/site.ts`

- [ ] **Step 1: Write `data/site.ts`**

```ts
export const site = {
  brand: "Zoltan · Mobilă la comandă",
  brandShort: "Zoltan",
  brandSuffix: "Mobilă la comandă",
  tagline: "Cluj-Napoca & împrejurimi",
  phone: "+40700000000",       // POC placeholder — replaced on contract
  phoneDisplay: "0700 000 000",
  email: "contact@zoltan-mobila.ro",
  facebook: "#",
  program: "Lu–Vi 9–18 · Sâ la cerere",
  location: "Cluj-Napoca & împrejurimi",
};
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";
import { DemoBanner } from "@/components/ui/DemoBanner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zoltan · Mobilă la comandă în Cluj-Napoca",
    template: "%s · Zoltan · Mobilă la comandă",
  },
  description:
    "Bucătării, dressing-uri, living-uri și dormitoare făcute pe comandă în Cluj-Napoca. PAL melaminat și lemn masiv, montate la cheie.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <a href="#main" className="skip-link">Sari la conținut</a>
        <DemoBanner />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Task 4: Container, Section, PillButton, GhostButton, Eyebrow, BlurImage, DemoBanner

**Files:**
- Create: `components/ui/Container.tsx`
- Create: `components/ui/Section.tsx`
- Create: `components/ui/PillButton.tsx`
- Create: `components/ui/GhostButton.tsx`
- Create: `components/ui/Eyebrow.tsx`
- Create: `components/ui/BlurImage.tsx`
- Create: `components/ui/DemoBanner.tsx`

- [ ] **Step 1: `components/ui/Container.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-shell px-5 md:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: `components/ui/Section.tsx`**

```tsx
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Variant = "bg" | "elevated" | "warm";

export function Section({
  children,
  variant = "bg",
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  const bg =
    variant === "elevated" ? "bg-bg-elevated" :
    variant === "warm" ? "bg-bg-warm" : "bg-bg";
  return (
    <section id={id} className={cn("py-20 md:py-28 lg:py-36 text-text", bg, className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
```

- [ ] **Step 3: `components/ui/PillButton.tsx`** (server-component-safe — `Link` is fine)

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "brass" | "outline";
type Common = { children: React.ReactNode; variant?: Variant; withArrow?: boolean; className?: string };
type AsLink = Common & { href: string; type?: never; onClick?: never; name?: never; value?: never };
type AsButton = Common & { href?: undefined; type?: "button" | "submit"; onClick?: () => void; name?: string; value?: string };

const base =
  "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide " +
  "transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] " +
  "min-h-11";

const variants: Record<Variant, string> = {
  brass: "bg-brass text-bg hover:bg-brass-hover",
  outline: "border border-brass text-brass hover:bg-brass hover:text-bg",
};

export function PillButton(props: AsLink | AsButton) {
  const { children, variant = "brass", withArrow = false, className } = props;
  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </>
  );
  if ("href" in props && props.href) {
    return <Link href={props.href} className={classes}>{content}</Link>;
  }
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      name={props.name}
      value={props.value}
      className={classes}
    >
      {content}
    </button>
  );
}
```

- [ ] **Step 4: `components/ui/GhostButton.tsx`**

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function GhostButton({
  href, children, className,
}: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium tracking-wide text-brass",
        "hover:text-brass-hover transition-colors duration-200 min-h-11",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
```

- [ ] **Step 5: `components/ui/Eyebrow.tsx`**

```tsx
import { cn } from "@/lib/cn";

export function Eyebrow({
  children, className, tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "brass";
}) {
  return (
    <p
      className={cn(
        "text-eyebrow uppercase",
        tone === "brass" ? "text-brass" : "text-text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 6: `components/ui/BlurImage.tsx`** — `next/image` wrapper with a flat warm blur placeholder

```tsx
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/cn";

// Tiny 8x8 warm-dark JPEG, base64. Single solid color — avoids the cost of per-image blur data.
const FALLBACK_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxQzE4MTQiLz48L3N2Zz4=";

type Props = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  blurDataURL?: string;
};

export function BlurImage({ className, blurDataURL, ...rest }: Props) {
  return (
    <Image
      {...rest}
      placeholder="blur"
      blurDataURL={blurDataURL ?? FALLBACK_BLUR}
      className={cn(className)}
    />
  );
}
```

- [ ] **Step 7: `components/ui/DemoBanner.tsx`** — shown on every non-localhost host; dismissable

```tsx
"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function DemoBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isLocal = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    setShow(!isLocal);
    setDismissed(sessionStorage.getItem("demo-banner-dismissed") === "1");
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="bg-walnut text-text text-xs md:text-sm">
      <div className="mx-auto flex max-w-shell items-start gap-3 px-5 md:px-8 lg:px-12 py-2.5">
        <p className="flex-1 leading-snug">
          <span className="font-medium text-brass">Demonstrație</span> · imaginile sunt mostre pentru
          a ilustra design-ul. Conținutul real va fi adăugat după contractare.
        </p>
        <button
          type="button"
          aria-label="Închide bannerul"
          onClick={() => { sessionStorage.setItem("demo-banner-dismissed", "1"); setDismissed(true); }}
          className="-mr-1 inline-flex h-8 w-8 items-center justify-center text-text-muted hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

### Task 5: Navbar + MobileMenu + Footer

**Files:**
- Create: `components/nav/Navbar.tsx`
- Create: `components/nav/MobileMenu.tsx`
- Create: `components/nav/Footer.tsx`

- [ ] **Step 1: `components/nav/Navbar.tsx`** — mirrors totalparquet's behavior: transparent over hero on `/`, solid otherwise; opens MobileMenu on small screens.

```tsx
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
```

- [ ] **Step 2: `components/nav/Footer.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify the shell renders**

Run `npm run dev`, open `/`. Expect: dark page, top wordmark + nav, Pills CTA, footer with brand info. Mobile menu opens/closes on a narrow window. No console errors.

---

## Phase 4 — Data layer & hooks

### Task 6: Types + stub data files

**Files:**
- Create: `data/types.ts`
- Create: `data/projects.ts`
- Create: `data/materiale.ts`
- Create: `data/testimonials.ts`
- Create: `lib/useInView.ts`
- Create: `lib/validation.ts`
- Create: `lib/seo.ts`

- [ ] **Step 1: `data/types.ts`**

```ts
export type Category = "bucatarii" | "dressing" | "living" | "dormitor";
export type CategoryLabel = "Bucătării" | "Dressing" | "Living" | "Dormitor";
export type Material = "PAL melaminat" | "Lemn masiv" | "PAL + Lemn masiv" | "MDF vopsit";

export const CATEGORY_LABELS: Record<Category, CategoryLabel> = {
  bucatarii: "Bucătării",
  dressing: "Dressing",
  living: "Living",
  dormitor: "Dormitor",
};

export interface Project {
  slug: string;
  title: string;
  category: Category;
  cover: string;          // path under /public, e.g. "/portfolio/bucatarie-buna-ziua/cover.jpg"
  gallery: string[];      // additional photos
  meta: {
    location: string;
    year: number;
    surface?: number;     // mp
    material: Material;
    finishes?: string[];
  };
  description: string[];  // paragraphs
  featured: boolean;
}

export type SwatchGroupKey = "uni" | "imitatie-lemn" | "stone" | "lemn-masiv";

export const SWATCH_GROUP_LABELS: Record<SwatchGroupKey, { eyebrow: string; title: string }> = {
  uni:            { eyebrow: "Finisaje uni",        title: "Mat & Lucios" },
  "imitatie-lemn":{ eyebrow: "PAL melaminat",       title: "Imitație lemn" },
  stone:          { eyebrow: "Stone & Beton",       title: "Suprafețe minerale" },
  "lemn-masiv":   { eyebrow: "Lemn masiv",          title: "Esențe naturale" },
};

export interface MaterialSwatch {
  slug: string;
  name: string;
  group: SwatchGroupKey;
  swatchType: "photo" | "gradient";
  swatchSrc?: string;        // when swatchType === "photo"
  swatchCss?: string;        // when swatchType === "gradient"
  tag: "PAL" | "Lemn masiv" | "MDF" | "Stone";
  description?: string;
  exampleProjectSlugs: string[];
}

export interface Testimonial {
  author: string;
  text: string;
  project?: string;
}
```

- [ ] **Step 2: `data/projects.ts`** — 8 plausible Cluj projects (covers and gallery paths point at files we'll download later)

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "bucatarie-buna-ziua",
    title: "Bucătărie Casa Bună Ziua",
    category: "bucatarii",
    cover: "/portfolio/bucatarie-buna-ziua/cover.jpg",
    gallery: [
      "/portfolio/bucatarie-buna-ziua/01.jpg",
      "/portfolio/bucatarie-buna-ziua/02.jpg",
      "/portfolio/bucatarie-buna-ziua/03.jpg",
      "/portfolio/bucatarie-buna-ziua/04.jpg",
    ],
    meta: {
      location: "Bună Ziua, Cluj-Napoca",
      year: 2024,
      surface: 14,
      material: "PAL melaminat",
      finishes: ["Antracit mat", "Stejar Halifax"],
    },
    description: [
      "Bucătărie liniară pe doi pereți, cu insulă centrală și plinte LED. Mobilierul este executat din PAL melaminat antracit mat, completat cu fronturi decor stejar Halifax pentru contrast.",
      "Sistemele de feronerie sunt cu amortizare totală — sertare cu extragere completă și balamale cu închidere lentă.",
    ],
    featured: true,
  },
  {
    slug: "bucatarie-dambul-rotund",
    title: "Bucătărie Dâmbul Rotund",
    category: "bucatarii",
    cover: "/portfolio/bucatarie-dambul-rotund/cover.jpg",
    gallery: [
      "/portfolio/bucatarie-dambul-rotund/01.jpg",
      "/portfolio/bucatarie-dambul-rotund/02.jpg",
      "/portfolio/bucatarie-dambul-rotund/03.jpg",
    ],
    meta: {
      location: "Dâmbul Rotund, Cluj-Napoca",
      year: 2023,
      surface: 11,
      material: "PAL melaminat",
      finishes: ["Crem mat", "Nuc"],
    },
    description: [
      "Bucătărie în formă de L pentru un apartament de două camere, gândită să maximizeze depozitarea pe verticală.",
      "Blat din quartz compozit, electrocasnice încorporate, scurgătoare ascuns sub blat.",
    ],
    featured: true,
  },
  {
    slug: "dressing-marasti",
    title: "Dressing Mărăști",
    category: "dressing",
    cover: "/portfolio/dressing-marasti/cover.jpg",
    gallery: [
      "/portfolio/dressing-marasti/01.jpg",
      "/portfolio/dressing-marasti/02.jpg",
      "/portfolio/dressing-marasti/03.jpg",
      "/portfolio/dressing-marasti/04.jpg",
    ],
    meta: {
      location: "Mărăști, Cluj-Napoca",
      year: 2025,
      surface: 6,
      material: "PAL melaminat",
      finishes: ["Stejar Sonoma", "Negru profund"],
    },
    description: [
      "Dressing walk-in cu front mixt sticlă fumurie și PAL stejar Sonoma. Iluminare LED integrată în profil pe toată lungimea.",
      "Bare extractibile pentru pantaloni, sertare cu compartimentare pentru cravate și ceasuri.",
    ],
    featured: true,
  },
  {
    slug: "dressing-zorilor",
    title: "Dressing Zorilor",
    category: "dressing",
    cover: "/portfolio/dressing-zorilor/cover.jpg",
    gallery: [
      "/portfolio/dressing-zorilor/01.jpg",
      "/portfolio/dressing-zorilor/02.jpg",
      "/portfolio/dressing-zorilor/03.jpg",
    ],
    meta: {
      location: "Zorilor, Cluj-Napoca",
      year: 2024,
      surface: 4,
      material: "PAL melaminat",
      finishes: ["Alb mat"],
    },
    description: [
      "Dressing încastrat într-o nișă existentă, cu uși culisante pe rulmenți. Optimizat pentru un apartament cu spațiu de depozitare limitat.",
    ],
    featured: false,
  },
  {
    slug: "living-gheorgheni",
    title: "Living Gheorgheni",
    category: "living",
    cover: "/portfolio/living-gheorgheni/cover.jpg",
    gallery: [
      "/portfolio/living-gheorgheni/01.jpg",
      "/portfolio/living-gheorgheni/02.jpg",
      "/portfolio/living-gheorgheni/03.jpg",
      "/portfolio/living-gheorgheni/04.jpg",
    ],
    meta: {
      location: "Gheorgheni, Cluj-Napoca",
      year: 2024,
      surface: 9,
      material: "PAL + Lemn masiv",
      finishes: ["Stejar masiv", "Antracit mat"],
    },
    description: [
      "Bibliotecă pe perete întreg, până în tavan, cu raft TV suspendat. Structura este PAL antracit, polițele decorative sunt din stejar masiv uleiat.",
      "Iluminare LED indirectă în spatele rafturilor — accentuează adâncimea peretelui.",
    ],
    featured: true,
  },
  {
    slug: "vila-faget",
    title: "Vila Făget",
    category: "living",
    cover: "/portfolio/vila-faget/cover.jpg",
    gallery: [
      "/portfolio/vila-faget/01.jpg",
      "/portfolio/vila-faget/02.jpg",
      "/portfolio/vila-faget/03.jpg",
    ],
    meta: {
      location: "Făget, Cluj-Napoca",
      year: 2023,
      surface: 18,
      material: "Lemn masiv",
      finishes: ["Nuc european"],
    },
    description: [
      "Mobilier de living pentru o vilă din Făget — bibliotecă, comodă TV și masă de cafea. Toate piesele sunt din nuc european masiv, finisat ulei natural.",
    ],
    featured: false,
  },
  {
    slug: "dormitor-buna-ziua",
    title: "Dormitor Casa Bună Ziua",
    category: "dormitor",
    cover: "/portfolio/dormitor-buna-ziua/cover.jpg",
    gallery: [
      "/portfolio/dormitor-buna-ziua/01.jpg",
      "/portfolio/dormitor-buna-ziua/02.jpg",
      "/portfolio/dormitor-buna-ziua/03.jpg",
    ],
    meta: {
      location: "Bună Ziua, Cluj-Napoca",
      year: 2025,
      surface: 12,
      material: "PAL melaminat",
      finishes: ["Frasin", "Crem mat"],
    },
    description: [
      "Set complet de dormitor — pat suspendat cu noptiere integrate, dressing aferent și birou pe lungimea peretelui.",
    ],
    featured: true,
  },
  {
    slug: "apartament-andrei-muresanu",
    title: "Apartament Andrei Mureșanu",
    category: "dormitor",
    cover: "/portfolio/apartament-andrei-muresanu/cover.jpg",
    gallery: [
      "/portfolio/apartament-andrei-muresanu/01.jpg",
      "/portfolio/apartament-andrei-muresanu/02.jpg",
      "/portfolio/apartament-andrei-muresanu/03.jpg",
    ],
    meta: {
      location: "Andrei Mureșanu, Cluj-Napoca",
      year: 2024,
      surface: 10,
      material: "MDF vopsit",
      finishes: ["Alb mat", "Auriu periat"],
    },
    description: [
      "Dormitor matrimonial cu pat tapițat și mobilier MDF vopsit alb mat. Mânere integrate cu profil auriu periat.",
    ],
    featured: true,
  },
];

export function projectsByCategory(c: Project["category"]): Project[] {
  return projects.filter((p) => p.category === c);
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
```

- [ ] **Step 3: `data/materiale.ts`** — 13 swatches across 4 groups

```ts
import type { MaterialSwatch } from "./types";

export const swatches: MaterialSwatch[] = [
  // Uni · Mat & Lucios (4)
  { slug: "alb-mat",       name: "Alb mat",       group: "uni", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #f3ece0 0%, #e3dccd 100%)",
    exampleProjectSlugs: ["dressing-zorilor", "apartament-andrei-muresanu"] },
  { slug: "antracit-mat",  name: "Antracit mat",  group: "uni", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #2a2622 0%, #1a1714 100%)",
    exampleProjectSlugs: ["bucatarie-buna-ziua", "living-gheorgheni"] },
  { slug: "crem-mat",      name: "Crem mat",      group: "uni", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #ddd1b8 0%, #c5b89c 100%)",
    exampleProjectSlugs: ["bucatarie-dambul-rotund", "dormitor-buna-ziua"] },
  { slug: "negru-profund", name: "Negru profund", group: "uni", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #161311 0%, #0a0908 100%)",
    exampleProjectSlugs: ["dressing-marasti"] },

  // Imitație lemn (PAL melaminat) (4) — gradients now, can be swapped to /materiale/<slug>.jpg later
  { slug: "stejar-sonoma",  name: "Stejar Sonoma",  group: "imitatie-lemn", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #c4a47a 0%, #a98759 100%)",
    exampleProjectSlugs: ["dressing-marasti"] },
  { slug: "stejar-halifax", name: "Stejar Halifax", group: "imitatie-lemn", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #b39676 0%, #8b6e4e 100%)",
    exampleProjectSlugs: ["bucatarie-buna-ziua"] },
  { slug: "nuc",            name: "Nuc",            group: "imitatie-lemn", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #5a4030 0%, #3a2818 100%)",
    exampleProjectSlugs: ["bucatarie-dambul-rotund"] },
  { slug: "frasin",         name: "Frasin",         group: "imitatie-lemn", swatchType: "gradient", tag: "PAL",
    swatchCss: "linear-gradient(135deg, #d4c3a3 0%, #b39e7c 100%)",
    exampleProjectSlugs: ["dormitor-buna-ziua"] },

  // Stone & Beton (2)
  { slug: "beton",          name: "Beton",          group: "stone", swatchType: "gradient", tag: "Stone",
    swatchCss: "linear-gradient(135deg, #8a8278 0%, #6a635a 100%)",
    exampleProjectSlugs: [] },
  { slug: "marmura-alba",   name: "Marmură albă",   group: "stone", swatchType: "gradient", tag: "Stone",
    swatchCss: "linear-gradient(135deg, #e8e2d4 0%, #c8c0b0 100%)",
    exampleProjectSlugs: [] },

  // Lemn masiv (3)
  { slug: "stejar-masiv",   name: "Stejar masiv",   group: "lemn-masiv", swatchType: "gradient", tag: "Lemn masiv",
    swatchCss: "linear-gradient(135deg, #b8956a 0%, #8a6943 100%)",
    exampleProjectSlugs: ["living-gheorgheni"] },
  { slug: "frasin-masiv",   name: "Frasin masiv",   group: "lemn-masiv", swatchType: "gradient", tag: "Lemn masiv",
    swatchCss: "linear-gradient(135deg, #c4ad85 0%, #9a8460 100%)",
    exampleProjectSlugs: [] },
  { slug: "nuc-masiv",      name: "Nuc masiv",      group: "lemn-masiv", swatchType: "gradient", tag: "Lemn masiv",
    swatchCss: "linear-gradient(135deg, #6a4830 0%, #4a2e1c 100%)",
    exampleProjectSlugs: ["vila-faget"] },
];

export function swatchesByGroup(g: MaterialSwatch["group"]): MaterialSwatch[] {
  return swatches.filter((s) => s.group === g);
}

export function swatchBySlug(slug: string): MaterialSwatch | undefined {
  return swatches.find((s) => s.slug === slug);
}
```

- [ ] **Step 4: `data/testimonials.ts`** — empty array, file exists for Phase B drop-in

```ts
import type { Testimonial } from "./types";
export const testimonials: Testimonial[] = [];
```

- [ ] **Step 5: `lib/useInView.ts`**

```ts
"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...opts },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [opts]);
  return { ref, inView };
}
```

- [ ] **Step 6: `lib/validation.ts`** — Zod schema for the contact form

```ts
import { z } from "zod";

// Romanian phone: optional country code, then a 9-10 digit number. Lenient — strip spaces/dashes/dots.
const phoneRegex = /^(?:\+?40|0)?\s?[1-9](?:[\s.-]?\d){8}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Numele este obligatoriu (minim 2 caractere)."),
  phone: z
    .string()
    .trim()
    .min(1, "Telefonul este obligatoriu.")
    .refine((v) => phoneRegex.test(v.replace(/[\s.-]/g, "")), "Număr de telefon invalid."),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || z.string().email().safeParse(v).success, "Email invalid."),
  category: z.enum(["bucatarii", "dressing", "living", "dormitor", "altele"]).optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Mesajul este prea lung (max 2000 caractere).").optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot — must be empty
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 7: `lib/seo.ts`** — helper for per-page metadata

```ts
import type { Metadata } from "next";

export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}
```

- [ ] **Step 8: Build sanity-check**

Run: `npm run build`
Expected: zero TS errors. (Pages don't exist yet so the build will still pass — only `app/page.tsx`, `app/layout.tsx` exist.)

---

## Phase 5 — Photo manifest checkpoint (**user review required**)

### Task 7: Write `photo-manifest.json` + downloader script + attribution file

**Files:**
- Create: `photo-manifest.json`
- Create: `scripts/download-photos.py`
- Create: `photos-attribution.md`

- [ ] **Step 1: Curate the manifest**

Pick 60 Unsplash photos that satisfy the spec §6 curation rules: side-lit / low-key / brass-warm, no faces in portfolio, modern PAL realities. Each entry is `{ unsplashId, photographer, photographer_url, targetPath, role, license: "Unsplash" }`. Group entries by their target dir (hero, categories, portfolio/<slug>, materiale, process, despre).

Photo budget recap:
| Bucket | Count | Target paths |
|---|---|---|
| Home hero | 1 | `/public/hero.jpg` |
| Category teasers | 4 | `/public/categorii/{bucatarii,dressing,living,dormitor}.jpg` |
| Portfolio | 8 projects × ~4.5 photos | `/public/portfolio/<slug>/{cover,01,02,03,04}.jpg` (cover + 3–4 gallery; match the slug list in `data/projects.ts`) |
| Materiale | 4 | only the four `imitatie-lemn` swatches need photo backing (`/public/materiale/{stejar-sonoma,stejar-halifax,nuc,frasin}.jpg`); the other 9 keep gradients |
| Process | 1 | `/public/process/atelier.jpg` |
| Despre | 5 | `/public/despre/{portrait,workshop,tools,raw-wood,detail}.jpg` |
| **Total** | **~50–55** | (Below the §6 ceiling of 60 — that's fine.) |

Manifest format example:
```json
{
  "photos": [
    {
      "unsplashId": "abc123XYZ",
      "photographer": "Jane Doe",
      "photographer_url": "https://unsplash.com/@janedoe",
      "targetPath": "public/hero.jpg",
      "role": "home-hero",
      "license": "Unsplash"
    }
  ]
}
```

Use the **Unsplash photo download URL pattern** in the downloader: `https://images.unsplash.com/photo-<id>?w=2400&q=80&fm=jpg`. Choose IDs by browsing unsplash.com and pasting the photo's slug from the URL.

- [ ] **Step 2: `scripts/download-photos.py`** — mirrors `totalparquet/scripts/download-assets.py` (Python + urllib + idempotent)

```python
#!/usr/bin/env python3
"""Download all photos listed in photo-manifest.json from Unsplash.

Run from repo root: python scripts/download-photos.py
Idempotent — skips files that already exist with non-zero size.
"""
import json
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "photo-manifest.json"

URL_TEMPLATE = "https://images.unsplash.com/photo-{id}?w=2400&q=80&fm=jpg&fit=max"


def download(url: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  skip {dest.relative_to(ROOT)} ({dest.stat().st_size} bytes)")
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (zoltan-mobila-poc)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        print(f"  saved {dest.relative_to(ROOT)} ({len(data)} bytes)")
    except Exception as e:
        print(f"  FAIL {dest.relative_to(ROOT)}: {e}  (url={url})", file=sys.stderr)


def main():
    if not MANIFEST.exists():
        print(f"Missing manifest: {MANIFEST}", file=sys.stderr)
        sys.exit(1)
    spec = json.loads(MANIFEST.read_text(encoding="utf-8"))
    photos = spec["photos"]
    print(f"Downloading {len(photos)} photos...")
    for p in photos:
        url = URL_TEMPLATE.format(id=p["unsplashId"])
        dest = ROOT / p["targetPath"]
        download(url, dest)
        time.sleep(0.1)
    print("Done.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: `photos-attribution.md`** — one line per photo. Built from the manifest.

```markdown
# Photo attribution

All photos sourced from Unsplash (free, royalty-free, commercial use OK; attribution not legally
required but credited here as good practice). Photo IDs map back to source URLs at
`https://unsplash.com/photos/<unsplashId>`.

| Role | Photographer | Unsplash ID | Local path |
|---|---|---|---|
| Home hero | Jane Doe | abc123XYZ | /hero.jpg |
| ... | ... | ... | ... |
```

(Generate the full table from the manifest entries; one row per photo.)

- [ ] **Step 4: STOP — present diff to user**

Say: "Manifest, downloader, and attribution file are committed-ready. **Please review `photo-manifest.json` before I run the download.** I won't run `scripts/download-photos.py` until you give the OK."

Wait for explicit user OK. Then proceed.

### Task 8: Run the downloader (after user OK)

- [ ] **Step 1: Run the download script**

Run: `python C:/projects/smallprojects/zoltan-mobila/scripts/download-photos.py`
Expected: 50+ files saved to `public/`. Re-run if some fail — script is idempotent.

- [ ] **Step 2: Spot-check three photos**

Open `public/hero.jpg`, one portfolio cover, and one material swatch in the file explorer. Confirm they are not 0-byte files and not Unsplash error placeholders.

- [ ] **Step 3: Tell user to commit the photos**

Photos live under `public/` and total ~30–60 MB. The user will decide whether to commit them or use Git LFS. Hand off: "Photos downloaded. Please commit `public/` (or set up LFS if you prefer)."

---

## Phase 6 — Home page

> From here on, build the home page yourself (orchestrator). Subsequent pages (portfolio, materiale, despre, contact) may be dispatched to Sonnet subagents one per task.

### Task 9: Home page sections — Hero, CategoryCards, PortfolioTeaser, MaterialeStrip, ProcessSteps, DespreTeaser, CtaBanner

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/Hero.tsx`
- Create: `components/home/CategoryCards.tsx`
- Create: `components/home/PortfolioTeaser.tsx`
- Create: `components/home/MaterialeStrip.tsx`
- Create: `components/home/ProcessSteps.tsx`
- Create: `components/home/DespreTeaser.tsx`
- Create: `components/home/CtaBanner.tsx`

For each section, follow these conventions:
- Server component unless it needs `useInView` reveals or interaction.
- Use `<Section variant="bg" | "elevated" | "warm">` for vertical rhythm.
- Use `<BlurImage>` for every `<img>`.
- Heading structure: page has one `<h1>` (in Hero); all other sections use `<h2>` with `<Eyebrow>` above.

- [ ] **Step 1: `components/home/Hero.tsx`** — full-bleed photo, centered serif h1, brass CTA, scroll cue

```tsx
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
```

- [ ] **Step 2: `components/home/CategoryCards.tsx`** — 4 cards (1/2/4-col responsive)

```tsx
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
```

- [ ] **Step 3: `components/home/PortfolioTeaser.tsx`** — pulls 6 featured projects from `data/projects.ts`, renders in a masonry-ish grid

```tsx
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostButton } from "@/components/ui/GhostButton";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { featuredProjects } from "@/data/projects";

export function PortfolioTeaser() {
  const items = featuredProjects().slice(0, 6);
  return (
    <Section variant="bg">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow>Portofoliu</Eyebrow>
          <h2 className="mt-3 font-display text-display">Proiecte recente</h2>
        </div>
        <GhostButton href="/portofoliu" className="hidden md:inline-flex">Vezi tot portofoliul</GhostButton>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 2} />
        ))}
      </div>
      <div className="mt-10 md:hidden">
        <GhostButton href="/portofoliu">Vezi tot portofoliul</GhostButton>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: `components/home/MaterialeStrip.tsx`** — horizontal scroll on mobile, grid on desktop; shows 8 swatches

```tsx
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GhostButton } from "@/components/ui/GhostButton";
import { SwatchTile } from "@/components/materiale/SwatchTile";
import { swatches } from "@/data/materiale";

export function MaterialeStrip() {
  const items = swatches.slice(0, 8);
  return (
    <Section variant="elevated">
      <Eyebrow>Materiale</Eyebrow>
      <h2 className="mt-3 font-display text-display max-w-2xl">Finisaje pe care le lucrăm zilnic.</h2>
      <p className="mt-4 max-w-2xl text-text-muted">
        O selecție din peste 200 de finisaje disponibile prin furnizorii noștri din Cluj.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {items.map((s) => (
          <SwatchTile key={s.slug} swatch={s} compact />
        ))}
      </div>
      <div className="mt-10">
        <GhostButton href="/materiale">Explorează paleta</GhostButton>
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: `components/home/ProcessSteps.tsx`** — 3 numbered steps + workshop photo side-by-side on desktop

```tsx
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
```

- [ ] **Step 6: `components/home/DespreTeaser.tsx`**

```tsx
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
```

- [ ] **Step 7: `components/home/CtaBanner.tsx`** — full-bleed walnut block

```tsx
import { PillButton } from "@/components/ui/PillButton";
import { GhostButton } from "@/components/ui/GhostButton";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="bg-walnut text-text py-20 md:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <h2 className="font-display text-display max-w-2xl">
            Gata să discutăm despre proiectul tău?
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <PillButton href="/contact" withArrow>Trimite un mesaj</PillButton>
            <GhostButton href={`tel:${site.phone}`}>{site.phoneDisplay}</GhostButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 8: `app/page.tsx`** — compose

```tsx
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PortfolioTeaser } from "@/components/home/PortfolioTeaser";
import { MaterialeStrip } from "@/components/home/MaterialeStrip";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { DespreTeaser } from "@/components/home/DespreTeaser";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <PortfolioTeaser />
      <MaterialeStrip />
      <ProcessSteps />
      <DespreTeaser />
      <CtaBanner />
    </>
  );
}
```

Note: `PortfolioTeaser` depends on `ProjectCard` and `MaterialeStrip` depends on `SwatchTile`. Build the minimal versions of both as part of this task — they get expanded in Phases 7/8.

- [ ] **Step 9: Minimal `components/portfolio/ProjectCard.tsx`**

```tsx
import Link from "next/link";
import { BlurImage } from "@/components/ui/BlurImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORY_LABELS, type Project } from "@/data/types";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/portofoliu/${project.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-2xl bg-bg-elevated">
        <BlurImage
          src={project.cover}
          alt={project.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <Eyebrow className="mt-4">{CATEGORY_LABELS[project.category]}</Eyebrow>
      <p className="mt-1 font-display text-title">{project.title}</p>
    </Link>
  );
}
```

- [ ] **Step 10: Minimal `components/materiale/SwatchTile.tsx`** (modal logic added in Phase 8)

```tsx
import type { MaterialSwatch } from "@/data/types";
import { BlurImage } from "@/components/ui/BlurImage";
import { cn } from "@/lib/cn";

export function SwatchTile({
  swatch, compact = false, onClick,
}: { swatch: MaterialSwatch; compact?: boolean; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group block w-full text-left",
        onClick && "cursor-pointer",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line">
        {swatch.swatchType === "photo" && swatch.swatchSrc ? (
          <BlurImage src={swatch.swatchSrc} alt={swatch.name} fill sizes="200px" className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: swatch.swatchCss }} />
        )}
      </div>
      <p className={cn("mt-2.5 font-medium", compact ? "text-sm" : "text-base")}>{swatch.name}</p>
      <p className="text-xs text-text-muted">{swatch.tag}</p>
    </Tag>
  );
}
```

- [ ] **Step 11: Run dev and walk the home page in a browser**

Run: `npm run dev`
Open `http://localhost:3000`.
Expected: hero loads with hero.jpg, all sections render, no console errors. Mobile menu works at narrow viewport. Click "Vezi tot portofoliul" → 404 OK (page doesn't exist yet).

---

## Phase 7 — Portfolio (list + detail + lightbox)

> Dispatch as one Sonnet subagent: building portfolio list + detail in a single task keeps card/grid/filter components consistent. Or split into Task 10 (list + filter + grid) and Task 11 (detail + meta + lightbox) — they touch disjoint files except `ProjectCard.tsx`.

### Task 10: `/portofoliu` — list page with filter

**Files:**
- Create: `app/portofoliu/page.tsx`
- Create: `components/portfolio/PortfolioGrid.tsx`
- Create: `components/portfolio/PortfolioFilter.tsx`
- Modify (extend): `components/portfolio/ProjectCard.tsx` (no change expected unless filter needs new prop)

- [ ] **Step 1: `components/portfolio/PortfolioFilter.tsx`** — URL-synced chips

```tsx
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, type Category } from "@/data/types";

const FILTERS: { value: ""; label: "Toate" }[] = [{ value: "", label: "Toate" }];
const CATEGORY_OPTIONS: { value: Category; label: string }[] = (Object.keys(CATEGORY_LABELS) as Category[])
  .map((c) => ({ value: c, label: CATEGORY_LABELS[c] }));

export function PortfolioFilter() {
  const params = useSearchParams();
  const active = (params.get("cat") ?? "") as "" | Category;

  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filtrează portofoliul">
      {[...FILTERS, ...CATEGORY_OPTIONS].map((opt) => {
        const isActive = active === opt.value;
        const href = opt.value ? `/portofoliu?cat=${opt.value}` : "/portofoliu";
        return (
          <Link
            key={opt.value || "all"}
            href={href}
            role="tab"
            aria-selected={isActive}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors min-h-11",
              isActive
                ? "border-brass text-brass bg-brass/10"
                : "border-line text-text-muted hover:text-text hover:border-text-muted",
            )}
          >
            {isActive && <Check className="h-3.5 w-3.5" aria-hidden />}
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: `components/portfolio/PortfolioGrid.tsx`** — receives a filtered list

```tsx
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/types";

export function PortfolioGrid({ items }: { items: Project[] }) {
  if (items.length === 0) {
    return (
      <p className="text-text-muted">Nu există proiecte în această categorie încă.</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <ProjectCard key={p.slug} project={p} priority={i < 3} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: `app/portofoliu/page.tsx`** — server component, reads `searchParams`, filters

```tsx
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { projects } from "@/data/projects";
import type { Category } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Portofoliu", "Proiecte de mobilier la comandă în Cluj-Napoca — bucătării, dressing, living, dormitor.");

export default async function PortofoliuPage(
  { searchParams }: { searchParams: Promise<{ cat?: string }> },
) {
  const { cat } = await searchParams;
  const validCats: Category[] = ["bucatarii", "dressing", "living", "dormitor"];
  const filter = (cat && (validCats as string[]).includes(cat)) ? (cat as Category) : null;
  const items = filter ? projects.filter((p) => p.category === filter) : projects;

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <Eyebrow>Portofoliu</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-display max-w-3xl">
              {projects.length} proiecte semnate de același meșter.
            </h1>
          </div>
          <div className="mt-10">
            <Suspense fallback={null}>
              <PortfolioFilter />
            </Suspense>
          </div>
        </Container>
      </section>
      <section className="pb-24 md:pb-32">
        <Container>
          <PortfolioGrid items={items} />
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run dev. Visit `/portofoliu` — all 8 projects appear. Click "Bucătării" → URL becomes `?cat=bucatarii`, grid filters to 2 projects, chip shows ✓. Browser back-button restores all-filter. No JS errors.

### Task 11: `/portofoliu/[slug]` — detail page with lightbox

**Files:**
- Create: `app/portofoliu/[slug]/page.tsx`
- Create: `components/portfolio/ProjectMeta.tsx`
- Create: `components/portfolio/GalleryLightbox.tsx`

- [ ] **Step 1: `components/portfolio/ProjectMeta.tsx`**

```tsx
import type { Project } from "@/data/types";

export function ProjectMeta({ project }: { project: Project }) {
  const rows: { label: string; value: string }[] = [
    { label: "Categorie", value: { bucatarii: "Bucătărie", dressing: "Dressing", living: "Living", dormitor: "Dormitor" }[project.category] },
    { label: "Material", value: project.meta.material },
    { label: "An", value: String(project.meta.year) },
    { label: "Locație", value: project.meta.location },
    ...(project.meta.surface ? [{ label: "Suprafață", value: `${project.meta.surface} mp` }] : []),
    ...(project.meta.finishes?.length ? [{ label: "Finisaje", value: project.meta.finishes.join(" · ") }] : []),
  ];
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[7rem_1fr] gap-4 py-3 text-sm">
          <dt className="text-text-muted">{r.label}</dt>
          <dd className="text-text">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: `components/portfolio/GalleryLightbox.tsx`** — client wrapper around `yet-another-react-lightbox`

```tsx
"use client";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { BlurImage } from "@/components/ui/BlurImage";

export function GalleryLightbox({ photos, alt }: { photos: string[]; alt: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setOpenAt(i)}
            className="relative aspect-square overflow-hidden rounded-xl bg-bg-elevated"
            aria-label={`Deschide foto ${i + 1}`}
          >
            <BlurImage
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 220px, 33vw"
              className="object-cover transition-transform duration-[600ms] ease-out motion-safe:hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={openAt !== null}
        index={openAt ?? 0}
        close={() => setOpenAt(null)}
        slides={photos.map((src) => ({ src }))}
      />
    </>
  );
}
```

- [ ] **Step 3: `app/portofoliu/[slug]/page.tsx`** — server component, returns 404 for missing slug, renders cover + meta + description + gallery + similar projects

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BlurImage } from "@/components/ui/BlurImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { ProjectMeta } from "@/components/portfolio/ProjectMeta";
import { GalleryLightbox } from "@/components/portfolio/GalleryLightbox";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { projects, projectBySlug } from "@/data/projects";
import { CATEGORY_LABELS } from "@/data/types";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMetadata(p.title, p.description[0]);
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const similar = projects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative h-[60vh] md:h-[60vh] w-full overflow-hidden">
        <BlurImage src={project.cover} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>{CATEGORY_LABELS[project.category]}</Eyebrow>
              <h1 className="mt-3 font-display text-display">{project.title}</h1>
              <div className="mt-8">
                <ProjectMeta project={project} />
              </div>
              <div className="mt-8 space-y-5 text-text-muted">
                {project.description.map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>
            <div>
              <GalleryLightbox photos={[project.cover, ...project.gallery]} alt={project.title} />
            </div>
          </div>
        </Container>
      </section>

      {similar.length > 0 && (
        <section className="bg-bg-elevated py-16 md:py-24">
          <Container>
            <Eyebrow>Proiecte similare</Eyebrow>
            <h2 className="mt-3 font-display text-display">Alte {CATEGORY_LABELS[project.category].toLowerCase()}</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {similar.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </Container>
        </section>
      )}

      <div className="md:hidden sticky bottom-0 z-30 bg-bg-elevated border-t border-line p-4">
        <PillButton href="/contact" className="w-full justify-center">Discută un proiect similar</PillButton>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Visit `/portofoliu/bucatarie-buna-ziua` — cover loads, meta table reads cleanly, description paragraphs render, gallery thumbnails open lightbox on click, "Proiecte similare" shows other bucătărie. Visit `/portofoliu/does-not-exist` → 404.

---

## Phase 8 — Materiale page

### Task 12: `/materiale` — swatch groups + modal

**Files:**
- Create: `app/materiale/page.tsx`
- Create: `components/materiale/SwatchGroup.tsx`
- Create: `components/materiale/SwatchModal.tsx`
- Modify: `components/materiale/SwatchTile.tsx` (wire modal open)

This task can be dispatched to a subagent — it touches only the materiale folder + page.

- [ ] **Step 1: `components/materiale/SwatchModal.tsx`** — client modal, no extra deps (focus trap optional; keep simple)

```tsx
"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { BlurImage } from "@/components/ui/BlurImage";
import { GhostButton } from "@/components/ui/GhostButton";
import type { MaterialSwatch } from "@/data/types";
import { projectBySlug } from "@/data/projects";

export function SwatchModal({ swatch, onClose }: { swatch: MaterialSwatch; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const examples = swatch.exampleProjectSlugs.map(projectBySlug).filter(Boolean);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="swatch-title" className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      <button type="button" aria-label="Închide" onClick={onClose} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl bg-bg-elevated text-text rounded-t-2xl md:rounded-2xl border border-line max-h-[90vh] overflow-y-auto">
        <button type="button" aria-label="Închide" onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center text-text-muted hover:text-text z-10">
          <X className="h-5 w-5" />
        </button>
        <div className="grid gap-0 md:grid-cols-[1fr_1fr]">
          <div className="relative aspect-square w-full">
            {swatch.swatchType === "photo" && swatch.swatchSrc ? (
              <BlurImage src={swatch.swatchSrc} alt={swatch.name} fill sizes="(min-width:768px) 384px, 100vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: swatch.swatchCss }} />
            )}
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{swatch.tag}</p>
            <h2 id="swatch-title" className="mt-2 font-display text-title">{swatch.name}</h2>
            {swatch.description && <p className="mt-3 text-text-muted">{swatch.description}</p>}
            {examples.length > 0 && (
              <>
                <p className="mt-6 text-sm text-text-muted">Folosit în:</p>
                <ul className="mt-2 space-y-1">
                  {examples.map((p) => (
                    <li key={p!.slug}>
                      <GhostButton href={`/portofoliu/${p!.slug}`}>{p!.title}</GhostButton>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `components/materiale/SwatchTile.tsx`** — accept `onClick` to open modal (already in place from Phase 6)

(Already done in Task 9 Step 10. No change.)

- [ ] **Step 3: `components/materiale/SwatchGroup.tsx`** — client wrapper that holds the open-modal state

```tsx
"use client";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwatchTile } from "./SwatchTile";
import { SwatchModal } from "./SwatchModal";
import { SWATCH_GROUP_LABELS, type MaterialSwatch, type SwatchGroupKey } from "@/data/types";

export function SwatchGroup({ groupKey, swatches }: { groupKey: SwatchGroupKey; swatches: MaterialSwatch[] }) {
  const [open, setOpen] = useState<MaterialSwatch | null>(null);
  const labels = SWATCH_GROUP_LABELS[groupKey];
  return (
    <div>
      <Eyebrow>{labels.eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-title">{labels.title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {swatches.map((s) => (
          <SwatchTile key={s.slug} swatch={s} onClick={() => setOpen(s)} />
        ))}
      </div>
      {open && <SwatchModal swatch={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
```

- [ ] **Step 4: `app/materiale/page.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwatchGroup } from "@/components/materiale/SwatchGroup";
import { swatchesByGroup } from "@/data/materiale";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Materiale", "Paletă reprezentativă de finisaje pentru mobilier la comandă — PAL melaminat, lemn masiv, MDF vopsit.");

export default function MaterialePage() {
  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <Eyebrow>Materiale</Eyebrow>
          <h1 className="mt-3 font-display text-display max-w-3xl">
            Paletă reprezentativă, finisaje selectate.
          </h1>
          <p className="mt-5 max-w-2xl text-text-muted">
            Iată o selecție din finisajele cu care lucrăm cel mai des. La cerere accesăm peste 200 de
            decoruri disponibile prin furnizorii noștri din Cluj.
          </p>
        </Container>
      </section>
      <section className="pb-24 md:pb-32 space-y-16 md:space-y-20">
        <Container>
          <div className="space-y-16 md:space-y-20">
            <SwatchGroup groupKey="uni"            swatches={swatchesByGroup("uni")} />
            <SwatchGroup groupKey="imitatie-lemn"  swatches={swatchesByGroup("imitatie-lemn")} />
            <SwatchGroup groupKey="stone"          swatches={swatchesByGroup("stone")} />
            <SwatchGroup groupKey="lemn-masiv"     swatches={swatchesByGroup("lemn-masiv")} />
          </div>
          <p className="mt-20 max-w-2xl text-sm text-text-dim italic">
            Paletă reprezentativă — la cerere lucrăm cu peste 200 de finisaje disponibile prin furnizorii
            noștri din Cluj.
          </p>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify**

Visit `/materiale` — all 13 swatches show in 4 groups. Click any swatch → modal opens with details + linked example project (for swatches with `exampleProjectSlugs`). Escape closes the modal. Body scroll locks while open.

---

## Phase 9 — Despre page

### Task 13: `/despre`

**Files:**
- Create: `app/despre/page.tsx`

Dispatchable to a subagent (single file).

- [ ] **Step 1: `app/despre/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify** — visit `/despre`, all images render, layouts hold at mobile and desktop.

---

## Phase 10 — Contact page + Server Action + Resend

### Task 14: `lib/email.ts` + `.env.example`

**Files:**
- Create: `lib/email.ts`
- Create: `.env.example`

- [ ] **Step 1: `lib/email.ts`**

```ts
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const CATEGORY_LABELS: Record<string, string> = {
  bucatarii: "Bucătărie",
  dressing: "Dressing",
  living: "Living",
  dormitor: "Dormitor",
  altele: "Altele",
};

export async function sendContactEmail(p: ContactPayload) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error("CONTACT_TO_EMAIL is not configured");
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  const categoryLabel = p.category ? (CATEGORY_LABELS[p.category] ?? p.category) : "—";

  const text = [
    `Lead nou — site Zoltan`,
    ``,
    `Nume: ${p.name}`,
    `Telefon: ${p.phone}`,
    `Email: ${p.email || "—"}`,
    `Categorie: ${categoryLabel}`,
    ``,
    `Mesaj:`,
    p.message || "(fără mesaj)",
  ].join("\n");

  const html = `
    <h2 style="font-family: Georgia, serif;">Lead nou — site Zoltan</h2>
    <table cellpadding="6" style="border-collapse: collapse; font-family: -apple-system, sans-serif;">
      <tr><td><strong>Nume</strong></td><td>${escapeHtml(p.name)}</td></tr>
      <tr><td><strong>Telefon</strong></td><td><a href="tel:${escapeHtml(p.phone)}">${escapeHtml(p.phone)}</a></td></tr>
      <tr><td><strong>Email</strong></td><td>${p.email ? `<a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a>` : "—"}</td></tr>
      <tr><td><strong>Categorie</strong></td><td>${escapeHtml(categoryLabel)}</td></tr>
    </table>
    <h3 style="font-family: -apple-system, sans-serif;">Mesaj</h3>
    <p style="font-family: -apple-system, sans-serif; white-space: pre-wrap;">${escapeHtml(p.message || "(fără mesaj)")}</p>
  `;

  return resend.emails.send({
    from: "Zoltan Site <onboarding@resend.dev>",
    to,
    replyTo: p.email || undefined,
    subject: `Lead nou: ${p.name} — ${categoryLabel}`,
    text,
    html,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

- [ ] **Step 2: `.env.example`**

```
# Resend (https://resend.com) — free tier 3,000/mo, 100/day
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Where contact-form submissions get delivered.
CONTACT_TO_EMAIL=you@example.com
```

- [ ] **Step 3: Confirm `.gitignore` ignores `.env*` (except `.env.example`)**

Read `.gitignore`. If it lacks the pattern, add:
```
.env*
!.env.example
```

### Task 15: ContactForm UI + FormField

**Files:**
- Create: `components/forms/FormField.tsx`
- Create: `components/forms/ContactForm.tsx`

- [ ] **Step 1: `components/forms/FormField.tsx`** — labelled wrapper with error slot

```tsx
import { cn } from "@/lib/cn";

export function FormField({
  id, label, required, error, helper, children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  const helperId = helper ? `${id}-help` : undefined;
  const errorId = error ? `${id}-err` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}{" "}
        {required && <span className="text-error" aria-hidden>*</span>}
      </label>
      <div data-describedby={describedBy}>
        {children}
      </div>
      {helper && !error && (
        <p id={helperId} className="mt-1.5 text-xs text-text-muted">{helper}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full border border-line bg-bg-elevated px-4 py-3 text-text placeholder:text-text-dim " +
  "rounded-md transition-colors duration-200 focus:border-brass focus:outline-none min-h-11";
```

- [ ] **Step 2: `components/forms/ContactForm.tsx`** — wired to Server Action via `useActionState`

```tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PillButton } from "@/components/ui/PillButton";
import { FormField, inputClass } from "./FormField";
import { cn } from "@/lib/cn";
import { submitContact, type ContactState } from "@/app/contact/actions";

const CATEGORIES = [
  { value: "", label: "Selectează categoria" },
  { value: "bucatarii", label: "Bucătărie" },
  { value: "dressing",  label: "Dressing" },
  { value: "living",    label: "Living" },
  { value: "dormitor",  label: "Dormitor" },
  { value: "altele",    label: "Altele" },
];

const initialState: ContactState = { ok: false, fieldErrors: {} };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <PillButton type="submit" withArrow={!pending}>
      {pending ? "Se trimite…" : "Trimite mesajul"}
    </PillButton>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialState);

  if (state.ok) {
    return (
      <div role="status" className="rounded-md border border-success/40 bg-success/10 p-6 text-text">
        <p className="font-display text-title">Mulțumesc!</p>
        <p className="mt-2 text-text-muted">Te contactez în cel mult 24h.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-6">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden
        className="hidden"
      />

      <FormField id="contact-name" label="Nume" required error={state.fieldErrors?.name}>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={cn(inputClass, state.fieldErrors?.name && "border-error")}
        />
      </FormField>

      <FormField
        id="contact-phone"
        label="Telefon"
        required
        error={state.fieldErrors?.phone}
        helper="Te sun înapoi în maxim 24h."
      >
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder="07xx xxx xxx"
          className={cn(inputClass, state.fieldErrors?.phone && "border-error")}
        />
      </FormField>

      <FormField id="contact-email" label="Email (opțional)" error={state.fieldErrors?.email}>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nume@exemplu.ro"
          className={cn(inputClass, state.fieldErrors?.email && "border-error")}
        />
      </FormField>

      <FormField id="contact-category" label="Categorie proiect">
        <select id="contact-category" name="category" className={cn(inputClass, "cursor-pointer")}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </FormField>

      <FormField id="contact-message" label="Mesaj" error={state.fieldErrors?.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Spune-mi pe scurt despre proiect — dimensiuni aproximative, finisaje preferate, termen."
          className={cn(inputClass, "resize-y", state.fieldErrors?.message && "border-error")}
        />
      </FormField>

      {state.formError && (
        <p role="alert" className="text-sm text-error">{state.formError}</p>
      )}

      <SubmitButton />
    </form>
  );
}
```

### Task 16: Server Action

**Files:**
- Create: `app/contact/actions.ts`

- [ ] **Step 1: `app/contact/actions.ts`**

```ts
"use server";

import { contactSchema } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "category" | "message", string>>;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    category: String(formData.get("category") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: {
        name: flat.fieldErrors.name?.[0],
        phone: flat.fieldErrors.phone?.[0],
        email: flat.fieldErrors.email?.[0],
        message: flat.fieldErrors.message?.[0],
      },
    };
  }

  // Honeypot tripped — silent success (don't tell the bot anything).
  if (parsed.data.website) {
    return { ok: true };
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      category: parsed.data.category || undefined,
      message: parsed.data.message || undefined,
    });
    return { ok: true };
  } catch (e) {
    console.error("[contact] send failed", e);
    return {
      ok: false,
      formError: "A apărut o eroare la trimitere. Sună direct la numărul de mai sus sau încearcă mai târziu.",
    };
  }
}
```

### Task 17: `/contact` page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: `app/contact/page.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/data/site";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact", "Cere o ofertă pentru mobilier la comandă în Cluj-Napoca.");

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-3 font-display text-display max-w-3xl">Hai să discutăm despre proiectul tău.</h1>
        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6 text-text">
            <a href={`tel:${site.phone}`} className="flex items-start gap-4 group">
              <Phone className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-text-muted">Telefon</span>
                <span className="mt-1 block text-lg group-hover:text-brass">{site.phoneDisplay}</span>
              </span>
            </a>
            <a href={`mailto:${site.email}`} className="flex items-start gap-4 group">
              <Mail className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-text-muted">Email</span>
                <span className="mt-1 block group-hover:text-brass break-all">{site.email}</span>
              </span>
            </a>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-text-muted">Locație</span>
                <span className="mt-1 block">{site.location}</span>
              </span>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 mt-0.5 text-brass shrink-0" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-text-muted">Program</span>
                <span className="mt-1 block">{site.program}</span>
              </span>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
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
```

### Task 18: End-to-end form test (**user provides RESEND_API_KEY**)

- [ ] **Step 1: Stop and ask user for credentials**

Say: "Ready to test the contact form. I need:
1. **RESEND_API_KEY** — get one at https://resend.com (free tier, 3000/mo).
2. **CONTACT_TO_EMAIL** — the address where you want to receive leads.

Paste both here so I can drop them into `.env.local`."

Wait for response.

- [ ] **Step 2: Write `.env.local` with the values supplied**

(Edit only — never commit `.env.local`.)

- [ ] **Step 3: Start dev server in background**

Run: `npm run dev` (background)

- [ ] **Step 4: Submit the form via Playwright / browser MCP / manual**

Either drive the browser via MCP or instruct the user to fill it in at `http://localhost:3000/contact`. Submit with valid data.

Expected:
- Form replaces with "Mulțumesc!" success div.
- Email arrives at `CONTACT_TO_EMAIL` within ~10 seconds.

- [ ] **Step 5: Trip the honeypot**

Open DevTools, find the `name="website"` hidden input, set its value to "spam", submit. Expected: success div shown to the (bot) user but **no email arrives**. (Verify by checking inbox.)

- [ ] **Step 6: Submit invalid input**

Submit with empty name → "Numele este obligatoriu" inline.
Submit with garbage phone → "Număr de telefon invalid".

- [ ] **Step 7: Stop the dev server**

- [ ] **Step 8: Tell the user the form passed end-to-end**

---

## Phase 11 — Polish & verification

### Task 19: `not-found.tsx`, type-check, lint, lighthouse spot-check

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: `app/not-found.tsx`**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: zero warnings or only autofixable warnings; fix any real issues.

- [ ] **Step 4: Production build**

Run: `npm run build`
Expected: clean build; static pages prerendered; route table shows `/`, `/portofoliu`, `/portofoliu/[slug]` (8 dynamic routes prerendered), `/materiale`, `/despre`, `/contact`.

- [ ] **Step 5: Lighthouse mobile spot-check (optional, time-permitting)**

Run `npm run start` after `npm run build`. Open Lighthouse in Chrome on `/`, throttled to mobile 4G. Targets (spec §10): LCP ≤ 2.5s; CLS ≤ 0.1; INP ≤ 200ms. Note any regression and decide with the user whether to fix.

- [ ] **Step 6: Manual page walk on mobile viewport**

In Chrome DevTools (iPhone 12 Pro preset), step through every page. Confirm:
- No horizontal scroll anywhere.
- Hero hero.jpg loads with `priority`.
- Nav transparent on `/`, solid elsewhere.
- Mobile menu opens and locks scroll.
- All CTAs are tappable (≥ 44 px tall).
- Focus rings visible on Tab.
- Demo banner does **not** appear on localhost (Step 7 will verify it does on Netlify).

- [ ] **Step 7: Hand off to user for deploy**

Say: "POC is feature-complete. To deploy:
1. Commit & push to `develop`.
2. Connect the repo in Netlify (build: `npm run build`, publish: `.next` — default Next plugin handles SSR routes).
3. Set env vars `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in the Netlify dashboard.
4. Verify the deployed URL: open it on your Android, confirm the demonstration banner appears (it's hidden on localhost), submit the form, watch the email land.

I'm not running the deploy commands per your standing rule."

---

## Self-review

Spec coverage (§-by-§):
- §1 success criteria — addressed by demo banner (§4 spec / Task 4), Resend (Tasks 14–18), mobile-first build (whole plan).
- §2 aesthetic / tokens — Task 2.
- §3 branding — `data/site.ts` (Task 3 + nav/footer); replaceable via one find-and-replace.
- §4 IA + pages — Tasks 9 (home), 10–11 (portfolio), 12 (materiale), 13 (despre), 17 (contact).
- §5 data model — Task 6.
- §6 photo plan — Tasks 7–8 with explicit review checkpoint.
- §7 components — File structure above + tasks per cluster.
- §8 contact flow — Tasks 14–18.
- §9 tech stack — Task 1.
- §10 perf budget — Task 19 step 5.
- §11 deploy — Task 19 step 7 (user owns the deploy).
- §12 Phase B — out of scope, noted.
- §13 risks — manifest review (mitigates Unsplash curation risk); demo banner (mitigates fake-project-names risk); env-var-driven Resend (mitigates sender-domain risk via inbox/spam pre-flight).
- §14 build order — matches the phase numbering here.

Placeholder scan: none ("TBD", "implement later", "handle edge cases", etc. all absent).

Type consistency: `Category`, `Material`, `MaterialSwatch`, `Project`, `Testimonial` defined in `data/types.ts` and consistently used in `data/*` files, `ContactForm.tsx`, `actions.ts`, page files. `submitContact`/`ContactState` types match between `actions.ts` and `ContactForm.tsx`. The `imitatie-lemn` swatches currently use `swatchType: "gradient"` — if real photos drop in later, switch them to `swatchType: "photo"` + `swatchSrc` (one-line change per swatch).

Out-of-spec deviations:
- Lighthouse pass is marked optional in Task 19. Spec §10 lists it as a target. Flagged here so user can insist if they want it gated.
- Contact map uses OpenStreetMap embed (no key, no tracking) instead of Google Maps. Spec §4 says "Google Map iframe" — OSM is functionally equivalent and avoids the Google CDN dependency. Confirm with user if Google Maps preferred.

---

## Execution choice

Plan saved to [docs/superpowers/plans/2026-05-19-zoltan-mobila-poc-plan.md](docs/superpowers/plans/2026-05-19-zoltan-mobila-poc-plan.md). Two execution options:

1. **Subagent-driven (recommended)** — I dispatch a fresh Sonnet subagent per task in Phases 7, 8, 9, 10 (and possibly within Phase 6 for individual home sections). Phases 1–6 I build inline, since they lock conventions every later task depends on. Two-stage review between tasks.
2. **Inline** — I execute every task in this session.

**Recommendation: subagent-driven, starting after I finish Phase 6 inline.**
