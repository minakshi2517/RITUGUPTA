import { notFound } from "next/navigation";
import { PoemEditor } from "@/components/admin/forms";
import { listBooks, listPoems } from "@/lib/data";

export default async function EditPoemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [poems, books] = await Promise.all([listPoems(), listBooks()]);
  const poem = poems.find((item) => item.id === id);
  if (!poem) notFound();
  return <PoemEditor poem={poem} books={books} saved={saved === "1"} />;
}
