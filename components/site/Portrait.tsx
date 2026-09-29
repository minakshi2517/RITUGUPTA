"use client";

import { useState } from "react";
import { cx, initials } from "@/lib/utils";

export function Portrait({ src, name, className }: { src?: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cx("portrait-frame portrait-empty", className)} role="img" aria-label={`Monogram for ${name}`}>
        <span>{initials(name)}</span>
      </div>
    );
  }
  return (
    <div className={cx("portrait-frame", className)}>
      <img src={src} alt={`Portrait of ${name}`} onError={() => setFailed(true)} />
    </div>
  );
}
