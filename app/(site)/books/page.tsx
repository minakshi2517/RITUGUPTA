import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/site/Cover";
import { ArrowLink } from "@/components/site/ArrowLink";
import { getSite } from "@/lib/data";

export const metadata: Metadata = { title: "Books" };

export default async function BooksPage() {
  const { settings, books } = await getSite();

  return (
    <div className="shell pb-24 pt-14 md:pt-20">
      <div className="grid gap-8 border-b border-ink pb-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="label">Books</p>
          <h1 className="section-title mt-4">The shelf.</h1>
        </div>
        <p className="max-w-sm self-end text-lg text-ink-soft md:col-span-4 md:col-start-9">{settings.booksIntro}</p>
      </div>

      {books.length === 0 ? <p className="quiet mt-16">Nothing has been placed on the shelf yet.</p> : null}

      <div className="book-shelf">
        {books.map((book) => (
          <article key={book.id}>
            <Link href={`/books/${book.slug}`} className="cover-link block">
              <Cover src={book.coverImage} title={book.title} alt={`Cover of ${book.title}`} />
            </Link>
            <p className="label mt-8">{book.year || "Book"}</p>
            <h2 className="mt-2 font-serif text-3xl leading-none tracking-tight md:text-4xl">
              <Link href={`/books/${book.slug}`}>{book.title}</Link>
            </h2>
            {book.subtitle ? <p className="mt-3 max-w-xs font-serif text-xl italic text-ink-soft">{book.subtitle}</p> : null}
            <div className="mt-5">
              <ArrowLink href={`/books/${book.slug}`}>Open the book</ArrowLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
