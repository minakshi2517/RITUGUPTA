import { deleteMessage } from "@/lib/actions";
import { DeleteButton } from "@/components/admin/ui";
import { listMessages } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
  const messages = [...(await listMessages())].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-5xl tracking-tight">Notes</h1>
      <p className="mt-4 text-ink-soft">What people send from the contact page.</p>
      {messages.length === 0 ? <p className="quiet mt-12 text-xl">No notes yet.</p> : null}
      <ul className="mt-10">
        {messages.map((message) => (
          <li key={message.id} className="border-t border-line py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-serif text-2xl">{message.name}</p>
              <p className="label">{formatDate(message.createdAt)}</p>
            </div>
            <a className="mt-1 inline-block text-accent" href={`mailto:${message.email}`}>
              {message.email}
            </a>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed">{message.body}</p>
            <div className="mt-4">
              <DeleteButton action={deleteMessage} id={message.id} noun="this note" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
