import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <Sidebar authorName={settings.authorName} />
      <div className="min-w-0 px-5 py-8 md:px-10 md:py-12">{children}</div>
    </div>
  );
}
