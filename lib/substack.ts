import "server-only";

export type SubstackPost = {
  title: string;
  link: string;
  date: string;
  excerpt: string;
};

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function strip(html: string) {
  return decode(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function grab(block: string, tag: string) {
  const wrapped = block.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i"));
  if (wrapped) return decode(wrapped[1]);
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return plain ? decode(plain[1]) : "";
}

export async function getSubstackPosts(substackUrl: string): Promise<SubstackPost[]> {
  const base = substackUrl.trim().replace(/\/$/, "");
  if (!base) return [];
  try {
    const response = await fetch(`${base}/feed`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return [];
    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 4);
    return items
      .map((match) => {
        const block = match[1];
        const title = strip(grab(block, "title"));
        const link = grab(block, "link");
        const date = grab(block, "pubDate");
        const excerpt = strip(grab(block, "description")).slice(0, 180);
        return { title, link, date, excerpt };
      })
      .filter((post) => post.title && post.link);
  } catch {
    return [];
  }
}
