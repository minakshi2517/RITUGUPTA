import Link from "next/link";
import { EntryList } from "@/components/admin/EntryList";
import { IntroForm } from "@/components/admin/ui";
import { getSettings, listPoems } from "@/lib/data";
import { byDateDesc, formatDate } from "@/lib/utils";

export default async function PoetryAdminPage() {
  const [settings, poems] = await Promise.all([getSettings(), listPoems()]);
  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Poetry</h1>
        <Link href="/admin/poetry/new" className="btn">
          Add a poem
        </Link>
      </div>
      <IntroForm settingKey="poetryIntro" label="Introduction on the poetry page" value={settings.poetryIntro} hint="One line per line of the heading." />
      <EntryList
        kind="poem"
        featuredId={settings.featuredPoemId}
        empty="No poems yet."
        rows={byDateDesc(poems).map((poem) => ({
          id: poem.id,
          href: `/admin/poetry/${poem.id}`,
          title: poem.title,
          meta: [poem.published ? "On the site" : "Hidden", poem.category, formatDate(poem.date)].filter(Boolean).join(" · "),
          onSite: poem.published,
        }))}
      />
    </div>
  );
}
