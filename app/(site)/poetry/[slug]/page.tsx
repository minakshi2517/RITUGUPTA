import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemBody } from "@/components/site/PoemBody";
import { getSite } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { poems } = await getSite();
  const poem = poems.find((item) => item.slug === slug);
  return { title: poem?.title || "Poem", description: poem?.body.slice(0, 140) };
}

export default async function PoemPage({ params }: Params) {
  const { slug } = await params;
  const { poems, books } = await getSite();
  const poem = poems.find((item) => item.slug === slug);
  if (!poem) notFound();
  const book = books.find((item) => item.id === poem.bookId);

  return (
    <article className="shell pb-28 pt-16 md:pb-36 md:pt-24">
      <div className="mx-auto max-w-[40rem]">
        <Link href="/poetry" className="label no-print">
          ← Poetry
        </Link>
        <header className="mt-12">
          <h1 className="font-serif text-5xl leading-none tracking-tight md:text-6xl">{poem.title}</h1>
          <p className="label mt-5">
            {[formatDate(poem.date), poem.category].filter(Boolean).join(" · ")}
          </p>
        </header>
        <div className="mt-16">
          <PoemBody text={poem.body} />
        </div>
        {book ? (
          <p className="mt-16 text-ink-soft">
            From{" "}
            <Link href={`/books/${book.slug}`} className="italic underline decoration-line underline-offset-4">
              {book.title}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
