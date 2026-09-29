import Link from "next/link";
import { saveAbout, saveAudio, saveBook, saveHome, saveLink, savePoem, saveSettings, saveWriting } from "@/lib/actions";
import type { AudioItem, Book, ExternalLink, Poem, SiteSettings, Writing } from "@/lib/types";
import { AboutSectionsField, PurchaseLinksField, QuotesField } from "./editors";
import { AdminForm, Check, Field, ImageField, SaveButton } from "./ui";

const ICONS = ["web", "substack", "spotify", "instagram", "youtube", "goodreads", "amazon", "x", "linkedin", "email"];
const CATEGORIES = ["Essay", "Note", "Story", "Reflection", "Newsletter"];
const AUDIO_TYPES = ["song", "playlist", "podcast", "reading", "episode"];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line pt-8">
      <h2 className="font-serif text-3xl tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Choice({
  label,
  name,
  value,
  options,
  hint,
}: {
  label: string;
  name: string;
  value: string | null;
  options: { id: string; title: string; published?: boolean }[];
  hint?: string;
}) {
  return (
    <label>
      <span className="studio-label">{label}</span>
      <select className="studio-select" name={name} defaultValue={value || ""}>
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
            {option.published === false ? " (hidden)" : ""}
          </option>
        ))}
      </select>
      {hint ? <p className="hint">{hint}</p> : null}
    </label>
  );
}

export function HomeEditor({
  settings,
  books,
  poems,
  writings,
  audio,
}: {
  settings: SiteSettings;
  books: Book[];
  poems: Poem[];
  writings: Writing[];
  audio: AudioItem[];
}) {
  return (
    <AdminForm action={saveHome} className="grid max-w-3xl gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl tracking-tight">Homepage</h1>
          <p className="hint">Your name, email, Substack, and Spotify profile live in Settings.</p>
        </div>
        <SaveButton />
      </div>
      <Group title="Opening">
        <Field label="Opening statement" name="heroStatement" defaultValue={settings.heroStatement} textarea rows={4} hint="Put each line of the large statement on its own line." />
        <Field label="Short introduction" name="heroIntro" defaultValue={settings.heroIntro} textarea rows={4} />
        <ImageField name="profileImage" label="Portrait" initial={settings.profileImage} hint="Shown beside the opening, and anywhere else a portrait is needed." />
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="First button" name="ctaPrimaryLabel" defaultValue={settings.ctaPrimaryLabel} />
          <Field label="First button link" name="ctaPrimaryHref" defaultValue={settings.ctaPrimaryHref} hint="A page like /poetry, or a full https link." />
          <Field label="Second button" name="ctaSecondaryLabel" defaultValue={settings.ctaSecondaryLabel} />
          <Field label="Second button link" name="ctaSecondaryHref" defaultValue={settings.ctaSecondaryHref} />
        </div>
      </Group>
      <Group title="Announcement">
        <Field label="Banner" name="announcement" defaultValue={settings.announcement} hint="A single line across the top of every page." />
        <Check name="announcementActive" label="Show the banner" defaultChecked={settings.announcementActive} />
      </Group>
      <Group title="Currently">
        <p className="hint -mt-2">A small personal status. Leave a line blank to show a dash.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Writing" name="currentlyWriting" defaultValue={settings.currentlyWriting} />
          <Field label="Reading" name="currentlyReading" defaultValue={settings.currentlyReading} />
          <Field label="Listening" name="currentlyListening" defaultValue={settings.currentlyListening} />
          <Field label="Publishing" name="currentlyPublishing" defaultValue={settings.currentlyPublishing} />
        </div>
      </Group>
      <Group title="Featured on the homepage">
        <Choice label="Featured book" name="featuredBookId" value={settings.featuredBookId} options={books} />
        <Choice label="Featured poem" name="featuredPoemId" value={settings.featuredPoemId} options={poems} />
        <Choice label="Featured writing" name="featuredWritingId" value={settings.featuredWritingId} options={writings} />
        <Choice label="Featured audio" name="featuredAudioId" value={settings.featuredAudioId} options={audio} />
      </Group>
      <Group title="Section headings">
        <Field label="Poetry" name="poetryHeading" defaultValue={settings.poetryHeading} textarea rows={3} hint="One line per line of the heading." />
        <Field label="Writing" name="writingHeading" defaultValue={settings.writingHeading} textarea rows={3} />
        <Field label="Listen label" name="listenHeading" defaultValue={settings.listenHeading} />
        <Field label="Listen heading" name="listenSubheading" defaultValue={settings.listenSubheading} />
        <Field label="Elsewhere" name="elsewhereHeading" defaultValue={settings.elsewhereHeading} />
        <Field label="About, on the homepage" name="aboutTeaser" defaultValue={settings.aboutTeaser} textarea rows={4} />
      </Group>
      <Group title="Closing">
        <Field label="Final line" name="closingStatement" defaultValue={settings.closingStatement} textarea rows={3} />
      </Group>
      <SaveButton />
    </AdminForm>
  );
}

