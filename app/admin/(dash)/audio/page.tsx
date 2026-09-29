import Link from "next/link";
import { EntryList } from "@/components/admin/EntryList";
import { IntroForm } from "@/components/admin/ui";
import { getSettings, listAudio } from "@/lib/data";
import { byOrder } from "@/lib/utils";

export default async function AudioAdminPage() {
  const [settings, audio] = await Promise.all([getSettings(), listAudio()]);
  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Audio</h1>
        <Link href="/admin/audio/new" className="btn">
          Add audio
        </Link>
      </div>
      <IntroForm settingKey="listenIntro" label="Introduction on the listen page" value={settings.listenIntro} hint="The line at the top of the listening room." />
      <EntryList
        kind="audio"
        featuredId={settings.featuredAudioId}
        empty="No Spotify pieces yet. Paste a link and it will play here."
        rows={byOrder(audio).map((item) => ({
          id: item.id,
          href: `/admin/audio/${item.id}`,
          title: item.title,
          meta: [item.published ? "On the site" : "Hidden", item.type].filter(Boolean).join(" · "),
          onSite: item.published,
        }))}
      />
    </div>
  );
}
