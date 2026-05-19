import { z } from "zod";

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
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