export function AboutEditor({ settings, saved }: { settings: SiteSettings; saved?: boolean }) {
  return (
    <AdminForm key={settings.updatedAt} action={saveAbout} className="grid max-w-3xl gap-8">
      {saved ? <p className="note-ok">Saved. The about page is updated.</p> : null}
      <div>
        <h1 className="font-serif text-5xl tracking-tight">About</h1>
        <p className="hint">Empty sections stay off the public page until you write them.</p>
      </div>
      <Field label="Heading" name="aboutHeading" defaultValue={settings.aboutHeading} textarea rows={3} hint="One line per line." />
      <Field label="Opening paragraph" name="aboutLede" defaultValue={settings.aboutLede} textarea rows={5} />
      <ImageField name="aboutImage" label="Photograph" initial={settings.aboutImage} hint="If this is empty, the portrait from the homepage is used." />
      <AboutSectionsField initial={settings.aboutSections} />
      <QuotesField initial={settings.aboutQuotes} />
      <SaveButton />
    </AdminForm>
  );
}

export function SettingsEditor({ settings }: { settings: SiteSettings; mode: string }) {
  return (
    <AdminForm action={saveSettings} className="grid max-w-2xl gap-7">
      <h1 className="font-serif text-5xl tracking-tight">Settings</h1>
      <Field label="Name" name="authorName" defaultValue={settings.authorName} />
      <Field label="Short description" name="descriptor" defaultValue={settings.descriptor} hint="Shown above the opening. Example: Author · Poet · Writer" />
      <Field label="Email" name="email" defaultValue={settings.email} type="email" hint="Shown on the contact page and in the footer." />
      <Field label="Footer line" name="footerLine" defaultValue={settings.footerLine} />
      <Field label="Search description" name="metaDescription" defaultValue={settings.metaDescription} textarea rows={3} />
      <Field label="Substack link" name="substackUrl" defaultValue={settings.substackUrl} hint="Used for Subscribe, the writing page, and the footer. Leave blank until you have one." />
      <Field label="Spotify profile" name="spotifyProfileUrl" defaultValue={settings.spotifyProfileUrl} hint="Your profile. Individual episodes are added under Audio." />
      <Field label="Contact heading" name="contactHeading" defaultValue={settings.contactHeading} />
      <Field label="Contact introduction" name="contactIntro" defaultValue={settings.contactIntro} textarea rows={3} />
      <SaveButton />
    </AdminForm>
  );
}

