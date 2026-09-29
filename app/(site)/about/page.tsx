import type { Metadata } from "next";
import { CardDeck } from "@/components/site/CardDeck";
import { Portrait } from "@/components/site/Portrait";
import { Lines } from "@/components/site/Lines";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const settings = await getSettings();
  const sections = settings.aboutSections.filter((section) => section.title.trim() && section.body.trim());
  const quotes = settings.aboutQuotes.filter((quote) => quote.text.trim());

  return (
    <article className="shell pb-24 pt-14 md:pt-20">
      <p className="label">{settings.authorName}</p>
      <h1 className="section-title mt-5 max-w-5xl">
        <Lines text={settings.aboutHeading || settings.authorName} italicLast />
      </h1>
      <div className="mt-14 grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Portrait src={settings.aboutImage || settings.profileImage} name={settings.authorName} />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {settings.aboutLede ? <p className="font-serif text-2xl leading-snug italic md:text-3xl">{settings.aboutLede}</p> : null}
          {quotes[0] ? (
            <blockquote className="my-14">
              <p className="font-serif text-4xl leading-[1.08] italic tracking-tight md:text-5xl">{quotes[0].text}</p>
              {quotes[0].attribution ? <footer className="label mt-5">{quotes[0].attribution}</footer> : null}
            </blockquote>
          ) : null}
        </div>
      </div>

      <CardDeck
        cards={sections.map((section, index) => {
          const quote = quotes[index + 1];
          return {
            id: section.id,
            number: String(index + 1).padStart(2, "0"),
            title: section.title,
            body: section.body,
            quote: quote ? { text: quote.text, attribution: quote.attribution } : undefined,
          };
        })}
      />
    </article>
  );
}
