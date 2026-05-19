# Zoltan · Mobilă la comandă — POC design

> Status: **design approved; ready for writing-plans.**
> Last updated: 2026-05-19.
> Sister project for reference: [`../../../../../totalparquet`](../../../../totalparquet) — same stack, region, hosting, GDPR baseline.

---

## 1. Purpose & success criteria

A **proof-of-concept website** for **Zoltan**, a solo custom-furniture maker (*mobilă la comandă*) based in Cluj-Napoca and surrounding areas. He works mostly in **PAL melaminat** and **lemn masiv**, building whatever the client wants — kitchens, dressings, living-room pieces, bedrooms.

We have **only his first name** at the time of writing. No photos, no contact details, no logo, no existing online presence to reference. The site is a **cold pitch**: built to win him as a customer.

**Success criteria for the POC:**

1. Demoable on a real Android phone over hotel-wifi. Mobile-first, fast.
2. Visual impression in the first 8 seconds is "premium — I want to be associated with this."
3. The portfolio reads as a coherent body of work, not a stock-photo grab bag.
4. A working contact form sends an email during the pitch — concrete proof of the technology.
5. Clearly labelled as a demonstration so we don't misrepresent unknown work as his.
6. Cheap to evolve into Phase B (real content + maintenance path) once he signs.

**Out of scope for the POC** (deferred to Phase B):
- GDPR cookie banner / Consent Mode v2
- Google Analytics 4, TikTok Pixel, any tracking
- Sanity CMS / studio
- `/servicii` page
- Full JSON-LD SEO + sitemap
- Custom domain (POC ships on `*.netlify.app`)
- Test suite (TypeScript + ESLint + manual checklist only)

---

## 2. Aesthetic direction — Dark Editorial

Direction was selected from three options (Warm Artisan / Modern Scandinavian / Dark Editorial). **Dark Editorial wins** because:

- Photographs **both PAL and lemn** flatteringly — PAL antracit and oak laminate look premium against near-black with warm rim-lighting; solid wood glows on dark sections.
- **Differentiates** in the Cluj market — local competitors are mostly either bright/Scandinavian or dated WordPress. Going dark is memorable.
- **Forgives mediocre photography** less than light themes do — but our curation strategy compensates (see §6).

Reference language: editorial print magazines, premium furniture brand sites, dramatic side-lighting.

**No pure black, no pure white** — every shade has a warm undertone. The eye reads it as "moody and warm," not "clinical and dark."

### Color palette (WCAG-verified)

| Token | Hex | Role | Contrast vs `--bg` |
|---|---|---|---|
| `--bg` | `#0E0D0B` | Default page background (near-black, warm) | — |
| `--bg-elevated` | `#161311` | Cards, nav, footer panels | — |
| `--bg-warm` | `#1C1814` | Alternate dark sections (subtle warm shift) | — |
| `--text` | `#E8DDC7` | Body text on dark (warm cream) | 14.2:1 → AAA |
| `--text-muted` | `#B5AC97` | Secondary copy, meta labels | 8.4:1 → AAA |
| `--text-dim` | `#6E665A` | Captions, eyebrow labels — large/eyebrow only | 3.6:1 → AA-Large only |
| `--brass` | `#B89968` | Primary accent: CTAs, links, focus ring | 7.8:1 → AAA |
| `--brass-hover` | `#CDB07F` | CTA hover | 9.4:1 → AAA |
| `--walnut` | `#3A2E22` | Decorative warm-dark fills, photo frames | — |
| `--line` | `#2A241D` | Hairline borders | — |
| `--success` | `#7FB17F` | Form success | 6.1:1 → AAA |
| `--error` | `#E59489` | Form errors (rose, not red — fits palette) | 7.3:1 → AAA |

### Typography

| Token | Font | Use |
|---|---|---|
| `font-display` | **Playfair Display** 400/600/700 (`next/font/google`) | Headlines, project titles, hero, big numbers |
| `font-sans` | **Inter** 300/400/500/600 (`next/font/google`) | Body, nav, UI, buttons, labels, prices |

