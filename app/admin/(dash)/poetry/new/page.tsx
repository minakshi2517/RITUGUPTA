import { PoemEditor } from "@/components/admin/forms";
import { listBooks } from "@/lib/data";

export default async function NewPoemPage() {
  const books = await listBooks();
  return <PoemEditor poem={null} books={books} />;
}