export function BookEditor({ book, saved }: { book: Book | null; saved?: boolean }) {
  return (
    <AdminForm key={book?.updatedAt || "new"} action={saveBook} className="grid max-w-2xl gap-7">
      {saved ? <p className="note-ok">Saved. The website is updated.</p> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">{book ? "Edit book" : "Add a book"}</h1>
        {book ? (
          <Link href={`/books/${book.slug}`} className="text-btn">
            View →
          </Link>
        ) : null}
      </div>
      <input type="hidden" name="id" value={book?.id || ""} />
      <Field label="Title" name="title" defaultValue={book?.title} />
      <Field label="Subtitle" name="subtitle" defaultValue={book?.subtitle} />
      <Field label="Page address" name="slug" defaultValue={book?.slug} hint="Optional. Leave blank and one will be made from the title." />
      <ImageField name="coverImage" label="Cover" initial={book?.coverImage || ""} />
      <Field label="Description" name="description" defaultValue={book?.description} textarea rows={6} />
      <Field label="Author note" name="authorNote" defaultValue={book?.authorNote} textarea rows={5} hint="A personal note beside the facts of the book." />
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Year" name="year" defaultValue={book?.year ?? ""} type="number" />
        <Field label="Order" name="displayOrder" defaultValue={book?.displayOrder ?? ""} type="number" hint="Smaller numbers appear first." />
        <Field label="Publisher" name="publisher" defaultValue={book?.publisher} />
        <Field label="ISBN" name="isbn" defaultValue={book?.isbn} />
      </div>
      <Field label="Amazon link" name="amazonUrl" defaultValue={book?.amazonUrl} />
      <PurchaseLinksField initial={book?.purchaseLinks || []} />
      <Check name="published" label="Publish on the website" defaultChecked={book?.published ?? false} />
      <Check name="featured" label="Feature this book" defaultChecked={book?.featured ?? false} />
      <SaveButton label={book ? "Save book" : "Add book"} />
    </AdminForm>
  );
}

export function PoemEditor({ poem, books, saved }: { poem: Poem | null; books: Book[]; saved?: boolean }) {
  return (
    <AdminForm key={poem?.updatedAt || "new"} action={savePoem} className="grid max-w-2xl gap-7">
      {saved ? <p className="note-ok">Saved. The website is updated.</p> : null}
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">{poem ? "Edit poem" : "Add a poem"}</h1>
        {poem ? (
          <Link href={`/poetry/${poem.slug}`} className="text-btn">
            View →
          </Link>
        ) : null}
      </div>
      <input type="hidden" name="id" value={poem?.id || ""} />
      <Field label="Title" name="title" defaultValue={poem?.title} />
      <Field label="Page address" name="slug" defaultValue={poem?.slug} hint="Optional." />
      <label>
        <span className="studio-label">The poem</span>
        <textarea className="studio-textarea min-h-[22rem] font-reading text-lg leading-relaxed" name="body" defaultValue={poem?.body || ""} />
        <p className="hint">Keep the line breaks as you want them read.</p>
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Date" name="date" defaultValue={poem?.date} type="date" />
        <Field label="Category" name="category" defaultValue={poem?.category} />
      </div>
      <label>
        <span className="studio-label">Related book</span>
        <select className="studio-select" name="bookId" defaultValue={poem?.bookId || ""}>
          <option value="">None</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </label>
      <Check name="published" label="Publish on the website" defaultChecked={poem?.published ?? false} />
      <Check name="featured" label="Feature this poem" defaultChecked={poem?.featured ?? false} />
      <SaveButton label={poem ? "Save poem" : "Add poem"} />
    </AdminForm>
  );
}

export function WritingEditor({ piece, books, saved }: { piece: Writing | null; books: Book[]; saved?: boolean }) {
  return (
    <AdminForm key={piece?.updatedAt || "new"} action={saveWriting} className="grid max-w-2xl gap-7">
      {saved ? <p className="note-ok">Saved. The website is updated.</p> : null}
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-5xl tracking-tight">{piece ? "Edit writing" : "Add writing"}</h1>
        {piece ? (
          <Link href={`/writing/${piece.slug}`} className="text-btn">
            View →
          </Link>
        ) : null}
      </div>
      <input type="hidden" name="id" value={piece?.id || ""} />
      <Field label="Title" name="title" defaultValue={piece?.title} />
      <Field label="Page address" name="slug" defaultValue={piece?.slug} hint="Optional." />
      <Field label="Excerpt" name="excerpt" defaultValue={piece?.excerpt} textarea rows={3} hint="A few lines shown in the archive." />
      <label>
        <span className="studio-label">Category</span>
        <input className="studio-input" name="category" list="writing-categories" defaultValue={piece?.category || ""} />
        <datalist id="writing-categories">
          {CATEGORIES.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </label>
      <Field label="Date" name="date" defaultValue={piece?.date} type="date" />
      <ImageField name="coverImage" label="Image" initial={piece?.coverImage || ""} />
      <Field label="The piece" name="content" defaultValue={piece?.content} textarea rows={16} hint="Separate paragraphs with a blank line. Start a line with ## for a heading, or > for a pull quote." />
      <Field label="External link" name="externalUrl" defaultValue={piece?.externalUrl} hint="If this also lives on Substack or elsewhere." />
      <label>
        <span className="studio-label">Related book</span>
        <select className="studio-select" name="bookId" defaultValue={piece?.bookId || ""}>
          <option value="">None</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </label>
      <Check name="published" label="Publish on the website" defaultChecked={piece?.published ?? false} />
      <Check name="featured" label="Feature this piece" defaultChecked={piece?.featured ?? false} />
      <SaveButton label={piece ? "Save writing" : "Add writing"} />
    </AdminForm>
  );
}

export function AudioEditor({ item, saved }: { item: AudioItem | null; saved?: boolean }) {
  return (
    <AdminForm key={item?.updatedAt || "new"} action={saveAudio} className="grid max-w-2xl gap-7">
      {saved ? <p className="note-ok">Saved. The website is updated.</p> : null}
      <h1 className="font-serif text-5xl tracking-tight">{item ? "Edit audio" : "Add audio"}</h1>
      <input type="hidden" name="id" value={item?.id || ""} />
      <Field label="Title" name="title" defaultValue={item?.title} />
      <Field label="Spotify link" name="spotifyUrl" defaultValue={item?.spotifyUrl} hint="Paste the link from Spotify. A player will appear on the site." />
      <label>
        <span className="studio-label">Type</span>
        <select className="studio-select" name="type" defaultValue={item?.type || "playlist"}>
          {AUDIO_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <Field label="Description" name="description" defaultValue={item?.description} textarea rows={4} />
      <ImageField name="coverImage" label="Artwork" initial={item?.coverImage || ""} hint="Optional. Spotify's player already shows artwork." />
      <Field label="Order" name="displayOrder" defaultValue={item?.displayOrder ?? ""} type="number" />
      <Check name="published" label="Publish on the website" defaultChecked={item?.published ?? false} />
      <Check name="featured" label="Feature this" defaultChecked={item?.featured ?? false} />
      <SaveButton label={item ? "Save audio" : "Add audio"} />
    </AdminForm>
  );
}

export function LinkEditor({ link, saved }: { link: ExternalLink | null; saved?: boolean }) {
  return (
    <AdminForm key={link?.updatedAt || "new"} action={saveLink} className="grid max-w-2xl gap-7">
      {saved ? <p className="note-ok">Saved. The website is updated.</p> : null}
      <h1 className="font-serif text-5xl tracking-tight">{link ? "Edit link" : "Add a link"}</h1>
      <input type="hidden" name="id" value={link?.id || ""} />
      <Field label="Name" name="title" defaultValue={link?.title} hint="Substack, Instagram, Goodreads — whatever the place is called." />
      <Field label="URL" name="url" defaultValue={link?.url} />
      <label>
        <span className="studio-label">Kind</span>
        <select className="studio-select" name="icon" defaultValue={link?.icon || "web"}>
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </label>
      <Field label="Short description" name="description" defaultValue={link?.description} />
      <Field label="Order" name="displayOrder" defaultValue={link?.displayOrder ?? ""} type="number" hint="Smaller numbers appear first." />
      <Check name="active" label="Show on the website" defaultChecked={link?.active ?? true} />
      <SaveButton label={link ? "Save link" : "Add link"} />
    </AdminForm>
  );
}
