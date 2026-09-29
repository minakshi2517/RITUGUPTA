import Link from "next/link";
import type { ExternalLink, SiteSettings } from "@/lib/types";
import { linkRel } from "@/lib/utils";

export function Footer({ settings, links }: { settings: SiteSettings; links: ExternalLink[] }) {
  const year = new Date().getFullYear();
  const seen = new Set<string>();
  const row = [
    settings.substackUrl ? { title: "Substack", url: settings.substackUrl } : null,
    settings.spotifyProfileUrl ? { title: "Spotify", url: settings.spotifyProfileUrl } : null,
    ...links.map((link) => ({ title: link.title, url: link.url })),
  ]
    .filter((item): item is { title: string; url: string } => Boolean(item))
    .filter((item) => {
      const key = item.url.replace(/\/$/, "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <footer className="border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="font-serif text-4xl italic tracking-tight md:text-5xl">{settings.authorName}</p>
          {settings.footerLine ? <p className="mt-4 max-w-md font-reading text-lg italic text-ink-soft">{settings.footerLine}</p> : null}
        </div>
        <div className="md:col-span-6 md:justify-self-end">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {row.map((item) => (
              <a key={item.url} href={item.url} className="nav-link" {...linkRel(item.url)}>
                {item.title}
              </a>
            ))}
            {settings.email ? (
              <a className="nav-link" href={`mailto:${settings.email}`}>
                Email
              </a>
            ) : null}
            <Link className="nav-link" href="/contact">
              Contact
            </Link>
          </div>
          <p className="mt-10 font-sans text-xs tracking-[0.14em] text-muted uppercase">
            © {year} {settings.authorName}
          </p>
        </div>
      </div>
    </footer>
  );
}
