import { ClickWords } from "@/components/site/ClickWords";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSettings, listLinks } from "@/lib/data";
import { byOrder } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, links] = await Promise.all([getSettings(), listLinks()]);
  const active = byOrder(links.filter((link) => link.active));
  const subscribeHref = settings.substackUrl || "/contact";
  const subscribeLabel = settings.substackUrl ? "Subscribe" : "Write";

  return (
    <>
      {settings.announcementActive && settings.announcement ? (
        <div className="announcement">
          <p className="shell py-3">{settings.announcement}</p>
        </div>
      ) : null}
      <Header authorName={settings.authorName} subscribeHref={subscribeHref} subscribeLabel={subscribeLabel} />
      <ClickWords />
      <main id="content">{children}</main>
      <Footer settings={settings} links={active} />
    </>
  );
}
