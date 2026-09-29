import { WritingEditor } from "@/components/admin/forms";
import { listBooks } from "@/lib/data";

export default async function NewWritingPage() {
  return <WritingEditor piece={null} books={await listBooks()} />;
}
