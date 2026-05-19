"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { FormField, inputClass } from "@/components/forms/FormField";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/cn";

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
      <div
        role="status"
        className="rounded-md border border-success/40 bg-success/10 p-6"
      >
        <p className="font-display text-title">Mulțumesc!</p>
        <p className="mt-2 text-text-muted">Te contactez în cel mult 24h.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-6">
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden
        className="hidden"
      />

      <FormField
        id="name"
        label="Nume"
        required
        error={state.fieldErrors?.name}
      >
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={cn(
            inputClass,
            state.fieldErrors?.name && "border-error",
          )}
        />
      </FormField>

      <FormField
        id="phone"
        label="Telefon"
        required
        error={state.fieldErrors?.phone}
        helper="Te sun înapoi în maxim 24h."
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder="07xx xxx xxx"
          className={cn(
            inputClass,
            state.fieldErrors?.phone && "border-error",
          )}
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        error={state.fieldErrors?.email}
      >
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nume@exemplu.ro"
          className={cn(
            inputClass,
            state.fieldErrors?.email && "border-error",
          )}
        />
      </FormField>

      <FormField id="category" label="Categorie proiect">
        <select
          id="category"
          name="category"
          className={cn(inputClass, "cursor-pointer")}
        >
          <option value="">Selectează categoria</option>
          <option value="bucatarii">Bucătărie</option>
          <option value="dressing">Dressing</option>
          <option value="living">Living</option>
          <option value="dormitor">Dormitor</option>
          <option value="altele">Altele</option>
        </select>
      </FormField>

      <FormField
        id="message"
        label="Mesaj"
        error={state.fieldErrors?.message}
      >
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Spune-mi pe scurt despre proiect — dimensiuni aproximative, finisaje preferate, termen."
          className={cn(
            inputClass,
            "resize-y",
            state.fieldErrors?.message && "border-error",
          )}
        />
      </FormField>

      {state.formError && (
        <p role="alert" className="text-sm text-error">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
