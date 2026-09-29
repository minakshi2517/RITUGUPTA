import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Cover } from "@/components/site/Cover";
import { SpotifyFrame } from "@/components/site/SpotifyFrame";
import { getSite } from "@/lib/data";
import { pickSelected } from "@/lib/utils";

export const metadata: Metadata = { title: "Listen" };

export default async function ListenPage() {
  const { settings, audio } = await getSite();
  const lead = pickSelected(audio, settings.featuredAudioId);
  const rest = audio.filter((item) => item.id !== lead?.id);

  return (
    <div className="ink-band">
      <div className="shell pb-24 pt-16 md:pt-24">
        <p className="label">Listen</p>
        <h1 className="section-title mt-4 max-w-3xl text-[var(--on-dark)]">{settings.listenIntro}</h1>

        {audio.length === 0 ? (
          <div className="mt-16 max-w-xl">
            <p className="font-reading text-2xl italic text-[var(--on-dark-muted)]">Nothing is queued yet.</p>
            {settings.spotifyProfileUrl ? (
              <div className="mt-6">
                <ArrowLink href={settings.spotifyProfileUrl}>Open Spotify</ArrowLink>
              </div>
            ) : null}
          </div>
        ) : null}

        {lead ? (
          <article className="mt-16 grid items-center gap-10 border-t border-white/15 pt-12 lg:grid-cols-12">
            <div className="max-w-xs lg:col-span-4">
              {lead.coverImage ? <Cover src={lead.coverImage} alt="" /> : <SpotifyFrame url={lead.spotifyUrl} title={lead.title} />}
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="label">{lead.type}</p>
              <h2 className="mt-3 font-serif text-5xl tracking-tight">{lead.title}</h2>
              {lead.description ? <p className="mt-5 max-w-lg text-lg text-[var(--on-dark-muted)]">{lead.description}</p> : null}
              {lead.coverImage ? (
                <div className="mt-6">
                  <SpotifyFrame url={lead.spotifyUrl} title={lead.title} />
                </div>
              ) : null}
              <div className="mt-4">
                <ArrowLink href={lead.spotifyUrl}>Play on Spotify</ArrowLink>
              </div>
            </div>
          </article>
        ) : null}

        <div className="mt-8">
          {rest.map((item) => (
            <a key={item.id} href={item.spotifyUrl} className="index-row border-white/15" target="_blank" rel="noreferrer">
              <span className="index-meta label">{item.type}</span>
              <span>
                <span className="block font-serif text-3xl tracking-tight">{item.title}</span>
                {item.description ? <span className="mt-1 block text-[var(--on-dark-muted)]">{item.description}</span> : null}
              </span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
