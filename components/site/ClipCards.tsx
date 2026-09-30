import { linkRel } from "@/lib/utils";

type Entry = { id: string; title: string; url: string; description?: string };

const CLIPS: Record<string, string> = {
  substack: "/gallery/writing-desk.jpg",
  spotify: "/uploads/ram-lalla.jpg",
  instagram: "/gallery/portrait.jpg",
  whatsapp: "/gallery/library.jpg",
  linktree: "/gallery/book-trees.jpg",
  link: "/gallery/book-trees.jpg",
};

const ACCENTS = ["#c9a88e", "#9cb8a8", "#a8b4c9", "#b8a0ae", "#c4b896"];

function clipFor(title: string, index: number) {
  const key = title.toLowerCase();
  for (const [needle, src] of Object.entries(CLIPS)) {
    if (key.includes(needle)) return src;
  }
  const fallbacks = ["/gallery/open-book.jpg", "/gallery/vairagya.png", "/gallery/book-trees.jpg"];
  return fallbacks[index % fallbacks.length];
}

export function ClipCards({ links }: { links: Entry[] }) {
  if (links.length === 0) return null;

  return (
    <div className="clip-grid">
      {links.map((link, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        const tilt = index % 2 === 0 ? "tilt-left" : "tilt-right";
        return (
          <a
            key={link.id}
            href={link.url}
            className="clip-card group"
            style={{ borderTopColor: accent }}
            {...linkRel(link.url)}
          >
            <figure className={`clip-card-photo ${tilt}`}>
              <span className="clip-tape" aria-hidden="true" />
              <img src={clipFor(link.title, index)} alt="" />
            </figure>
            <span className="clip-card-body">
              <span className="clip-title">{link.title}</span>
              {link.description ? <span className="clip-note">{link.description}</span> : null}
              <span className="clip-go">
                Open
                <span className="arrow" aria-hidden="true">
                  {" "}
                  →
                </span>
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
