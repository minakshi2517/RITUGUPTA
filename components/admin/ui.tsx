"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveIntro } from "@/lib/actions";
import type { ActionState } from "@/lib/types";

export function AdminForm({
  action,
  children,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {state?.message ? <p className={state.ok ? "note-ok mb-8" : "note-err mb-8"}>{state.message}</p> : null}
      {children}
    </form>
  );
}

export function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function DeleteButton({
  action,
  id,
  noun = "this",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  noun?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete ${noun}? It will leave the website.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="danger text-btn">Delete</button>
    </form>
  );
}

export function ImageField({
  name,
  label,
  initial = "",
  hint,
}: {
  name: string;
  label: string;
  initial?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(initial);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.set("file", file);
    setUploading(true);
    setError("");
    const response = await fetch("/api/upload", { method: "POST", body });
    const json = (await response.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!response.ok || !json.url) {
      setError(json.error || "The image could not be saved.");
      return;
    }
    setUrl(json.url);
  }

  return (
    <div>
      <span className="studio-label">{label}</span>
      {url ? <img src={url} alt="" className="mb-3 mt-3 h-40 w-auto max-w-full object-cover" /> : null}
      <input type="hidden" name={name} value={url} />
      <input className="studio-input" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste an image address, or upload" />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="btn btn-ghost cursor-pointer">
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onFile} />
        </label>
        {url ? (
          <button type="button" className="text-btn" onClick={() => setUrl("")}>
            Remove
          </button>
        ) : null}
      </div>
      {hint ? <p className="hint">{hint}</p> : null}
      {error ? <p className="note-err mt-2">{error}</p> : null}
    </div>
  );
}

export function IntroForm({
  settingKey,
  label,
  value,
  hint,
}: {
  settingKey: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <AdminForm action={saveIntro} className="mb-14 max-w-2xl border-b border-line pb-10">
      <label>
        <span className="studio-label">{label}</span>
        <textarea className="studio-textarea" name="value" defaultValue={value} rows={3} />
      </label>
      <input type="hidden" name="key" value={settingKey} />
      <p className="hint">{hint}</p>
      <div className="mt-4">
        <SaveButton label="Save introduction" />
      </div>
    </AdminForm>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  hint,
  textarea = false,
  type = "text",
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  textarea?: boolean;
  type?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="studio-label">{label}</span>
      {textarea ? (
        <textarea className="studio-textarea" name={name} defaultValue={defaultValue ?? ""} rows={rows} />
      ) : (
        <input className="studio-input" name={name} type={type} defaultValue={defaultValue ?? ""} />
      )}
      {hint ? <p className="hint">{hint}</p> : null}
    </label>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}