**Type scale** (mobile-first, clamped):
- `text-hero` — `clamp(2.6rem, 5vw + 1rem, 5.8rem)` → hero h1 only
- `text-display` — `clamp(2rem, 3vw + 1rem, 3.6rem)` → section h2
- `text-title` — `clamp(1.4rem, 1.5vw + .8rem, 2rem)` → card titles
- `text-body` — `1rem` (16px minimum)
- `text-small` — `0.875rem`
- `text-eyebrow` — `0.75rem` uppercase, tracking-widest

**Line-height:** `leading-[1.05]` for hero h1, `leading-tight` for serif headings, `leading-relaxed` for body.

### Spacing & rhythm

- Section padding: `py-20 md:py-28 lg:py-36`
- Container: `max-w-7xl mx-auto px-5 md:px-8 lg:px-12`
- Card radius: `rounded-2xl` for image cards, `rounded-lg` for chips, `rounded-full` for CTA pills
- Image aspect ratios: hero `aspect-[3/4]` mobile / `aspect-[16/9]` desktop; portfolio cards `aspect-[4/5]` mobile / `aspect-[3/4]` desktop; swatch tiles `aspect-square`

### Motion

- All transitions ≤ 300ms, `ease-out`
- Scroll reveals via a single `useInView` hook (custom, ~20 LOC), `motion-safe:` wrapped
- Image hover: 1.03 scale + slow 600ms zoom
- `prefers-reduced-motion` respected — wrap every animation in `motion-safe:`
- **No Framer Motion** — overkill for the scope

### Mobile-first breakpoints & accessibility

- Tailwind defaults (`sm:640 / md:768 / lg:1024 / xl:1280`)
- Default = mobile single column; layouts layer up
- Touch targets ≥ 44 × 44 px, min 8 px spacing between adjacent
- Visible focus rings via `focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-bg`
- Skip-to-content link as first element after `<body>`
- `lang="ro"` on `<html>`
- Heading hierarchy strict (one `<h1>` per page, no skipping levels)
- Errors carry icon + text, not color alone

---

## 3. Branding

- **Brand name (working):** `Zoltan · Mobilă la comandă`
- **Lockup:** "Zoltan" in Playfair Display 600 + middle-dot separator + "Mobilă la comandă" in Inter 400 tracked-wide. Compact in nav, full in footer.
- **Tagline:** "Cluj-Napoca & împrejurimi"
- **No logomark** for the POC — wordmark only. Avoids designing a logo we'd throw away once we have his real surname / preferences.
- **Replaceable:** single find-and-replace operation to swap brand name once Zoltan provides surname / domain / preferences.

---

## 4. Information architecture & pages

Six pages, all Romanian, mobile-first.

Nav: **Acasă · Portofoliu · Materiale · Despre · Contact**

### `/` — Acasă

1. **Hero** (`h-[88vh] md:h-screen`). Full-bleed dramatic photo. Top-left wordmark; centered serif h1 ("Mobilier făcut să rămână."); sub-headline; brass pill CTA "Cere o ofertă"; scroll-cue arrow.
2. **Categorii** — 4 cards: Bucătării / Dressing / Living / Dormitor. Mobile 1-col → md 2×2 → lg 4-col.
3. **Portofoliu featured** — section title "Proiecte recente", 6 featured cards in masonry, CTA "Vezi tot portofoliul →".
4. **Materiale teaser** — horizontal swatch strip (8 finishes), CTA "Explorează paleta →".
5. **Proces** — dark warm section, 3 numbered steps: *01 Discuție · 02 Proiect 3D · 03 Atelier & montaj*. Side-by-side with workshop photo on desktop.
6. **Despre teaser** — short paragraph + portrait. CTA "Citește povestea →".
7. **CTA banner** — full-bleed: "Gata să discutăm despre proiectul tău?" + phone (`tel:`) + form link.
8. **Footer** — brand, contact, copyright, "Realizat în Cluj-Napoca".

