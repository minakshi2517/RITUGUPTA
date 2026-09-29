import { AboutEditor } from "@/components/admin/forms";
import { getSettings } from "@/lib/data";

export default async function AboutAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const settings = await getSettings();
  return <AboutEditor settings={settings} saved={saved === "1"} />;
}
