"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";

export function Cover({ src, alt, title, className }: { src?: string; alt: string; title?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const cloth = !src || failed;
  return (
    <div className={cx("cover-frame", className)}>
      <img className={cloth ? "cover-cloth" : undefined} src={cloth ? "/brand/cloth.svg" : src} alt={alt} onError={() => setFailed(true)} />
      {cloth && title ? <span className="cover-title">{title}</span> : null}
    </div>
  );
}
