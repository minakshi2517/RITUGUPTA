import Link from "next/link";
import { deleteAudio, deleteBook, deleteLink, deletePoem, deleteWriting, toggleFeatured, toggleLinkActive, togglePublished } from "@/lib/actions";
import { DeleteButton } from "./ui";

const removers = {
  book: deleteBook,
  poem: deletePoem,
  writing: deleteWriting,
  audio: deleteAudio,
  link: deleteLink,
};

export function EntryList({
  rows,
  kind,
  featuredId,
  empty,
}: {
  rows: { id: string; href: string; title: string; meta: string; onSite: boolean }[];
  kind: "book" | "poem" | "writing" | "audio" | "link";
  featuredId?: string | null;
  empty: string;
}) {
  if (rows.length === 0) return <p className="quiet text-xl">{empty}</p>;
  return (
    <ul className="border-t border-line">
      {rows.map((row) => {
        const featured = featuredId === row.id;
        return (
          <li key={row.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-line py-4">
            <div className="min-w-[12rem] flex-1">
              <Link href={row.href} className="font-serif text-2xl tracking-tight">
                {row.title}
              </Link>
              <p className="mt-1 font-sans text-sm text-muted">{row.meta}</p>
            </div>
            {kind === "link" ? (
              <form action={toggleLinkActive}>
                <input type="hidden" name="id" value={row.id} />
                <button className="text-btn">{row.onSite ? "Hide" : "Show"}</button>
              </form>
            ) : (
              <form action={togglePublished}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={row.id} />
                <button className="text-btn">{row.onSite ? "Unpublish" : "Publish"}</button>
              </form>
            )}
            {kind !== "link" ? (
              <form action={toggleFeatured}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={row.id} />
                <button className="text-btn">{featured ? "Featured" : "Feature"}</button>
              </form>
            ) : null}
            <Link href={row.href} className="text-btn">
              Edit
            </Link>
            <DeleteButton action={removers[kind]} id={row.id} noun={row.title} />
          </li>
        );
      })}
    </ul>
  );
}
