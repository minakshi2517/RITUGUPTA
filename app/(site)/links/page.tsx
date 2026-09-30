import type { Metadata } from "next";
import { ClipCards } from "@/components/site/ClipCards";
import { Lines } from "@/components/site/Lines";
import { getSite } from "@/lib/data";

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
      <ClipCards links={entries} />
    </div>
  );
}
