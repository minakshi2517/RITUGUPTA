import Link from "next/link";
import { STARTER_BOOK_ID } from "@/lib/defaults";
import { listAudio, listBooks, listLinks, listMessages, listPoems, listWritings, getSettings, storageMode } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [settings, books, poems, writings, audio, links, messages] = await Promise.all([
    getSettings(),
    listBooks(),
    listPoems(),
    listWritings(),
    listAudio(),
    listLinks(),
    listMessages(),
  ]);
  const published = (items: { published: boolean }[]) => items.filter((item) => item.published).length;
  const recent = [
    ...books.map((item) => ({ type: "Book", title: item.title, href: `/admin/books/${item.id}`, at: item.updatedAt })),
    ...poems.map((item) => ({ type: "Poem", title: item.title, href: `/admin/poetry/${item.id}`, at: item.updatedAt })),
    ...writings.map((item) => ({ type: "Writing", title: item.title, href: `/admin/writing/${item.id}`, at: item.updatedAt })),
    ...audio.map((item) => ({ type: "Audio", title: item.title, href: `/admin/audio/${item.id}`, at: item.updatedAt })),
    ...links.map((item) => ({ type: "Link", title: item.title, href: `/admin/links/${item.id}`, at: item.updatedAt })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  const featured = [
    ["Book", books.find((item) => item.id === settings.featuredBookId)?.title],
    ["Poem", poems.find((item) => item.id === settings.featuredPoemId)?.title],
    ["Writing", writings.find((item) => item.id === settings.featuredWritingId)?.title],
    ["Audio", audio.find((item) => item.id === settings.featuredAudioId)?.title],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  const counts = [
    ["Books", books.length, published(books)],
    ["Poems", poems.length, published(poems)],
    ["Writings", writings.length, published(writings)],
    ["Audio", audio.length, published(audio)],
  ] as const;

  return (
    <div className="max-w-4xl">
      <p className="label">Studio</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">Good to see you.</h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Change something here and the website changes with it.
        {storageMode() === "local" ? " Right now everything is saved on this computer." : " Changes are saved to Supabase."}
      </p>
      {books.some((book) => book.id === STARTER_BOOK_ID) ? (
        <p className="note-ok mt-8">An untitled book is on the shelf so the pages have a shape. Edit it into a real book, or delete it.</p>
      ) : null}

      <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {counts.map(([label, total, live]) => (
          <div key={label} className="bg-paper px-4 py-5">
            <p className="label">{label}</p>
            <p className="mt-2 font-serif text-4xl">{total}</p>
            <p className="mt-1 font-sans text-sm text-muted">{live} on the site</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/admin/books/new" className="arrow-link">
          <span>Add a book</span>
          <span className="arrow">→</span>
        </Link>
        <Link href="/admin/poetry/new" className="arrow-link">
          <span>Add a poem</span>
          <span className="arrow">→</span>
        </Link>
        <Link href="/admin/writing/new" className="arrow-link">
          <span>Add writing</span>
          <span className="arrow">→</span>
        </Link>
        <Link href="/admin/links/new" className="arrow-link">
          <span>Add a link</span>
          <span className="arrow">→</span>
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-3xl">Featured</h2>
        {featured.length === 0 ? <p className="mt-3 text-ink-soft">Nothing is featured yet.</p> : null}
        <ul className="mt-4">
          {featured.map(([label, title]) => (
            <li key={label} className="flex gap-6 border-t border-line py-3">
              <span className="label w-24">{label}</span>
              <span>{title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Recent updates</h2>
          {recent.length === 0 ? <p className="mt-3 text-ink-soft">Nothing has been added yet.</p> : null}
          <ul className="mt-4">
            {recent.map((item) => (
              <li key={item.href} className="border-t border-line py-3">
                <Link href={item.href} className="font-serif text-xl">
                  {item.title}
                </Link>
                <p className="label mt-1">
                  {item.type} · {formatDate(item.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-3xl">Notes</h2>
          <p className="mt-3 font-sans text-sm text-muted">{messages.length} received</p>
          <ul className="mt-4">
            {messages.slice(0, 3).map((message) => (
              <li key={message.id} className="border-t border-line py-3">
                <p className="font-serif text-xl">{message.name}</p>
                <p className="mt-1 line-clamp-2 text-ink-soft">{message.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/admin/messages" className="arrow-link mt-4">
            <span>Open notes</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
