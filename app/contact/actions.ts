"use server";

import { contactSchema } from "@/lib/validation";
import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "category" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    category: String(formData.get("category") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const flat = result.error.flatten();
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

  if (result.data.website) {
    return { ok: true };
  }

  try {
    await sendContactEmail({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || undefined,
      category: result.data.category || undefined,
      message: result.data.message || undefined,
    });
    return { ok: true };
  } catch (e) {
    console.error("[contact] send failed", e);
    return {
      ok: false,
      formError:
        "A apărut o eroare la trimitere. Sună direct la numărul de mai sus sau încearcă mai târziu.",
    };
  }
}
