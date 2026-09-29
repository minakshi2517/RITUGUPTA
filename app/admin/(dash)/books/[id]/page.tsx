import { notFound } from "next/navigation";
import { BookEditor } from "@/components/admin/forms";
import { listBooks } from "@/lib/data";

export default async function EditBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const book = (await listBooks()).find((item) => item.id === id);
  if (!book) notFound();
  return <BookEditor book={book} saved={saved === "1"} />;
}
