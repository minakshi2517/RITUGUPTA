import "server-only";
import { defaultSettings } from "./defaults";
import { adminSupabase } from "./supabase";
import type {
  AboutSection,
  AudioItem,
  Book,
  ExternalLink,
  MediaItem,
  Message,
  Poem,
  PullQuote,
  PurchaseLink,
  SiteSettings,
  Writing,
} from "./types";

type Row = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown) {
  return value === true;
}

function stamp(value: unknown) {
  return typeof value === "string" ? value : new Date().toISOString();
}

function dateOnly(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  return value.slice(0, 10);
}

function settingsFromRow(row: Row): SiteSettings {
  const base = defaultSettings();
  return {
    ...base,
    authorName: text(row.author_name),
    descriptor: text(row.descriptor),
    heroStatement: text(row.hero_statement),
    heroIntro: text(row.hero_intro),
    profileImage: text(row.profile_image),
    announcement: text(row.announcement),
    announcementActive: bool(row.announcement_active),
    ctaPrimaryLabel: text(row.cta_primary_label),
    ctaPrimaryHref: text(row.cta_primary_href),
    ctaSecondaryLabel: text(row.cta_secondary_label),
    ctaSecondaryHref: text(row.cta_secondary_href),
    currentlyWriting: text(row.currently_writing),
    currentlyReading: text(row.currently_reading),
    currentlyListening: text(row.currently_listening),
    currentlyPublishing: text(row.currently_publishing),
    poetryHeading: text(row.poetry_heading),
    writingHeading: text(row.writing_heading),
    listenHeading: text(row.listen_heading),
    listenSubheading: text(row.listen_subheading),
    elsewhereHeading: text(row.elsewhere_heading),
    aboutTeaser: text(row.about_teaser),
    aboutHeading: text(row.about_heading),
    aboutLede: text(row.about_lede),
    aboutImage: text(row.about_image),
    aboutSections: Array.isArray(row.about_sections) ? (row.about_sections as AboutSection[]) : base.aboutSections,
    aboutQuotes: Array.isArray(row.about_quotes) ? (row.about_quotes as PullQuote[]) : [],
    contactHeading: text(row.contact_heading),
    contactIntro: text(row.contact_intro),
    booksIntro: text(row.books_intro),
    poetryIntro: text(row.poetry_intro),
    writingIntro: text(row.writing_intro),
    listenIntro: text(row.listen_intro),
    linksIntro: text(row.links_intro),
    closingStatement: text(row.closing_statement),
    footerLine: text(row.footer_line),
    email: text(row.email),
    substackUrl: text(row.substack_url),
    spotifyProfileUrl: text(row.spotify_profile_url),
    metaDescription: text(row.meta_description),
    featuredBookId: text(row.featured_book_id) || null,
    featuredPoemId: text(row.featured_poem_id) || null,
    featuredWritingId: text(row.featured_writing_id) || null,
    featuredAudioId: text(row.featured_audio_id) || null,
    updatedAt: stamp(row.updated_at),
  };
}

function settingsToRow(settings: SiteSettings) {
  return {
    id: 1,
    author_name: settings.authorName,
    descriptor: settings.descriptor,
    hero_statement: settings.heroStatement,
    hero_intro: settings.heroIntro,
    profile_image: settings.profileImage,
    announcement: settings.announcement,
    announcement_active: settings.announcementActive,
    cta_primary_label: settings.ctaPrimaryLabel,
    cta_primary_href: settings.ctaPrimaryHref,
    cta_secondary_label: settings.ctaSecondaryLabel,
    cta_secondary_href: settings.ctaSecondaryHref,
    currently_writing: settings.currentlyWriting,
    currently_reading: settings.currentlyReading,
    currently_listening: settings.currentlyListening,
    currently_publishing: settings.currentlyPublishing,
    poetry_heading: settings.poetryHeading,
    writing_heading: settings.writingHeading,
    listen_heading: settings.listenHeading,
    listen_subheading: settings.listenSubheading,
    elsewhere_heading: settings.elsewhereHeading,
    about_teaser: settings.aboutTeaser,
    about_heading: settings.aboutHeading,
    about_lede: settings.aboutLede,
    about_image: settings.aboutImage,
    about_sections: settings.aboutSections,
    about_quotes: settings.aboutQuotes,
    contact_heading: settings.contactHeading,
    contact_intro: settings.contactIntro,
    books_intro: settings.booksIntro,
    poetry_intro: settings.poetryIntro,
    writing_intro: settings.writingIntro,
    listen_intro: settings.listenIntro,
    links_intro: settings.linksIntro,
    closing_statement: settings.closingStatement,
    footer_line: settings.footerLine,
    email: settings.email,
    substack_url: settings.substackUrl,
    spotify_profile_url: settings.spotifyProfileUrl,
    meta_description: settings.metaDescription,
    featured_book_id: settings.featuredBookId,
    featured_poem_id: settings.featuredPoemId,
    featured_writing_id: settings.featuredWritingId,
    featured_audio_id: settings.featuredAudioId,
    updated_at: settings.updatedAt,
  };
}

