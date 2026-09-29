"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <main className="shell flex min-h-screen items-center py-16">
      <div className="w-full max-w-md">
        <p className="label">Studio</p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight">Sign in.</h1>
        <p className="mt-4 text-ink-soft">This is the quiet room where the website is kept.</p>
        <form action={action} className="mt-10 grid gap-6">
          {state?.message ? <p className="note-err">{state.message}</p> : null}
          <label>
            <span className="studio-label">Email</span>
            <input className="studio-input" name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            <span className="studio-label">Password</span>
            <input className="studio-input" name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn justify-self-start" disabled={pending}>
            {pending ? "Entering…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
