import { HomeEditor } from "@/components/admin/forms";
import { listAudio, listBooks, listPoems, listWritings, getSettings } from "@/lib/data";

export default async function HomeAdminPage() {
  const [settings, books, poems, writings, audio] = await Promise.all([
    getSettings(),
    listBooks(),
    listPoems(),
    listWritings(),
    listAudio(),
  ]);
  return <HomeEditor settings={settings} books={books} poems={poems} writings={writings} audio={audio} />;
}