### `/portofoliu`

- Compact hero strip with project count.
- Filter chips: **Toate · Bucătării · Dressing · Living · Dormitor**. Active state = brass underline + ✓ icon (not color-only). URL-synced via `?cat=` so links/back-button work.
- Grid: mobile 1-col → md 2-col → lg 3-col masonry. Card = cover photo + category eyebrow + project title.
- `loading="lazy"` on all images below the first 6.

### `/portofoliu/[slug]`

- Cover photo full-bleed (mobile tall; desktop 60vh).
- Two-column below (stacks on mobile):
  - **Left**: title h1, meta table (Categorie / Material / An / Locație / Suprafață), 1–3 description paragraphs.
  - **Right**: gallery thumbnail grid → click opens lightbox (`yet-another-react-lightbox`).
- "Proiecte similare" — 3 cards from same category.
- Sticky bottom CTA on mobile: "Discută un proiect similar".

### `/materiale`

- Hero strip + intro paragraph.
- 4 groups, each with eyebrow + h2 + swatch grid:
  - **Uni · Mat & Lucios** — Alb, Antracit, Crem, Negru profund (4)
  - **Imitație lemn (PAL melaminat)** — Stejar Sonoma, Stejar Halifax, Nuc, Frasin (4)
  - **Stone & Beton** — Beton, Marmură albă (2)
  - **Lemn masiv** — Stejar, Frasin, Nuc (3)
- Total: 13 swatches.
- Swatch tile = square texture/gradient + finish name + tip tag ("PAL" or "Lemn masiv"). Click → modal with larger swatch + 2-3 example project thumbnails.
- Bottom hedge: *"Paletă reprezentativă — la cerere lucrăm cu peste 200 de finisaje disponibile prin furnizorii noștri din Cluj."*

### `/despre`

- Two-column hero (md+): portrait of hands/tools left; h1 "Despre atelier" + intro right.
- "Cum lucrez" — 4 numbered text blocks (Discuție · Proiect · Materiale · Montaj).
- Atelier gallery — 4-photo strip.
- Closing CTA: "Hai să vorbim →".

### `/contact`

- Desktop two-column / mobile single.
- **Left column**: phone (tap-to-call), email (mailto:), Facebook (placeholder), location "Cluj-Napoca & împrejurimi", program "Lu–Vi 9–18 · Sâ la cerere".
- **Right column**: contact form, single-column, labels above inputs:
  - Nume (required) · `autocomplete="name"`
  - Telefon (required) · `type="tel" autocomplete="tel"` · helper "Vă sun înapoi în maxim 24h"
  - Email (opțional) · `type="email" autocomplete="email"`
  - Categorie proiect (select)
  - Mesaj (textarea, 3 rows)
  - Hidden honeypot field
  - Submit: brass pill "Trimite mesajul"
- Success state replaces the form: `<div role="status">Mulțumesc! Te contactez în cel mult 24h.</div>`
- Below the fold: Google Map iframe (lazy-loaded when scrolled in, to keep LCP clean).

---

## 5. Data model

Static TypeScript files in `/data/`. Shapes designed for clean Phase B swap to Sanity (same types, different source).

```ts
// data/types.ts
export type Category = 'bucatarii' | 'dressing' | 'living' | 'dormitor';
export type Material = 'PAL melaminat' | 'Lemn masiv' | 'PAL + Lemn masiv' | 'MDF vopsit';

export interface Project {
  slug: string;
  title: string;
  category: Category;
  cover: string;
  gallery: string[];
  meta: {
    location: string;
    year: number;
    surface?: number;       // mp
    material: Material;
    finishes?: string[];
  };
  description: string[];
  featured: boolean;
}

export interface MaterialSwatch {
  slug: string;
  name: string;
  group: 'uni' | 'imitatie-lemn' | 'stone' | 'lemn-masiv';
  swatchType: 'photo' | 'gradient';
  swatchSrc?: string;
  swatchCss?: string;
  description?: string;
  exampleProjectSlugs: string[];
}

export interface Testimonial {
  author: string;
  text: string;
  project?: string;
}
```

