import { Resend } from "resend";

const CATEGORY_LABELS: Record<string, string> = {
  bucatarii: "Bucătărie",
  dressing: "Dressing",
  living: "Living",
  dormitor: "Dormitor",
  altele: "Altele",
};

let resend: Resend | undefined;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(p: {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    throw new Error("CONTACT_TO_EMAIL is not configured");
  }

  const categoryLabel = p.category
    ? (CATEGORY_LABELS[p.category] ?? p.category)
    : "—";

  const text = [
    `Nume: ${p.name}`,
    `Telefon: ${p.phone}`,
    `Email: ${p.email || "—"}`,
    `Categorie: ${categoryLabel}`,
    `Mesaj: ${p.message || "—"}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;color:#1a1a1a;margin:0;padding:0">
  <div style="max-width:560px;margin:32px auto;padding:0 16px">
    <h2 style="margin:0 0 8px;font-size:22px">Lead nou de pe site</h2>
    <h3 style="margin:0 0 20px;font-size:14px;color:#666;font-weight:normal">
      ${escapeHtml(p.name)} &mdash; ${escapeHtml(categoryLabel)}
    </h3>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      <tbody>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;background:#f9f9f9;font-weight:600;width:130px">Nume</td>
          <td style="padding:10px 12px;border:1px solid #e0e0e0">${escapeHtml(p.name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;background:#f9f9f9;font-weight:600">Telefon</td>
          <td style="padding:10px 12px;border:1px solid #e0e0e0">${escapeHtml(p.phone)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;background:#f9f9f9;font-weight:600">Email</td>
          <td style="padding:10px 12px;border:1px solid #e0e0e0">${p.email ? escapeHtml(p.email) : "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;background:#f9f9f9;font-weight:600">Categorie</td>
          <td style="padding:10px 12px;border:1px solid #e0e0e0">${escapeHtml(categoryLabel)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;background:#f9f9f9;font-weight:600">Mesaj</td>
          <td style="padding:10px 12px;border:1px solid #e0e0e0;white-space:pre-wrap">${p.message ? escapeHtml(p.message) : "—"}</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: "Zoltan Site <onboarding@resend.dev>",
    to,
    replyTo: p.email || undefined,
    subject: `Lead nou: ${p.name} — ${categoryLabel}`,
    text,
    html,
  });
}
