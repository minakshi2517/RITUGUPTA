import { spotifyEmbed } from "@/lib/utils";

export function SpotifyFrame({ url, title }: { url: string; title: string }) {
  const embed = spotifyEmbed(url);
  if (!embed) return null;
  return (
    <iframe
      src={embed.src}
      title={title}
      width="100%"
      height={embed.height}
      style={{ border: 0, borderRadius: 0 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