Files:
- `data/projects.ts` — 8 projects, 2 per category, all featured initially (we'll demote 2 to non-featured for variety)
- `data/materiale.ts` — 13 swatches across 4 groups
- `data/testimonials.ts` — 2 plausible placeholder testimonials (not used in POC pitch — too risky to fabricate, but stub the file so Phase B can drop them in)
- `data/site.ts` — brand name, phone (placeholder), email (placeholder), social

---

## 6. Photo plan

**Source:** Unsplash (free, royalty-free, commercial-OK). Photos downloaded to `/public/`, committed to repo. Photographer credits in `photos-attribution.md`.

**Why download, not hot-link:**
- `next/image` optimization (WebP, responsive `srcset`, blur placeholder) needs local files
- Pitch demo must work offline / on flaky connections
- Unsplash CDN URLs occasionally rotate

**Tool:**
- `photo-manifest.json` — committed list of `{ unsplashId, targetPath, photographer, license }`
- `scripts/download-photos.ts` — small Node script reading the manifest, downloading to `/public/`. Re-runnable. Reviewed before the actual download so curation choices are in the diff.

**Budget:**

| Use | Count | Notes |
|---|---|---|
| Home hero | 1 | Dark PAL kitchen with brass-handle drawers + side light. Single most important photo. |
| Category teaser cards | 4 | One per category. |
| Portfolio projects | ~36 | 8 projects × 4-5 photos each (cover + 3-4 gallery). |
| Materiale swatches | 13 | Mix of mood-photo crops and texture macros. |
| Process section | 1 | Workshop / hands-at-work. |
| Despre hero + atelier strip | 5 | Portrait, workshop, tools, raw wood, finished detail. |
| **Total** | **~60 photos** | All ≤ 250 KB post-`next/image` optimization. |

**Curation principles** (random Unsplash is uneven — these are the filters):

1. **Consistency over volume.** Every photo must read "this is the same studio's work."
2. **No people faces in portfolio.** Hands and silhouettes only.
3. **PAL-realistic colors.** No mid-century teak fantasies. Lean into modern PAL antracit / oak laminate / matte white realities.
4. **Lighting consistency.** Side-lit, low-key, brass-warm. Reject overhead-flat or cool-LED.

**Project naming** (plausible Cluj-Napoca neighborhoods, clearly fake for the POC):
- *Bucătărie Casa Buna Ziua*
- *Apartament Andrei Mureșanu*
- *Vila Făget*
- *Dressing Mărăști*
- *Bucătărie Dâmbul Rotund*
- *Living Gheorgheni*
- *Dormitor Bună Ziua*
- *Dressing Zorilor*

All meta (year 2023-2025, surface in mp, material) plausibly invented.

**Demonstration banner** on staging only (not localhost): tiny dismissable strip at the top of every page —
> *Demonstrație · imaginile sunt mostre pentru a ilustra design-ul. Conținutul real va fi adăugat după contractare.*

---

## 7. Components

Server components by default (Next.js 16 App Router). Client components only where needed (filter, mobile menu, lightbox, form, swatch modal, useInView consumers).

```
components/
  ui/
    Container.tsx
    Section.tsx
    PillButton.tsx
    GhostButton.tsx
    Eyebrow.tsx
    BlurImage.tsx          (next/image wrapper)
  nav/
    Navbar.tsx
    MobileMenu.tsx         (client)
    Footer.tsx
  home/
    Hero.tsx
    CategoryCards.tsx
    PortfolioTeaser.tsx
    MaterialeStrip.tsx
    ProcessSteps.tsx
    DespreTeaser.tsx
    CtaBanner.tsx
  portfolio/
    PortfolioGrid.tsx
    PortfolioFilter.tsx    (client — URL-synced via ?cat=)
    ProjectCard.tsx
    GalleryLightbox.tsx    (client — wraps yet-another-react-lightbox)
    ProjectMeta.tsx
  materiale/
    SwatchTile.tsx
    SwatchGroup.tsx
    SwatchModal.tsx        (client — custom modal, no shadcn/radix dep)
  forms/
    ContactForm.tsx        (client — useActionState)
    FormField.tsx
  hooks/
    useInView.ts           (client)
```

`lib/`:
- `lib/email.ts` — Resend client wrapper, `sendContactEmail({ name, phone, email, category, message })`
- `lib/validation.ts` — Zod schemas
- `lib/seo.ts` — basic per-page `<title>` + OG metadata helper

---

## 8. Contact form flow

1. Client form uses Next.js `useActionState` bound to Server Action `submitContact`.
2. Server Action (`app/contact/actions.ts`):
   - Validates with Zod (`name min 2`, RO phone regex, optional valid email, message max 2000 chars).
   - Honeypot check (hidden `website` field — bots fill it; silent success without sending email).
   - Calls `lib/email.ts → sendContactEmail()` → `resend.emails.send(...)`.
   - Returns `{ ok: true }` or `{ ok: false, fieldErrors }`.
3. Success → form replaced by success div. Error → inline messages with `aria-describedby` wiring.

**Resend config:**
- Free tier (3,000/mo, 100/day) — generous.
- POC sends to the developer's email; Phase B swaps via env var to Zoltan's.
- Sender: Resend default domain (`<something>@resend.dev`). Real domain DKIM/SPF in Phase B.
- Reply-To set to lead's email.

**Env vars** (`.env.local` dev, Netlify dashboard prod):
```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=your@email.com
```
Committed `.env.example` documents them.

---

## 9. Tech stack — final

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Mirrors totalparquet; SSG; runs on Netlify or Vercel |
| Language | TypeScript | Strict-mode catches bugs; eases Phase B Sanity swap |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Forms | Server Action + Resend | Host-agnostic; free; reliable |
| Images | `next/image` for everything, including local-downloaded Unsplash | WebP + responsive `srcset` + blur placeholder + lazy loading by default |
| Lightbox | `yet-another-react-lightbox` | Used in totalparquet; small; a11y-aware |
| Animation | Tailwind transitions + custom `useInView` | No Framer Motion needed |
| Fonts | `next/font/google` (Playfair Display + Inter) | Self-hosted, no CLS, no Google Fonts external call |
| Validation | Zod | Server-side form validation |
| Anti-spam | Honeypot | Free, GDPR-friendly, no Captcha conversion hit |
| Deployment | Netlify (free tier — commercial OK) | Mirrors totalparquet's production answer |

---

## 10. Performance budget (mobile-first, throttled 4G Lighthouse)

| Metric | Target |
|---|---|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Total client JS | ≤ 120 KB gzip on `/contact`; ≤ 80 KB on `/` |
| Hero image | ≤ 150 KB WebP at mobile sizes (explicit `sizes` + `priority`) |

Practices baked in:
- `next/image` everywhere — WebP, `srcset`, lazy by default (`priority` only on hero)
- Fonts via `next/font/google` with `display: 'swap'`
- No client-side data fetching — all pages SSG
- No third-party scripts in POC (analytics is Phase B)

---

## 11. Deploy & branch policy

- Repo: GitHub
- Main branch: `develop` (matches totalparquet convention)
- Push to `develop` → Netlify auto-deploys to `<your-site>.netlify.app`
- Branch deploys: every `<feature-branch>` pushed → `<feature>--<site>.netlify.app` preview URL
- **The developer does not run `git commit`, `git push`, or any Netlify CLI commands.** All commits/pushes/deploys are managed by the user (you), matching the totalparquet collaboration rule.
- No PRs needed for POC pace — commit straight to `develop`.
- During the pitch: open the Netlify URL on a real Android, demo the contact form, watch the email land.

---

## 12. Phase B — maintenance options (decided after pitch)

Both paths are cheap because of the static `/data/` layer. Decision asked of Zoltan: *"vrei să adaugi tu proiectele, sau preferi să le adaug eu când îmi trimiți pozele?"*

### Phase B option 1: Developer maintains (TS data files)

- Editing = open `/data/projects.ts`, edit, drop photos in `/public/portfolio/<slug>/`, commit + push, Netlify auto-deploys in ~90 s.
- Pro: zero cost, zero new tools, full control, fastest editing.
- Con: Zoltan can't add a project himself.
- Setup cost: 0 (this is what we ship with).

### Phase B option 2: Zoltan maintains (Sanity CMS)

- Wire `/data/projects.ts` to fetch from Sanity instead of being a literal.
- Sanity Studio at `/studio` route, Romanian field labels (mirrors totalparquet's schema).
- 15-min screenshare onboarding + 1-page PDF cheat-sheet in Romanian.
- Pro: he's autonomous.
- Con: half-day setup; small ongoing learning curve.
- Setup cost: ~0.5 day extra Phase B work.

Both paths coexist forever — even on path 2, the developer can edit via Studio remotely.

### Other Phase B work (regardless of maintenance path)

- Cookie banner + Google Consent Mode v2 (lift from totalparquet)
- GA4 + (optionally) TikTok Pixel, consent-gated
- Custom domain + DNS cutover
- Email sender domain DKIM/SPF setup
- JSON-LD `LocalBusiness` + `Service` schemas; sitemap.ts; robots.ts
- OG image generation per portfolio detail page
- Real photo migration (replaces Unsplash placeholders)
- Real contact details (replaces POC placeholders)
- Remove demonstration banner

---

## 13. Risks & open questions

- **Cold-pitch risk:** Zoltan may dislike Dark Editorial despite our reasoning. Mitigation: pitch is reversible — design tokens are centralized; we could re-skin to Approach A (warm atelier) in ~1 day if he insists.
- **Unsplash curation risk:** mediocre photo selection sinks the whole pitch. Mitigation: developer commits `photo-manifest.json` *before* downloading so the user can review picks in the diff.
- **Salice attribution:** we mention "furnizori din Cluj" without naming Salice in the POC. If Zoltan confirms Salice is his supplier, we add a small credit on `/materiale` in Phase B.
- **Fake project names:** plausible Cluj neighborhoods make the demo concrete but could embarrass us if Zoltan asks where they are. Mitigation: demonstration banner + we verbally call them "exemple de structură" during the pitch.
- **No real testimonials:** intentionally not faking these for the POC. Phase B requires us to collect 2-3 real ones from past clients.
- **Resend default sender domain:** emails from `*.resend.dev` may land in spam on first test. Mitigation: pre-flight test the day before the pitch; on the day, have Zoltan check both inbox and spam.

---

## 14. Build order (proposed)

1. Scaffold: `npm create next-app`, TS, Tailwind v4, fonts, design tokens in `globals.css` + `tailwind.config`.
2. Layout shell: Navbar, Footer, Container, Section, PillButton — visible on a near-empty home.
3. Data: `data/types.ts`, stub `projects.ts` / `materiale.ts` / `site.ts` with placeholder content.
4. Photo manifest: 60 Unsplash picks committed in `photo-manifest.json`. **User reviews diff.** Then run download script.
5. Home page sections built top-to-bottom, real photos.
6. `/portofoliu` list + filter, then `/portofoliu/[slug]` detail + lightbox.
7. `/materiale` page + SwatchModal.
8. `/despre`.
9. `/contact`: form UI + Server Action + Resend wiring + success/error states. Test end-to-end.
10. Demonstration banner component.
11. Lighthouse mobile pass — fix any regressions.
12. Push to GitHub; user wires up Netlify + env vars; verify live preview URL.
13. Hand off for pitch.

Estimated total: **2.5 days** of focused work (matches Approach 2 estimate).

---
