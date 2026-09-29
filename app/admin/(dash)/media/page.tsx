import { deleteMedia } from "@/lib/actions";
import { DeleteButton } from "@/components/admin/ui";
import { listMedia } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function MediaPage() {
  const media = await listMedia();
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-5xl tracking-tight">Media</h1>
      <p className="mt-4 max-w-xl text-ink-soft">Images you upload from a book, a portrait, or a piece of writing are kept here. Paste an address into a field, or upload a file.</p>
      {media.length === 0 ? <p className="quiet mt-12 text-xl">No images yet.</p> : null}
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <li key={item.id}>
            <img src={item.url} alt={item.alt || ""} className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 break-all font-sans text-xs text-muted">{item.url}</p>
            <p className="label mt-2">{formatDate(item.createdAt)}</p>
            <div className="mt-2">
              <DeleteButton action={deleteMedia} id={item.id} noun="this image" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
