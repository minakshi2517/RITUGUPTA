import Link from "next/link";
import { EntryList } from "@/components/admin/EntryList";
import { IntroForm } from "@/components/admin/ui";
import { getSettings, listLinks } from "@/lib/data";
import { byOrder } from "@/lib/utils";

export default async function LinksAdminPage() {
  const [settings, links] = await Promise.all([getSettings(), listLinks()]);
  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Links</h1>
        <Link href="/admin/links/new" className="btn">
          Add a link
        </Link>
      </div>
      <IntroForm settingKey="linksIntro" label="Introduction on the links page" value={settings.linksIntro} hint="Only links you add, or the Substack and Spotify addresses in Settings, will appear." />
      <EntryList
        kind="link"
        empty="No links yet."
        rows={byOrder(links).map((link) => ({
          id: link.id,
          href: `/admin/links/${link.id}`,
          title: link.title,
          meta: link.active ? "On the site" : "Hidden",
          onSite: link.active,
        }))}
      />
    </div>
  );
}
