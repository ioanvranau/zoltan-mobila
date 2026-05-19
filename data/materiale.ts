import type { MaterialSwatch } from "./types";

export const swatches: MaterialSwatch[] = [
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

  { slug: "stejar-sonoma",  name: "Stejar Sonoma",  group: "imitatie-lemn", swatchType: "photo", swatchSrc: "/materiale/stejar-sonoma.jpg", tag: "PAL",
    exampleProjectSlugs: ["dressing-marasti"] },
  { slug: "stejar-halifax", name: "Stejar Halifax", group: "imitatie-lemn", swatchType: "photo", swatchSrc: "/materiale/stejar-halifax.jpg", tag: "PAL",
    exampleProjectSlugs: ["bucatarie-buna-ziua"] },
  { slug: "nuc",            name: "Nuc",            group: "imitatie-lemn", swatchType: "photo", swatchSrc: "/materiale/nuc.jpg", tag: "PAL",
    exampleProjectSlugs: ["bucatarie-dambul-rotund"] },
  { slug: "frasin",         name: "Frasin",         group: "imitatie-lemn", swatchType: "photo", swatchSrc: "/materiale/frasin.jpg", tag: "PAL",
    exampleProjectSlugs: ["dormitor-buna-ziua"] },

  { slug: "beton",          name: "Beton",          group: "stone", swatchType: "gradient", tag: "Stone",
    swatchCss: "linear-gradient(135deg, #8a8278 0%, #6a635a 100%)",
    exampleProjectSlugs: [] },
  { slug: "marmura-alba",   name: "Marmură albă",   group: "stone", swatchType: "gradient", tag: "Stone",
    swatchCss: "linear-gradient(135deg, #e8e2d4 0%, #c8c0b0 100%)",
    exampleProjectSlugs: [] },

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
