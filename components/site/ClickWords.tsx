"use client";

import { useEffect } from "react";

const WORDS = ["author", "poet", "songwriter", "translator", "educator"];

function isBlankClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest(".click-words")) return false;
  if (
    target.closest(
      "a, button, input, textarea, select, label, iframe, summary, video, [role='button'], [contenteditable='true']",
    )
  ) {
    return false;
  }
  return true;
}

export default function ClickWords() {
  useEffect(() => {
    const layer = document.createElement("div");
    layer.className = "click-words";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    let next = 0;
    let last = { x: 0, y: 0, t: 0 };

    const spawn = (x: number, y: number) => {
      const now = Date.now();
      if (now - last.t < 320 && Math.hypot(x - last.x, y - last.y) < 8) return;
      last = { x, y, t: now };

      const word = WORDS[next % WORDS.length];
      next += 1;

      const mark = document.createElement("span");
      mark.className = "click-word";
      mark.textContent = word;
      mark.style.left = `${x}px`;
      mark.style.top = `${y}px`;
      layer.appendChild(mark);

      window.setTimeout(() => {
        mark.remove();
      }, 1800);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (!isBlankClick(event.target)) return;
      spawn(event.clientX, event.clientY);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (!isBlankClick(event.target)) return;
      spawn(event.clientX, event.clientY);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
      layer.remove();
    };
  }, []);

  return null;
}
