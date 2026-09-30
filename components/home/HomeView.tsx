import Link from "next/link";
import type { AudioItem, Book, ExternalLink, Poem, SiteSettings, Writing } from "@/lib/types";
import type { SubstackPost } from "@/lib/substack";
import { formatDate, linkRel, pickSelected } from "@/lib/utils";
import { ArrowLink } from "@/components/site/ArrowLink";
import { ClipCards } from "@/components/site/ClipCards";
import { Cover } from "@/components/site/Cover";
import { Lines } from "@/components/site/Lines";
import { Portrait } from "@/components/site/Portrait";
import { Reveal } from "@/components/site/Reveal";
import { SpotifyFrame } from "@/components/site/SpotifyFrame";

export function HomeView({
  settings,
  books,
  poems,
  writings,
  audio,
  links,
  substack,
}: {
  settings: SiteSettings;
  books: Book[];
  poems: Poem[];
  writings: Writing[];
  audio: AudioItem[];
  links: ExternalLink[];
  substack: SubstackPost[];
}) {
  const book = pickSelected(books, settings.featuredBookId);
  const poem = pickSelected(poems, settings.featuredPoemId);
  const otherPoems = poems.filter((item) => item.id !== poem?.id).slice(0, 3);
  const writing = pickSelected(writings, settings.featuredWritingId);
  const otherWriting = writings.filter((item) => item.id !== writing?.id).slice(0, 3);
  const track = pickSelected(audio, settings.featuredAudioId);
  const buy = book?.amazonUrl || book?.purchaseLinks[0]?.url || "";
  const portrait = settings.profileImage;
  const subscribeHref = settings.substackUrl || "/contact";

  return (
    <>
      <section className="home-open">
        <div className="shell grid items-end gap-12 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-24">
          <div className="lg:col-span-7">
            <p className="label">{settings.descriptor}</p>
            <p className="home-name">{settings.authorName}</p>
            <h1 className="hero-title mt-6 text-balance">
              <Lines text={settings.heroStatement} italicLast />
            </h1>
            <div className="mt-10 grid items-end gap-8 md:grid-cols-[minmax(0,28rem)_auto] md:gap-12">
              <p className="hero-intro max-w-md text-lg leading-relaxed">{settings.heroIntro}</p>
              <div className="flex flex-wrap gap-x-8">
                <ArrowLink href={settings.ctaPrimaryHref}>{settings.ctaPrimaryLabel}</ArrowLink>
                <ArrowLink href={settings.ctaSecondaryHref}>{settings.ctaSecondaryLabel}</ArrowLink>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Portrait className="portrait-on-dark hero-portrait" src={portrait} name={settings.authorName} />
          </div>
        </div>
      </section>

      <section className="shell mt-16 md:mt-24">
        <div className="border-t border-ink pt-6">
          <h2 className="label text-ink">Currently</h2>
        </div>
        <dl className="currently mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Writing", settings.currentlyWriting],
            ["Reading", settings.currentlyReading],
            ["Listening", settings.currentlyListening],
            ["Publishing", settings.currentlyPublishing],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell mt-20 md:mt-28" aria-label="Photographs">
        <p className="label">From the days</p>
        <div className="stills mt-8">
          <figure className="still still-a">
            <img src="/gallery/book-trees.jpg" alt="The Dance of the Poltergeists, held up under a tree" />
          </figure>
          <figure className="still still-b">
            <img src="/gallery/vairagya.png" alt="A poem, Vairagya, written on tea-stained paper" />
          </figure>
          <figure className="still still-c">
            <img src="/gallery/open-book.jpg" alt="An open book of poems in daylight" />
          </figure>
        </div>
      </section>

      <section className="shell mt-24 md:mt-36">
        {book ? (
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Link href={`/books/${book.slug}`} className="cover-link block max-w-[26rem]">
                <Cover src={book.coverImage} title={book.title} alt={`Cover of ${book.title}`} />
              </Link>
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="label">Book</p>
              <h2 className="section-title mt-4">
                {book.title}
                {book.subtitle ? <span className="mt-2 block font-serif text-[0.42em] italic font-light tracking-normal text-ink-soft">{book.subtitle}</span> : null}
              </h2>
              {book.description ? <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{book.description}</p> : null}
              <div className="mt-8 flex flex-wrap gap-x-8">
                <ArrowLink href={`/books/${book.slug}`}>Read more</ArrowLink>
                {buy ? <ArrowLink href={buy}>Buy the book</ArrowLink> : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid items-end gap-10 border-t border-ink pt-8 md:grid-cols-12">
            <h2 className="section-title md:col-span-7">
              The shelf
              <span className="block italic font-light">is still being set.</span>
            </h2>
            <p className="quiet md:col-span-4">A cover will take this space when a book is placed here.</p>
          </div>
        )}
      </section>

      <section className="shell mt-28 md:mt-40">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="poetry-pin lg:col-span-5">
            <p className="label">Poetry</p>
            <h2 className="section-title mt-4">
              <Lines text={settings.poetryHeading} italicLast />
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {poem ? (
              <div className="wash-panel wash-2">
                <p className="label">
                  {poem.title}
                  {poem.date ? ` · ${formatDate(poem.date)}` : ""}
                </p>
                <div className="poem mt-8 whitespace-pre-wrap">{poem.body}</div>
                <div className="mt-8">
                  <ArrowLink href={`/poetry/${poem.slug}`}>Continue reading</ArrowLink>
                </div>
              </div>
            ) : (
              <p className="quiet">The poems will be set here, one page at a time.</p>
            )}
            {otherPoems.length > 0 ? (
              <ul className="mt-4 grid gap-3">
                {otherPoems.map((item, index) => (
                  <li key={item.id}>
                    <Link href={`/poetry/${item.slug}`} className={`wash-panel wash-${((index + 3) % 6) + 1} group flex items-baseline justify-between gap-6`}>
                      <span className="font-serif text-2xl tracking-tight group-hover:italic">{item.title}</span>
                      <span className="label shrink-0">{item.category || formatDate(item.date) || "Poem"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="shell mt-28 md:mt-40">
        <div className="grid gap-14 border-t border-ink pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label">Writing</p>
            <h2 className="section-title mt-4">
              <Lines text={settings.writingHeading} italicLast />
            </h2>
            {writing ? (
              <article className="mt-12">
                <p className="label">
                  {[writing.category, formatDate(writing.date)].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-3 font-serif text-4xl leading-none tracking-tight md:text-5xl">
                  <Link href={`/writing/${writing.slug}`}>{writing.title}</Link>
                </h3>
                {writing.excerpt ? <p className="mt-5 max-w-xl text-lg text-ink-soft">{writing.excerpt}</p> : null}
                <div className="mt-6">
                  <ArrowLink href={`/writing/${writing.slug}`}>Read the piece</ArrowLink>
                </div>
              </article>
            ) : substack[0] ? (
              <article className="mt-12">
                <p className="label">Substack · {substack[0].date ? formatDate(substack[0].date) : "Latest"}</p>
                <h3 className="mt-3 font-serif text-4xl leading-none tracking-tight md:text-5xl">
                  <a href={substack[0].link} {...linkRel(substack[0].link)}>
                    {substack[0].title}
                  </a>
                </h3>
                {substack[0].excerpt ? <p className="mt-5 max-w-xl text-lg text-ink-soft">{substack[0].excerpt}</p> : null}
              </article>
            ) : (
              <p className="quiet mt-10">Essays, notes, and letters will gather here.</p>
            )}
            {otherWriting.length > 0 ? (
              <ul className="mt-10">
                {otherWriting.map((item) => (
                  <li key={item.id} className="border-t border-line">
                    <Link href={`/writing/${item.slug}`} className="flex items-baseline justify-between gap-6 py-4">
                      <span className="font-serif text-2xl">{item.title}</span>
                      <span className="label">{formatDate(item.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <aside className="substack-card lg:col-span-4 lg:col-start-9">
            <p className="label">Substack</p>
            <p className="mt-4 font-serif text-3xl leading-tight tracking-tight">Latest writing, sent quietly.</p>
            <p className="mt-4 max-w-xs text-ink-soft">New pieces go out from the longer road. Read them there, or have them sent to you.</p>
            <div className="mt-8">
              <ArrowLink href={subscribeHref}>Subscribe</ArrowLink>
            </div>
          </aside>
        </div>
      </section>

      <section className="ink-band mt-28 md:mt-40">
        <div className="shell grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label">{settings.listenHeading}</p>
            <h2 className="section-title mt-4 text-[var(--on-dark)]">
              <Lines text={settings.listenSubheading} italicLast />
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {track ? (
              <>
                <p className="label">{track.type}</p>
                <h3 className="mt-3 font-serif text-4xl tracking-tight">{track.title}</h3>
                {track.description ? <p className="mt-4 max-w-md text-[var(--on-dark-muted)]">{track.description}</p> : null}
                <div className="mt-6">
                  <SpotifyFrame url={track.spotifyUrl} title={track.title} />
                </div>
                <div className="mt-4">
                  <ArrowLink href={track.spotifyUrl}>Play on Spotify</ArrowLink>
                </div>
              </>
            ) : settings.spotifyProfileUrl ? (
              <>
                <p className="font-reading text-2xl italic text-[var(--on-dark-muted)]">The listening room opens on Spotify.</p>
                <div className="mt-6">
                  <ArrowLink href={settings.spotifyProfileUrl}>Open Spotify</ArrowLink>
                </div>
              </>
            ) : (
              <p className="font-reading text-2xl italic text-[var(--on-dark-muted)]">Nothing is queued yet.</p>
            )}
          </div>
        </div>
      </section>

      {links.length > 0 ? (
        <section className="shell mt-24 md:mt-32">
          <p className="label">Elsewhere</p>
          <h2 className="section-title mt-4 max-w-3xl">
            <Lines text={settings.elsewhereHeading} italicLast />
          </h2>
          <ClipCards links={links} />
        </section>
      ) : null}

      <section className="shell mt-28 md:mt-40">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Portrait src={settings.aboutImage || settings.profileImage} name={settings.authorName} />
          </div>
          <div className="lg:col-span-6 lg:col-start-6">
            <p className="label">About</p>
            <h2 className="section-title mt-4">
              <Lines text={settings.aboutHeading} italicLast />
            </h2>
            {settings.aboutTeaser ? <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{settings.aboutTeaser}</p> : null}
            <div className="mt-8">
              <ArrowLink href="/about">Read the full story</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-28 text-center md:py-40">
        <h2 className="hero-title mx-auto max-w-5xl">
          <Lines text={settings.closingStatement} italicLast />
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          <ArrowLink href="/writing">Read something</ArrowLink>
          <ArrowLink href={subscribeHref}>Subscribe</ArrowLink>
          <ArrowLink href="/listen">Listen</ArrowLink>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </section>
    </>
  );
}
