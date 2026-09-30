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

const STAGE_SLUGS = ["whispers-in-the-tea-garden", "the-weight-of-words", "chakki-dreams"];

const STAGE_THEMES = [
  { bg: "#efe2c8", ink: "#2a2218", peg: "flower" as const, doodle: "leaf" as const, tilt: -1.6, drop: 0 },
  { bg: "#d2e8d8", ink: "#1c3328", peg: "heart" as const, doodle: "hearts" as const, tilt: 1.1, drop: 11 },
  { bg: "#d8e2ef", ink: "#1a2d42", peg: "star" as const, doodle: "branch" as const, tilt: -0.9, drop: 0 },
];

function pickStagePoems(poems: PoemCard[]) {
  const picked: PoemCard[] = [];
  for (const slug of STAGE_SLUGS) {
    const match = poems.find((poem) => poem.slug === slug);
    if (match) picked.push(match);
  }
  if (picked.length >= 3) return picked.slice(0, 3);
  for (const poem of poems) {
    if (picked.some((item) => item.id === poem.id)) continue;
    picked.push(poem);
    if (picked.length === 3) break;
  }
  return picked;
}

function PegArt({ kind }: { kind: "flower" | "heart" | "star" }) {
  if (kind === "heart") {
    return (
      <span className="line-peg line-peg-heart" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="19" fill="#5a7a52" />
          <path
            d="M20 27.5c-5.2-3.4-8.8-6.6-8.8-10.2 0-2.4 1.9-4.3 4.3-4.3 1.6 0 3 0.9 3.7 2.2.7-1.3 2.1-2.2 3.7-2.2 2.4 0 4.3 1.9 4.3 4.3 0 3.6-3.6 6.8-8.8 10.2z"
            fill="none"
            stroke="#f7f3ea"
            strokeWidth="1.6"
          />
        </svg>
      </span>
    );
  }
  if (kind === "star") {
    return (
      <span className="line-peg line-peg-star" aria-hidden="true">
        <span className="line-peg-spark" />
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="19" fill="#e4bc58" />
          <path
            d="M20 9l2.2 6.8h7.1l-5.7 4.2 2.2 6.8L20 22.6l-5.8 4.2 2.2-6.8-5.7-4.2h7.1z"
            fill="#3b3018"
          />
          <circle cx="17.2" cy="19.2" r="1" fill="#3b3018" />
          <circle cx="22.8" cy="19.2" r="1" fill="#3b3018" />
          <path d="M17.5 22.2q2.5 2 5 0" fill="none" stroke="#3b3018" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="line-peg line-peg-flower" aria-hidden="true">
      <span className="line-peg-spark" />
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r="19" fill="#f7f3ea" stroke="#ddd4c4" strokeWidth="1" />
        <circle cx="20" cy="20" r="5.5" fill="#e8c04a" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse key={deg} cx="20" cy="11" rx="4.2" ry="7.2" fill="#fffdf8" transform={`rotate(${deg} 20 20)`} />
        ))}
      </svg>
    </span>
  );
}

function Doodle({ kind }: { kind: "leaf" | "hearts" | "branch" }) {
  if (kind === "hearts") {
    return (
      <svg className="note-doodle note-doodle-hearts" viewBox="0 0 48 32" aria-hidden="true">
        <path d="M14 18c-4-2.8-6.5-5.2-6.5-8.2 0-2 1.6-3.6 3.6-3.6 1.3 0 2.5.7 3.1 1.8.6-1.1 1.8-1.8 3.1-1.8 2 0 3.6 1.6 3.6 3.6 0 3-2.5 5.4-6.5 8.2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M30 20c-3.2-2.2-5.2-4.2-5.2-6.6 0-1.6 1.3-2.9 2.9-2.9 1 0 2 .6 2.5 1.4.5-.8 1.5-1.4 2.5-1.4 1.6 0 2.9 1.3 2.9 2.9 0 2.4-2 4.4-5.2 6.6z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  if (kind === "branch") {
    return (
      <svg className="note-doodle note-doodle-branch" viewBox="0 0 52 34" aria-hidden="true">
        <path d="M8 24c8-10 18-14 28-12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M22 16l-4 6M30 14l3 7M38 18l-2 6" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="note-doodle note-doodle-leaf" viewBox="0 0 40 36" aria-hidden="true">
      <path d="M6 28c10-16 22-22 30-18-6 8-14 14-24 16-2 .4-4 .4-6 2z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 24c6-4 12-6 18-6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function HangingNote({
  poem,
  theme,
}: {
  poem: PoemCard;
  theme: (typeof STAGE_THEMES)[number];
}) {
  return (
    <Link
      href={`/poetry/${poem.slug}`}
      className="line-note"
      style={{
        background: theme.bg,
        color: theme.ink,
        transform: `rotate(${theme.tilt}deg) translateY(${theme.drop}px)`,
      }}
    >
      <PegArt kind={theme.peg} />
      <span className="line-note-head">
        <span className="line-note-title">{poem.title}</span>
        <span className="line-note-cat">{poem.category || "Poem"}</span>
      </span>
      <span className="line-note-rule" aria-hidden="true" />
      {poem.body ? <span className="line-note-body">{poemPreview(poem.body, 4)}</span> : null}
      <Doodle kind={theme.doodle} />
    </Link>
  );
}

export function Clothesline({ poems }: { poems: PoemCard[] }) {
  if (poems.length === 0) return null;

  const stagePoems = pickStagePoems(poems);
  const stageIds = new Set(stagePoems.map((poem) => poem.id));
  const rest = poems.filter((poem) => !stageIds.has(poem.id));
  const loop = rest.length > 1 ? [...rest, ...rest] : rest;

  return (
    <section className="line-scene" aria-label="Poems on a line">
      <div className="line-scene-bg" aria-hidden="true">
        <span className="line-scene-light" />
        <span className="line-scene-leaves" />
        <span className="line-scene-plant" />
      </div>

      <div className="line-scene-inner">
        <svg className="line-rope-curve" viewBox="0 0 1200 56" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 24 30 C 320 52, 880 52, 1176 30"
            fill="none"
            stroke="#9a7348"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 24 27 C 320 48, 880 48, 1176 27"
            fill="none"
            stroke="#c4a574"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        <div className={`line-hangers line-hangers-${stagePoems.length}`}>
          {stagePoems.map((poem, index) => (
            <HangingNote key={poem.id} poem={poem} theme={STAGE_THEMES[index % STAGE_THEMES.length]} />
          ))}
        </div>
      </div>

      {loop.length > 0 ? (
        <div className={`line-marquee-wrap${rest.length === 1 ? " line-marquee-static" : ""}`}>
          <div className="line-marquee-window">
            <div className="line-marquee-track" style={{ animationDuration: `${Math.max(32, loop.length * 8)}s` }}>
              {loop.map((poem, index) => {
                const theme = STAGE_THEMES[index % STAGE_THEMES.length];
                return (
                  <Link
                    key={`${poem.id}-${index}`}
                    href={`/poetry/${poem.slug}`}
                    className="line-note line-note-mini"
                    style={{ background: theme.bg, color: theme.ink, transform: `rotate(${theme.tilt * 0.6}deg)` }}
                  >
                    <PegArt kind={theme.peg} />
                    <span className="line-note-head">
                      <span className="line-note-title">{poem.title}</span>
                      <span className="line-note-cat">{poem.category || "Poem"}</span>
                    </span>
                    <span className="line-note-rule" aria-hidden="true" />
                    {poem.body ? <span className="line-note-body">{poemPreview(poem.body, 3)}</span> : null}
                    <Doodle kind={theme.doodle} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
