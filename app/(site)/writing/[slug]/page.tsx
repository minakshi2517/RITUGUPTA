import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/site/ArrowLink";
import { RichText } from "@/components/site/RichText";
import { getSite } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { writings } = await getSite();
  const piece = writings.find((item) => item.slug === slug);
  return { title: piece?.title || "Writing", description: piece?.excerpt };
}

export default async function WritingPiecePage({ params }: Params) {
  const { slug } = await params;
  const { writings, books } = await getSite();
  const piece = writings.find((item) => item.slug === slug);
  if (!piece) notFound();
  const book = books.find((item) => item.id === piece.bookId);

  return (
    <article className="shell pb-28 pt-14 md:pt-20">
      <div className="mx-auto max-w-[42rem]">
        <Link href="/writing" className="label">
          ← Writing
        </Link>
        <header className="mt-10">
          <p className="label">{[piece.category, formatDate(piece.date)].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">{piece.title}</h1>
          {piece.excerpt ? <p className="mt-6 text-xl italic leading-relaxed text-ink-soft">{piece.excerpt}</p> : null}
        </header>
        {piece.coverImage ? (
          <figure className="mt-10">
            <img src={piece.coverImage} alt="" className="w-full object-cover" />
          </figure>
        ) : null}
        {piece.content ? (
          <div className="mt-12">
            <RichText text={piece.content} dropCap />
          </div>
        ) : null}
        {piece.externalUrl ? (
          <div className="mt-12">
            <ArrowLink href={piece.externalUrl}>Read it elsewhere</ArrowLink>
          </div>
        ) : null}
        {book ? (
          <p className="mt-12 border-t border-line pt-6 text-ink-soft">
            Related to{" "}
            <Link href={`/books/${book.slug}`} className="italic">
              {book.title}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