function bookFromRow(row: Row): Book {
  return {
    id: text(row.id),
    title: text(row.title),
    subtitle: text(row.subtitle),
    slug: text(row.slug),
    coverImage: text(row.cover_image),
    description: text(row.description),
    authorNote: text(row.author_note),
    year: typeof row.year === "number" ? row.year : null,
    publisher: text(row.publisher),
    isbn: text(row.isbn),
    amazonUrl: text(row.amazon_url),
    purchaseLinks: Array.isArray(row.purchase_links) ? (row.purchase_links as PurchaseLink[]) : [],
    featured: bool(row.featured),
    published: bool(row.published),
    displayOrder: typeof row.display_order === "number" ? row.display_order : 0,
    createdAt: stamp(row.created_at),
    updatedAt: stamp(row.updated_at),
  };
}

function bookToRow(book: Book) {
  return {
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    slug: book.slug,
    cover_image: book.coverImage,
    description: book.description,
    author_note: book.authorNote,
    year: book.year,
    publisher: book.publisher,
    isbn: book.isbn,
    amazon_url: book.amazonUrl,
    purchase_links: book.purchaseLinks,
    featured: book.featured,
    published: book.published,
    display_order: book.displayOrder,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
  };
}

function poemFromRow(row: Row): Poem {
  return {
    id: text(row.id),
    title: text(row.title),
    slug: text(row.slug),
    body: text(row.body),
    date: dateOnly(row.date),
    category: text(row.category),
    bookId: text(row.book_id),
    featured: bool(row.featured),
    published: bool(row.published),
    createdAt: stamp(row.created_at),
    updatedAt: stamp(row.updated_at),
  };
}

function poemToRow(poem: Poem) {
  return {
    id: poem.id,
    title: poem.title,
    slug: poem.slug,
    body: poem.body,
    date: poem.date || null,
    category: poem.category,
    book_id: poem.bookId || null,
    featured: poem.featured,
    published: poem.published,
    created_at: poem.createdAt,
    updated_at: poem.updatedAt,
  };
}

function writingFromRow(row: Row): Writing {
  return {
    id: text(row.id),
    title: text(row.title),
    slug: text(row.slug),
    excerpt: text(row.excerpt),
    content: text(row.content),
    coverImage: text(row.cover_image),
    date: dateOnly(row.date),
    category: text(row.category),
    externalUrl: text(row.external_url),
    bookId: text(row.book_id),
    featured: bool(row.featured),
    published: bool(row.published),
    createdAt: stamp(row.created_at),
    updatedAt: stamp(row.updated_at),
  };
}

function writingToRow(piece: Writing) {
  return {
    id: piece.id,
    title: piece.title,
    slug: piece.slug,
    excerpt: piece.excerpt,
    content: piece.content,
    cover_image: piece.coverImage,
    date: piece.date || null,
    category: piece.category,
    external_url: piece.externalUrl,
    book_id: piece.bookId || null,
    featured: piece.featured,
    published: piece.published,
    created_at: piece.createdAt,
    updated_at: piece.updatedAt,
  };
}

function audioFromRow(row: Row): AudioItem {
  return {
    id: text(row.id),
    title: text(row.title),
    slug: text(row.slug),
    description: text(row.description),
    spotifyUrl: text(row.spotify_url),
    coverImage: text(row.cover_image),
    type: text(row.type) || "playlist",
    featured: bool(row.featured),
    published: bool(row.published),
    displayOrder: typeof row.display_order === "number" ? row.display_order : 0,
    createdAt: stamp(row.created_at),
    updatedAt: stamp(row.updated_at),
  };
}

function audioToRow(item: AudioItem) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    spotify_url: item.spotifyUrl,
    cover_image: item.coverImage,
    type: item.type,
    featured: item.featured,
    published: item.published,
    display_order: item.displayOrder,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

