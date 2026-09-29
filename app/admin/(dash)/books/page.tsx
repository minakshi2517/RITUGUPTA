import Link from "next/link";
import { EntryList } from "@/components/admin/EntryList";
import { IntroForm } from "@/components/admin/ui";
import { getSettings, listBooks } from "@/lib/data";
import { byOrder } from "@/lib/utils";

export default async function BooksAdminPage() {
  const [settings, books] = await Promise.all([getSettings(), listBooks()]);
  const ordered = byOrder(books);
  return (
    <div className="max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">Books</h1>
        <Link href="/admin/books/new" className="btn">
          Add a book
        </Link>
      </div>
      <IntroForm settingKey="booksIntro" label="Introduction on the books page" value={settings.booksIntro} hint="A short line under the heading." />
      <EntryList
        kind="book"
        featuredId={settings.featuredBookId}
        empty="No books yet."
        rows={ordered.map((book) => ({
          id: book.id,
          href: `/admin/books/${book.id}`,
          title: book.title,
          meta: [book.published ? "On the site" : "Hidden", book.year ? String(book.year) : ""].filter(Boolean).join(" · "),
          onSite: book.published,
        }))}
      />
    </div>
  );
}
