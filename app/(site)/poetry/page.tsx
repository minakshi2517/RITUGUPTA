import type { Metadata } from "next";
import Link from "next/link";
import { Lines } from "@/components/site/Lines";
import { getSite } from "@/lib/data";
import { formatDate, poemPreview } from "@/lib/utils";

export const metadata: Metadata = { title: "Poetry" };

export default async function PoetryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { settings, poems } = await getSite();
  const categories = [...new Set(poems.map((poem) => poem.category).filter(Boolean))];
  const visible = category ? poems.filter((poem) => poem.category === category) : poems;

  return (
    <div className="shell pb-20 pt-8 md:pt-10">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="label">Poetry</p>
          <h1 className="section-title mt-3">
            <Lines text={settings.poetryIntro} italicLast />
          </h1>
        </div>
        <figure className="quiet-still lg:col-span-4 lg:col-start-9">
          <img src="/gallery/writing-desk.jpg" alt="A woman writing at a desk, pen in hand" />
        </figure>
      </div>

      {categories.length > 1 ? (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/poetry" className="nav-link" aria-current={!category ? "page" : undefined}>
            All
          </Link>
          {categories.map((item) => (
            <Link key={item} href={`/poetry?category=${encodeURIComponent(item)}`} className="nav-link" aria-current={category === item ? "page" : undefined}>
              {item}
            </Link>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? <p className="quiet mt-20">The archive is open. The first poem has not been placed yet.</p> : null}

      <div className="mt-10 grid max-w-3xl gap-3">
        {visible.map((poem, index) => (
          <Link key={poem.id} href={`/poetry/${poem.slug}`} className={`wash-panel wash-${(index % 6) + 1} block`}>
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-serif text-4xl tracking-tight md:text-5xl">{poem.title}</h2>
              <span className="label shrink-0">{poem.category || "Poem"}</span>
            </div>
            <p className="label mt-3">{formatDate(poem.date)}</p>
            {poem.body ? <p className="poem mt-6 line-clamp-4 whitespace-pre-wrap text-[1.15rem]">{poemPreview(poem.body, 4)}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
