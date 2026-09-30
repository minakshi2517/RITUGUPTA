import type { Metadata } from "next";
import Link from "next/link";
import { Clothesline } from "@/components/site/Clothesline";
import { Lines } from "@/components/site/Lines";
import { getSite } from "@/lib/data";

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
    <>
      <div className="shell pb-10 pt-8 md:pt-10">
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
      </div>

      {visible.length > 0 ? <Clothesline poems={visible} /> : null}
    </>
  );
}
