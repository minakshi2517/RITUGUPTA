"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, null);
  if (state?.ok) {
    return <p className="font-serif text-3xl italic leading-snug">{state.message}</p>;
  }
  return (
    <form action={action} className="relative grid gap-7">
      {state?.message ? <p className="note-err">{state.message}</p> : null}
      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label>
        <span className="studio-label">Name</span>
        <input className="studio-input" name="name" autoComplete="name" required />
      </label>
      <label>
        <span className="studio-label">Email</span>
        <input className="studio-input" name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span className="studio-label">Note</span>
        <textarea className="studio-textarea min-h-40" name="message" required />
      </label>
      <button className="btn justify-self-start" disabled={pending}>
        {pending ? "Sending…" : "Send the note"}
      </button>
    </form>
  );
}
