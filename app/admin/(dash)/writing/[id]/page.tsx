import { notFound } from "next/navigation";
import { WritingEditor } from "@/components/admin/forms";
import { listBooks, listWritings } from "@/lib/data";

export default async function EditWritingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [writings, books] = await Promise.all([listWritings(), listBooks()]);
  const piece = writings.find((item) => item.id === id);
  if (!piece) notFound();
  return <WritingEditor piece={piece} books={books} saved={saved === "1"} />;
}
