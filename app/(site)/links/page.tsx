import type { Metadata } from "next";
import { Lines } from "@/components/site/Lines";
import { getSite } from "@/lib/data";
import { linkRel } from "@/lib/utils";

export const metadata: Metadata = { title: "Links" };

export default async function LinksPage() {
  const { settings, links } = await getSite();
  const seen = new Set<string>();
  const entries = [
    settings.substackUrl ? { id: "substack", title: "Substack", url: settings.substackUrl, description: "Letters, when they go out." } : null,
    settings.spotifyProfileUrl ? { id: "spotify", title: "Spotify", url: settings.spotifyProfileUrl, description: "What is playing." } : null,
    ...links.map((link) => ({ id: link.id, title: link.title, url: link.url, description: link.description })),
  ]
    .filter((item): item is { id: string; title: string; url: string; description: string } => Boolean(item))
    .filter((item) => {
      const key = item.url.replace(/\/$/, "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <div className="shell pb-24 pt-14 md:pt-20">
      <p className="label">Elsewhere</p>
      <h1 className="section-title mt-4 max-w-4xl">
        <Lines text={settings.linksIntro || settings.elsewhereHeading} italicLast />
      </h1>
      {entries.length === 0 ? <p className="quiet mt-16">No outside doors have been added yet.</p> : null}
      <div className="mt-14">
        {entries.map((link, index) => (
          <a key={link.id} href={link.url} className="index-row md:grid-cols-[4rem_1fr_auto]" {...linkRel(link.url)}>
            <span className="index-meta label">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <span className="block font-serif text-4xl tracking-tight md:text-5xl">{link.title}</span>
              {link.description ? <span className="mt-2 block text-ink-soft">{link.description}</span> : null}
            </span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
