"use client";

import Link from "next/link";
import { poemPreview } from "@/lib/utils";

type PoemCard = {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  date?: string;
};

const PEGS = ["flower", "heart", "star"] as const;

function Peg({ kind }: { kind: (typeof PEGS)[number] }) {
  if (kind === "heart") {
    return (
      <span className="peg peg-heart" aria-hidden="true">
        ♡
      </span>
    );
  }
  if (kind === "star") {
    return (
      <span className="peg peg-star" aria-hidden="true">
        ★
      </span>
    );
  }
  return (
    <span className="peg peg-flower" aria-hidden="true">
      ✿
    </span>
  );
}

export function Clothesline({ poems }: { poems: PoemCard[] }) {
  if (poems.length === 0) return null;
  const loop = poems.length < 4 ? [...poems, ...poems, ...poems] : [...poems, ...poems];

  return (
    <section className="line-wrap" aria-label="Poems on a line">
      <div className="line-rope" aria-hidden="true" />
      <div className="line-window">
        <div className="line-move" style={{ animationDuration: `${Math.max(28, loop.length * 7)}s` }}>
          {loop.map((poem, index) => (
            <Link
              key={`${poem.id}-${index}`}
              href={`/poetry/${poem.slug}`}
              className={`note-card wash-${(index % 6) + 1}`}
            >
              <Peg kind={PEGS[index % PEGS.length]} />
              <span className="note-top">
                <span className="note-title">{poem.title}</span>
                <span className="label">{poem.category || "Poem"}</span>
              </span>
              {poem.body ? <span className="note-body">{poemPreview(poem.body, 4)}</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
