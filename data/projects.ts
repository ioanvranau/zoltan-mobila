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
