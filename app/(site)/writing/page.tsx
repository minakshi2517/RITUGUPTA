import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink } from "@/components/site/ArrowLink";
import { getSite } from "@/lib/data";
import { getSubstackPosts } from "@/lib/substack";
import { formatDate, linkRel, pickSelected } from "@/lib/utils";

export const metadata: Metadata = { title: "Writing" };

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { settings, writings } = await getSite();
  const substack = await getSubstackPosts(settings.substackUrl);
  const categories = [...new Set(writings.map((piece) => piece.category).filter(Boolean))];
  const filtered = category ? writings.filter((piece) => piece.category === category) : writings;
  const lead = category ? filtered[0] : pickSelected(filtered, settings.featuredWritingId);
  const rest = filtered.filter((piece) => piece.id !== lead?.id);

  return (
    <div className="shell pb-24 pt-14 md:pt-20">
      <div className="border-b border-ink pb-10">
        <div className="flex items-baseline justify-between gap-6">
          <p className="label">The journal</p>
          <p className="label">{settings.authorName}</p>
        </div>
        <h1 className="section-title mt-8 max-w-4xl">Letters & notes.</h1>
        {settings.writingIntro ? <p className="mt-5 max-w-xl text-lg text-ink-soft">{settings.writingIntro}</p> : null}
      </div>

      {categories.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/writing" className="nav-link" aria-current={!category ? "page" : undefined}>
            All
          </Link>
          {categories.map((item) => (
            <Link key={item} href={`/writing?category=${encodeURIComponent(item)}`} className="nav-link" aria-current={category === item ? "page" : undefined}>
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      {lead ? (
        <article className="grid gap-8 border-b border-line py-14 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="label">{[lead.category, formatDate(lead.date)].filter(Boolean).join(" · ")}</p>
            <h2 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              <Link href={`/writing/${lead.slug}`}>{lead.title}</Link>
            </h2>
            {lead.excerpt ? <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-soft">{lead.excerpt}</p> : null}
            <div className="mt-6">
              <ArrowLink href={`/writing/${lead.slug}`}>Read</ArrowLink>
            </div>
          </div>
        </article>
      ) : null}

      {rest.map((piece) => (
        <Link key={piece.id} href={`/writing/${piece.slug}`} className="index-row">
          <span className="index-meta label">{formatDate(piece.date) || piece.category}</span>
          <span>
            <span className="block font-serif text-3xl tracking-tight">{piece.title}</span>
            {piece.excerpt ? <span className="mt-1 block max-w-2xl text-ink-soft">{piece.excerpt}</span> : null}
          </span>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
      ))}

      {filtered.length === 0 && substack.length === 0 ? <p className="quiet mt-16">The journal is ready for its first piece.</p> : null}

      {settings.substackUrl || substack.length > 0 ? (
        <aside className="mt-20 border-t border-ink pt-10">
          <p className="label">Substack</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-serif text-4xl tracking-tight">Sent from the desk.</h2>
            {settings.substackUrl ? <ArrowLink href={settings.substackUrl}>Subscribe</ArrowLink> : null}
          </div>
          <ul className="mt-8">
            {substack
              .filter((post) => !writings.some((piece) => piece.title.toLowerCase() === post.title.toLowerCase()))
              .map((post) => (
              <li key={post.link} className="border-t border-line py-5">
                <a href={post.link} className="font-serif text-2xl tracking-tight hover:italic" {...linkRel(post.link)}>
                  {post.title}
                </a>
                {post.date ? <p className="label mt-2">{formatDate(post.date)}</p> : null}
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