function linkFromRow(row: Row): ExternalLink {
  return {
    id: text(row.id),
    title: text(row.title),
    url: text(row.url),
    icon: text(row.icon) || "web",
    description: text(row.description),
    displayOrder: typeof row.display_order === "number" ? row.display_order : 0,
    active: row.active !== false,
    createdAt: stamp(row.created_at),
    updatedAt: stamp(row.updated_at),
  };
}

function linkToRow(link: ExternalLink) {
  return {
    id: link.id,
    title: link.title,
    url: link.url,
    icon: link.icon,
    description: link.description,
    display_order: link.displayOrder,
    active: link.active,
    created_at: link.createdAt,
    updated_at: link.updatedAt,
  };
}

function mediaFromRow(row: Row): MediaItem {
  return {
    id: text(row.id),
    url: text(row.url),
    path: text(row.path),
    alt: text(row.alt),
    createdAt: stamp(row.created_at),
  };
}

function messageFromRow(row: Row): Message {
  return {
    id: text(row.id),
    name: text(row.name),
    email: text(row.email),
    body: text(row.body),
    createdAt: stamp(row.created_at),
  };
}

async function rows(table: string) {
  const { data, error } = await adminSupabase().from(table).select("*");
  if (error) throw new Error(error.message);
  return (data || []) as Row[];
}

async function upsert(table: string, value: Record<string, unknown>) {
  const { error } = await adminSupabase().from(table).upsert(value);
  if (error) throw new Error(error.message);
}

export const supabaseRepo = {
  async getSettings() {
    const { data, error } = await adminSupabase().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      const settings = defaultSettings();
      await upsert("site_settings", settingsToRow(settings));
      return settings;
    }
    return settingsFromRow(data as Row);
  },
  async updateSettings(patch: Partial<SiteSettings>) {
    const current = await this.getSettings();
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await upsert("site_settings", settingsToRow(next));
    return next;
  },
  async listBooks() {
    return (await rows("books")).map(bookFromRow);
  },
  async saveBook(book: Book) {
    await upsert("books", bookToRow(book));
    return book;
  },
  async deleteBook(id: string) {
    const { error } = await adminSupabase().from("books").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listPoems() {
    return (await rows("poems")).map(poemFromRow);
  },
  async savePoem(poem: Poem) {
    await upsert("poems", poemToRow(poem));
    return poem;
  },
  async deletePoem(id: string) {
    const { error } = await adminSupabase().from("poems").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listWritings() {
    return (await rows("writings")).map(writingFromRow);
  },
  async saveWriting(piece: Writing) {
    await upsert("writings", writingToRow(piece));
    return piece;
  },
  async deleteWriting(id: string) {
    const { error } = await adminSupabase().from("writings").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listAudio() {
    return (await rows("audio_items")).map(audioFromRow);
  },
  async saveAudio(item: AudioItem) {
    await upsert("audio_items", audioToRow(item));
    return item;
  },
  async deleteAudio(id: string) {
    const { error } = await adminSupabase().from("audio_items").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listLinks() {
    return (await rows("links")).map(linkFromRow);
  },
  async saveLink(link: ExternalLink) {
    await upsert("links", linkToRow(link));
    return link;
  },
  async deleteLink(id: string) {
    const { error } = await adminSupabase().from("links").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listMedia() {
    return (await rows("media")).map(mediaFromRow);
  },
  async saveMedia(item: MediaItem) {
    const { error } = await adminSupabase().from("media").insert({
      id: item.id,
      url: item.url,
      path: item.path,
      alt: item.alt,
      created_at: item.createdAt,
    });
    if (error) throw new Error(error.message);
    return item;
  },
  async deleteMedia(id: string) {
    const existing = (await this.listMedia()).find((item) => item.id === id) || null;
    const { error } = await adminSupabase().from("media").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (existing?.path && !existing.path.startsWith("/uploads/")) {
      await adminSupabase().storage.from("media").remove([existing.path]);
    }
    return existing;
  },
  async listMessages() {
    return (await rows("messages")).map(messageFromRow);
  },
  async saveMessage(message: Message) {
    const { error } = await adminSupabase().from("messages").insert({
      id: message.id,
      name: message.name,
      email: message.email,
      body: message.body,
      created_at: message.createdAt,
    });
    if (error) throw new Error(error.message);
    return message;
  },
  async deleteMessage(id: string) {
    const { error } = await adminSupabase().from("messages").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
