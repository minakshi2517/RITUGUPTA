import { notFound } from "next/navigation";
import { AudioEditor } from "@/components/admin/forms";
import { listAudio } from "@/lib/data";

export default async function EditAudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const item = (await listAudio()).find((entry) => entry.id === id);
  if (!item) notFound();
  return <AudioEditor item={item} saved={saved === "1"} />;
}
