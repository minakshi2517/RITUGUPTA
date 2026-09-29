"use client";

import { useState } from "react";
import type { AboutSection, PullQuote, PurchaseLink } from "@/lib/types";

export function PurchaseLinksField({ initial }: { initial: PurchaseLink[] }) {
  const [rows, setRows] = useState(initial);
  function update(index: number, patch: Partial<PurchaseLink>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  return (
    <div>
      <span className="studio-label">Other purchase links</span>
      <div className="mt-3 grid gap-4">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto] md:items-end">
            <input className="studio-input" name="purchaseLabel" value={row.label} placeholder="Shop name" onChange={(event) => update(index, { label: event.target.value })} />
            <input className="studio-input" name="purchaseUrl" value={row.url} placeholder="https://" onChange={(event) => update(index, { url: event.target.value })} />
            <button type="button" className="text-btn pb-3" onClick={() => setRows(rows.filter((_, i) => i !== index))}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="text-btn mt-4" onClick={() => setRows([...rows, { label: "", url: "" }])}>
        + Add a purchase link
      </button>
    </div>
  );
}

export function AboutSectionsField({ initial }: { initial: AboutSection[] }) {
  const [rows, setRows] = useState(initial.length ? initial : []);
  function update(index: number, patch: Partial<AboutSection>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  function move(index: number, direction: number) {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setRows(next);
  }
  return (
    <div>
      <input type="hidden" name="aboutSections" value={JSON.stringify(rows)} />
      <div className="grid gap-8">
        {rows.map((row, index) => (
          <div key={row.id} className="border-t border-line pt-5">
            <div className="mb-3 flex gap-4">
              <button type="button" className="text-btn" onClick={() => move(index, -1)}>
                Up
              </button>
              <button type="button" className="text-btn" onClick={() => move(index, 1)}>
                Down
              </button>
              <button type="button" className="danger text-btn" onClick={() => setRows(rows.filter((item) => item.id !== row.id))}>
                Remove
              </button>
            </div>
            <input className="studio-input" value={row.title} placeholder="Section title" onChange={(event) => update(index, { title: event.target.value })} />
            <textarea className="studio-textarea mt-3" rows={6} value={row.body} placeholder="Write this part of the story. Separate paragraphs with a blank line." onChange={(event) => update(index, { body: event.target.value })} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-btn mt-5"
        onClick={() => setRows([...rows, { id: crypto.randomUUID(), title: "", body: "" }])}
      >
        + Add a section
      </button>
    </div>
  );
}

export function QuotesField({ initial }: { initial: PullQuote[] }) {
  const [rows, setRows] = useState(initial);
  function update(index: number, patch: Partial<PullQuote>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }
  return (
    <div>
      <input type="hidden" name="aboutQuotes" value={JSON.stringify(rows)} />
      <span className="studio-label">Pull quotes</span>
      <p className="hint">Large lines that break up the story. Leave this empty until you have a sentence worth setting large.</p>
      <div className="mt-4 grid gap-5">
        {rows.map((row, index) => (
          <div key={row.id} className="grid gap-3">
            <textarea className="studio-textarea" rows={3} value={row.text} placeholder="The sentence" onChange={(event) => update(index, { text: event.target.value })} />
            <input className="studio-input" value={row.attribution} placeholder="Attribution, if any" onChange={(event) => update(index, { attribution: event.target.value })} />
            <button type="button" className="danger text-btn justify-self-start" onClick={() => setRows(rows.filter((item) => item.id !== row.id))}>
              Remove quote
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="text-btn mt-4" onClick={() => setRows([...rows, { id: crypto.randomUUID(), text: "", attribution: "" }])}>
        + Add a quote
      </button>
    </div>
  );
}
