export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  const base = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "untitled";
}

export function uniqueSlug(existing: { id: string; slug: string }[], desired: string, currentId?: string) {
  const base = slugify(desired);
  let slug = base;
  let n = 2;
  const taken = (candidate: string) => existing.some((item) => item.slug === candidate && item.id !== currentId);
  while (taken(slug)) slug = `${base}-${n++}`;
  return slug;
}

export function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const mark = parts.map((part) => part[0]?.toUpperCase() || "").join("");
  return mark || "RG";
}

export function byOrder<T extends { displayOrder: number; createdAt: string }>(items: T[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt));
}

export function byDateDesc<T extends { date: string; createdAt: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aKey = a.date || a.createdAt.slice(0, 10);
    const bKey = b.date || b.createdAt.slice(0, 10);
    return aKey < bKey ? 1 : aKey > bKey ? -1 : 0;
  });
}

export function pickSelected<T extends { id: string; featured: boolean }>(items: T[], selectedId: string | null) {
  if (selectedId) {
    const chosen = items.find((item) => item.id === selectedId);
    if (chosen) return chosen;
  }
  return items.find((item) => item.featured) || null;
}

export function poemPreview(body: string, lines = 8) {
  return body.replace(/\r\n/g, "\n").split("\n").slice(0, lines).join("\n").trim();
}

export function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

export function linkRel(href: string) {
  if (/^https?:/i.test(href)) return { target: "_blank", rel: "noreferrer" } as const;
  return {} as const;
}

const SPOTIFY_TYPES = ["track", "album", "playlist", "episode", "show", "artist"];

export function spotifyEmbed(url: string) {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.endsWith("spotify.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const index = parts.findIndex((part) => SPOTIFY_TYPES.includes(part));
    if (index < 0 || !parts[index + 1]) return null;
    const id = parts[index + 1].split("?")[0];
    const type = parts[index];
    return {
      src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      height: type === "track" || type === "episode" ? 152 : 352,
      type,
    };
  } catch {
    return null;
  }
}

export function cleanHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Enter a full link, starting with https://");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Enter a full link, starting with https://");
  }
  return trimmed;
}

export function cleanHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  return cleanHttpUrl(trimmed);
}

export function nowIso() {
  return new Date().toISOString();
}

export function excerptFrom(text: string, length = 180) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= length) return flat;
  return `${flat.slice(0, length).trim()}…`;
}
