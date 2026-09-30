"use client";

import { useEffect, useState } from "react";

const WORDS = ["author", "poet", "songwriter", "translator", "educator"];

type Mark = { id: number; x: number; y: number; word: string };

export function ClickWords() {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    let next = 0;
    let tick = 0;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest(
          "a, button, input, textarea, select, label, iframe, summary, video, [role='button'], [contenteditable='true']",
        )
      ) {
        return;
      }

      const id = tick + 1;
      tick = id;
      const word = WORDS[next % WORDS.length];
      next += 1;
      const mark = { id, x: event.clientX, y: event.clientY, word };
      setMarks((current) => [...current.slice(-8), mark]);
      window.setTimeout(() => {
        setMarks((current) => current.filter((item) => item.id !== id));
      }, 1700);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (marks.length === 0) return null;

  return (
    <div className="click-words" aria-hidden="true">
      {marks.map((mark) => (
        <span key={mark.id} className="click-word" style={{ left: mark.x, top: mark.y }}>
          {mark.word}
        </span>
      ))}
    </div>
  );
}
