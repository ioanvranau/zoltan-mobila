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
  cover: string;
  gallery: string[];
  meta: {
    location: string;
    year: number;
    surface?: number;
    material: Material;
    finishes?: string[];
  };
  description: string[];
  featured: boolean;
}

export type SwatchGroupKey = "uni" | "imitatie-lemn" | "stone" | "lemn-masiv";

export const SWATCH_GROUP_LABELS: Record<SwatchGroupKey, { eyebrow: string; title: string }> = {
  uni:             { eyebrow: "Finisaje uni",  title: "Mat & Lucios" },
  "imitatie-lemn": { eyebrow: "PAL melaminat", title: "Imitație lemn" },
  stone:           { eyebrow: "Stone & Beton", title: "Suprafețe minerale" },
  "lemn-masiv":    { eyebrow: "Lemn masiv",    title: "Esențe naturale" },
};

export interface MaterialSwatch {
  slug: string;
  name: string;
  group: SwatchGroupKey;
  swatchType: "photo" | "gradient";
  swatchSrc?: string;
  swatchCss?: string;
  tag: "PAL" | "Lemn masiv" | "MDF" | "Stone";
  description?: string;
  exampleProjectSlugs: string[];
}

export interface Testimonial {
  author: string;
  text: string;
  project?: string;
}
