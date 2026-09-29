import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/site/ArrowLink";
import { Cover } from "@/components/site/Cover";
import { RichText } from "@/components/site/RichText";
import { getSite } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { books } = await getSite();
  const book = books.find((item) => item.slug === slug);
  return { title: book?.title || "Book", description: book?.description };
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const { books, poems, writings } = await getSite();
  const book = books.find((item) => item.slug === slug);
  if (!book) notFound();
  const relatedPoems = poems.filter((item) => item.bookId === book.id);
  const relatedWriting = writings.filter((item) => item.bookId === book.id);
  const purchases = [
    book.amazonUrl ? { label: "Amazon", url: book.amazonUrl } : null,
    ...book.purchaseLinks,
  ].filter((item): item is { label: string; url: string } => Boolean(item));

  return (
    <article className="shell pb-24 pt-14 md:pt-20">
      <Link href="/books" className="label">
        Books
      </Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <Cover src={book.coverImage} title={book.title} alt={`Cover of ${book.title}`} />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h1 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">{book.title}</h1>
          {book.subtitle ? <p className="mt-4 font-serif text-2xl italic text-ink-soft">{book.subtitle}</p> : null}
          {book.description ? (
            <div className="mt-8 max-w-xl">
              <RichText text={book.description} />
            </div>
          ) : null}
          {book.authorNote ? (
            <blockquote className="mt-12 max-w-xl border-t border-ink pt-8">
              <p className="label">A note</p>
              <div className="mt-4 italic">
                <RichText text={book.authorNote} />
              </div>
            </blockquote>
          ) : null}

          {book.year || book.publisher || book.isbn ? (
            <dl className="mt-12 grid max-w-md grid-cols-[8rem_1fr] gap-y-3 border-t border-line pt-6 text-sm">
              {book.year ? (
                <>
                  <dt className="label">Year</dt>
                  <dd>{book.year}</dd>
                </>
              ) : null}
              {book.publisher ? (
                <>
                  <dt className="label">Publisher</dt>
                  <dd>{book.publisher}</dd>
                </>
              ) : null}
              {book.isbn ? (
                <>
                  <dt className="label">ISBN</dt>
                  <dd>{book.isbn}</dd>
                </>
              ) : null}
            </dl>
          ) : null}

          {purchases.length > 0 ? (
            <div className="mt-10 flex flex-col items-start">
              {purchases.map((link) => (
                <ArrowLink key={link.url} href={link.url}>
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          ) : null}

          {relatedWriting.length > 0 || relatedPoems.length > 0 ? (
            <div className="mt-16 border-t border-line pt-8">
              <p className="label">Alongside this book</p>
              <ul className="mt-4 space-y-3">
                {relatedWriting.map((item) => (
                  <li key={item.id}>
                    <Link href={`/writing/${item.slug}`} className="font-serif text-2xl tracking-tight hover:italic">
                      {item.title}
                    </Link>
                    {item.date ? <span className="ml-3 label">{formatDate(item.date)}</span> : null}
                  </li>
                ))}
                {relatedPoems.map((item) => (
                  <li key={item.id}>
                    <Link href={`/poetry/${item.slug}`} className="font-serif text-2xl tracking-tight hover:italic">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
