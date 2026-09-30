import { linkRel } from "@/lib/utils";

type Entry = { id: string; title: string; url: string; description?: string };

const THEMES = [
  { bg: "#ead7c8", ink: "#3d2418", clip: "/gallery/writing-desk.jpg" },
  { bg: "#d7e4d6", ink: "#1c3328", clip: "/gallery/open-book.jpg" },
  { bg: "#e4d4dc", ink: "#3a2230", clip: "/gallery/portrait.jpg" },
  { bg: "#d4dde8", ink: "#1c2d40", clip: "/gallery/library.jpg" },
  { bg: "#eadfc4", ink: "#3b2f16", clip: "/gallery/book-trees.jpg" },
];

function pick(title: string, index: number) {
  const key = title.toLowerCase();
  if (key.includes("substack")) return { ...THEMES[0], clip: "/gallery/writing-desk.jpg" };
  if (key.includes("spotify")) return { ...THEMES[1], clip: "/uploads/ram-lalla.jpg" };
  if (key.includes("instagram")) return { ...THEMES[2], clip: "/gallery/portrait.jpg" };
  if (key.includes("whatsapp")) return { ...THEMES[3], clip: "/gallery/library.jpg" };
  if (key.includes("linktree") || key.includes("link")) return { ...THEMES[4], clip: "/gallery/book-trees.jpg" };
  return THEMES[index % THEMES.length];
}

export function ClipCards({ links }: { links: Entry[] }) {
  if (links.length === 0) return null;

  return (
    <div className="clip-grid">
      {links.map((link, index) => {
        const theme = pick(link.title, index);
        return (
          <a
            key={link.id}
            href={link.url}
            className="clip-card"
            style={{ background: theme.bg, color: theme.ink }}
            {...linkRel(link.url)}
          >
            <span className={`clip-photo ${index % 2 === 0 ? "tilt-left" : "tilt-right"}`}>
              <span className="clip-tape" aria-hidden="true" />
              <img src={theme.clip} alt="" />
            </span>
            <span className="clip-title">{link.title}</span>
            {link.description ? <span className="clip-note">{link.description}</span> : null}
            <span className="clip-go">
              Open
              <span aria-hidden="true"> →</span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
