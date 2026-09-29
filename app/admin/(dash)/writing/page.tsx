import Link from "next/link";
import { EntryList } from "@/components/admin/EntryList";
import { IntroForm } from "@/components/admin/ui";
import { getSettings, listWritings } from "@/lib/data";
import { byDateDesc, formatDate } from "@/lib/utils";

export default async function WritingAdminPage() {
  const [settings, writings] = await Promise.all([getSettings(), listWritings()]);
  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Writing</h1>
        <Link href="/admin/writing/new" className="btn">
          Add writing
        </Link>
      </div>
      <IntroForm settingKey="writingIntro" label="Introduction on the writing page" value={settings.writingIntro} hint="Shown under the journal heading." />
      <EntryList
        kind="writing"
        featuredId={settings.featuredWritingId}
        empty="No writing yet."
        rows={byDateDesc(writings).map((piece) => ({
          id: piece.id,
          href: `/admin/writing/${piece.id}`,
          title: piece.title,
          meta: [piece.published ? "On the site" : "Hidden", piece.category, formatDate(piece.date)].filter(Boolean).join(" · "),
          onSite: piece.published,
        }))}
      />
    </div>
  );
}
