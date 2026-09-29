"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate, clearSession, requireAdmin } from "./auth";
import { backend, refreshSite } from "./data";
import type { ActionState, AudioItem, Book, ExternalLink, Poem, SiteSettings, Writing } from "./types";
import { cleanHref, cleanHttpUrl, nowIso, uniqueSlug } from "./utils";

const introKeys = ["booksIntro", "poetryIntro", "writingIntro", "listenIntro", "linksIntro"] as const;

function field(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim();
}

function checked(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "on" || value === "true";
}

function fail(message: string): ActionState {
  return { ok: false, message };
}

function ok(message: string): ActionState {
  return { ok: true, message };
}

function friendly(error: unknown): string {
  if (typeof error === "object" && error && "digest" in error) {
    const digest = String((error as { digest?: string }).digest || "");
    if (digest.startsWith("NEXT_REDIRECT")) throw error;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Try again.";
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const result = await authenticate(field(formData, "email"), String(formData.get("password") || ""), ip);
  if (!result.ok) return fail(result.message);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveHome(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const patch: Partial<SiteSettings> = {
      heroStatement: field(formData, "heroStatement"),
      heroIntro: field(formData, "heroIntro"),
      profileImage: field(formData, "profileImage"),
      announcement: field(formData, "announcement"),
      announcementActive: checked(formData, "announcementActive"),
      ctaPrimaryLabel: field(formData, "ctaPrimaryLabel") || "Read my work",
      ctaPrimaryHref: cleanHref(field(formData, "ctaPrimaryHref") || "/poetry"),
      ctaSecondaryLabel: field(formData, "ctaSecondaryLabel") || "About me",
      ctaSecondaryHref: cleanHref(field(formData, "ctaSecondaryHref") || "/about"),
      currentlyWriting: field(formData, "currentlyWriting"),
      currentlyReading: field(formData, "currentlyReading"),
      currentlyListening: field(formData, "currentlyListening"),
      currentlyPublishing: field(formData, "currentlyPublishing"),
      poetryHeading: field(formData, "poetryHeading"),
      writingHeading: field(formData, "writingHeading"),
      listenHeading: field(formData, "listenHeading"),
      listenSubheading: field(formData, "listenSubheading"),
      elsewhereHeading: field(formData, "elsewhereHeading"),
      aboutTeaser: field(formData, "aboutTeaser"),
      closingStatement: field(formData, "closingStatement"),
      featuredBookId: field(formData, "featuredBookId") || null,
      featuredPoemId: field(formData, "featuredPoemId") || null,
      featuredWritingId: field(formData, "featuredWritingId") || null,
      featuredAudioId: field(formData, "featuredAudioId") || null,
    };
    if (!patch.heroStatement) return fail("The opening statement needs a few words.");
    await backend().updateSettings(patch);
    refreshSite();
    return ok("Saved. The homepage is updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(120),
  body: z.string().max(20000),
});

const quoteSchema = z.object({
  id: z.string().min(1),
  text: z.string().max(800),
  attribution: z.string().max(160),
});

export async function saveAbout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const sections = z.array(sectionSchema).parse(JSON.parse(field(formData, "aboutSections") || "[]"));
    const quotes = z.array(quoteSchema).parse(JSON.parse(field(formData, "aboutQuotes") || "[]"));
    await backend().updateSettings({
      aboutHeading: field(formData, "aboutHeading"),
      aboutLede: field(formData, "aboutLede"),
      aboutImage: field(formData, "aboutImage"),
      aboutSections: sections.map((section) => ({
        ...section,
        title: section.title.trim(),
        body: section.body.trim(),
      })),
      aboutQuotes: quotes
        .map((quote) => ({ ...quote, text: quote.text.trim(), attribution: quote.attribution.trim() }))
        .filter((quote) => quote.text),
    });
    refreshSite();
    return ok("Saved. The about page is updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const email = field(formData, "email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("That email address doesn't look complete.");
    await backend().updateSettings({
      authorName: field(formData, "authorName") || "Ritu Gupta",
      descriptor: field(formData, "descriptor"),
      email,
      footerLine: field(formData, "footerLine"),
      metaDescription: field(formData, "metaDescription"),
      substackUrl: cleanHttpUrl(field(formData, "substackUrl")),
      spotifyProfileUrl: cleanHttpUrl(field(formData, "spotifyProfileUrl")),
      contactHeading: field(formData, "contactHeading"),
      contactIntro: field(formData, "contactIntro"),
    });
    refreshSite();
    return ok("Saved. Those details now appear across the site.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function saveIntro(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const key = field(formData, "key");
  if (!introKeys.includes(key as (typeof introKeys)[number])) return fail("Unknown field.");
  await backend().updateSettings({ [key]: field(formData, "value") });
  refreshSite();
  return ok("Saved. The page introduction is updated.");
}

function purchaseLinks(formData: FormData) {
  const labels = formData.getAll("purchaseLabel").map((value) => String(value).trim());
  const urls = formData.getAll("purchaseUrl").map((value) => String(value).trim());
  return labels
    .map((label, index) => ({ label, url: urls[index] || "" }))
    .filter((link) => link.label || link.url)
    .map((link) => {
      if (!link.label || !link.url) throw new Error("Each purchase link needs a name and a URL.");
      return { label: link.label, url: cleanHttpUrl(link.url) };
    });
}

export async function saveBook(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const title = field(formData, "title");
    if (!title) return fail("A book needs a title.");
    const repo = backend();
    const books = await repo.listBooks();
    const existingId = field(formData, "id");
    const current = books.find((item) => item.id === existingId);
    const id = current?.id || randomUUID();
    const yearRaw = field(formData, "year");
    let year: number | null = null;
    if (yearRaw) {
      year = Number(yearRaw);
      if (!Number.isInteger(year) || year < 1000 || year > 2100) return fail("Enter a four-digit year, or leave it blank.");
    }
    const orderRaw = field(formData, "displayOrder");
    const displayOrder = orderRaw ? Number(orderRaw) : Math.max(0, ...books.map((item) => item.displayOrder)) + 1;
    if (!Number.isFinite(displayOrder)) return fail("Order needs to be a number.");
    const book: Book = {
      id,
      title,
      subtitle: field(formData, "subtitle"),
      slug: uniqueSlug(books, field(formData, "slug") || title, id),
      coverImage: field(formData, "coverImage"),
      description: field(formData, "description"),
      authorNote: field(formData, "authorNote"),
      year,
      publisher: field(formData, "publisher"),
      isbn: field(formData, "isbn").slice(0, 24),
      amazonUrl: cleanHttpUrl(field(formData, "amazonUrl")),
      purchaseLinks: purchaseLinks(formData),
      featured: checked(formData, "featured"),
      published: checked(formData, "published"),
      displayOrder,
      createdAt: current?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    await repo.saveBook(book);
    const settings = await repo.getSettings();
    if (book.featured) await repo.updateSettings({ featuredBookId: book.id });
    else if (settings.featuredBookId === book.id) await repo.updateSettings({ featuredBookId: null });
    refreshSite();
    if (!current) redirect(`/admin/books/${book.id}?saved=1`);
    return ok("Saved. The books page is updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function savePoem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const title = field(formData, "title");
    if (!title) return fail("A poem needs a title.");
    const body = String(formData.get("body") || "").replace(/\r\n/g, "\n").trim();
    const published = checked(formData, "published");
    if (published && !body) return fail("Add the poem before publishing it.");
    const repo = backend();
    const poems = await repo.listPoems();
    const existingId = field(formData, "id");
    const current = poems.find((item) => item.id === existingId);
    const id = current?.id || randomUUID();
    const poem: Poem = {
      id,
      title,
      slug: uniqueSlug(poems, field(formData, "slug") || title, id),
      body,
      date: field(formData, "date"),
      category: field(formData, "category"),
      bookId: field(formData, "bookId"),
      featured: checked(formData, "featured"),
      published,
      createdAt: current?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    await repo.savePoem(poem);
    const settings = await repo.getSettings();
    if (poem.featured) await repo.updateSettings({ featuredPoemId: poem.id });
    else if (settings.featuredPoemId === poem.id) await repo.updateSettings({ featuredPoemId: null });
    refreshSite();
    if (!current) redirect(`/admin/poetry/${poem.id}?saved=1`);
    return ok("Saved. The poetry pages are updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function saveWriting(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const title = field(formData, "title");
    if (!title) return fail("This piece needs a title.");
    const content = String(formData.get("content") || "").replace(/\r\n/g, "\n").trim();
    const externalUrl = cleanHttpUrl(field(formData, "externalUrl"));
    const published = checked(formData, "published");
    if (published && !content && !externalUrl) return fail("Add the writing, or a link to where it lives, before publishing.");
    const repo = backend();
    const writings = await repo.listWritings();
    const existingId = field(formData, "id");
    const current = writings.find((item) => item.id === existingId);
    const id = current?.id || randomUUID();
    const piece: Writing = {
      id,
      title,
      slug: uniqueSlug(writings, field(formData, "slug") || title, id),
      excerpt: field(formData, "excerpt"),
      content,
      coverImage: field(formData, "coverImage"),
      date: field(formData, "date"),
      category: field(formData, "category"),
      externalUrl,
      bookId: field(formData, "bookId"),
      featured: checked(formData, "featured"),
      published,
      createdAt: current?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    await repo.saveWriting(piece);
    const settings = await repo.getSettings();
    if (piece.featured) await repo.updateSettings({ featuredWritingId: piece.id });
    else if (settings.featuredWritingId === piece.id) await repo.updateSettings({ featuredWritingId: null });
    refreshSite();
    if (!current) redirect(`/admin/writing/${piece.id}?saved=1`);
    return ok("Saved. The writing pages are updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function saveAudio(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const title = field(formData, "title");
    if (!title) return fail("Give this a title.");
    const spotifyUrl = cleanHttpUrl(field(formData, "spotifyUrl"));
    if (!spotifyUrl) return fail("Add a Spotify link.");
    const repo = backend();
    const audio = await repo.listAudio();
    const existingId = field(formData, "id");
    const current = audio.find((item) => item.id === existingId);
    const id = current?.id || randomUUID();
    const orderRaw = field(formData, "displayOrder");
    const item: AudioItem = {
      id,
      title,
      slug: uniqueSlug(audio, field(formData, "slug") || title, id),
      description: field(formData, "description"),
      spotifyUrl,
      coverImage: field(formData, "coverImage"),
      type: field(formData, "type") || "playlist",
      featured: checked(formData, "featured"),
      published: checked(formData, "published"),
      displayOrder: orderRaw ? Number(orderRaw) : Math.max(0, ...audio.map((entry) => entry.displayOrder)) + 1,
      createdAt: current?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    await repo.saveAudio(item);
    const settings = await repo.getSettings();
    if (item.featured) await repo.updateSettings({ featuredAudioId: item.id });
    else if (settings.featuredAudioId === item.id) await repo.updateSettings({ featuredAudioId: null });
    refreshSite();
    if (!current) redirect(`/admin/audio/${item.id}?saved=1`);
    return ok("Saved. The listening pages are updated.");
  } catch (error) {
    return fail(friendly(error));
  }
}

export async function saveLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const title = field(formData, "title");
    const url = cleanHttpUrl(field(formData, "url"));
    if (!title) return fail("A link needs a name.");
    if (!url) return fail("A link needs a URL.");
    const repo = backend();
    const links = await repo.listLinks();
    const existingId = field(formData, "id");
    const current = links.find((item) => item.id === existingId);
    const id = current?.id || randomUUID();
    const orderRaw = field(formData, "displayOrder");
    const link: ExternalLink = {
      id,
      title,
      url,
      icon: field(formData, "icon") || "web",
      description: field(formData, "description"),
      displayOrder: orderRaw ? Number(orderRaw) : Math.max(0, ...links.map((item) => item.displayOrder)) + 1,
      active: checked(formData, "active"),
      createdAt: current?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    await repo.saveLink(link);
    refreshSite();
    if (!current) redirect(`/admin/links/${link.id}?saved=1`);
    return ok("Saved. The link now follows this site.");
  } catch (error) {
    return fail(friendly(error));
  }
}

async function clearFeature(kind: string, id: string) {
  const repo = backend();
  const settings = await repo.getSettings();
  const key =
    kind === "book"
      ? "featuredBookId"
      : kind === "poem"
        ? "featuredPoemId"
        : kind === "writing"
          ? "featuredWritingId"
          : kind === "audio"
            ? "featuredAudioId"
            : null;
  if (key && settings[key] === id) await repo.updateSettings({ [key]: null });
}

export async function togglePublished(formData: FormData) {
  await requireAdmin();
  const kind = field(formData, "kind");
  const id = field(formData, "id");
  const repo = backend();
  const stamp = nowIso();
  if (kind === "book") {
    const item = (await repo.listBooks()).find((entry) => entry.id === id);
    if (item) await repo.saveBook({ ...item, published: !item.published, updatedAt: stamp });
  } else if (kind === "poem") {
    const item = (await repo.listPoems()).find((entry) => entry.id === id);
    if (item) {
      if (!item.published && !item.body.trim()) return;
      await repo.savePoem({ ...item, published: !item.published, updatedAt: stamp });
    }
  } else if (kind === "writing") {
    const item = (await repo.listWritings()).find((entry) => entry.id === id);
    if (item) {
      if (!item.published && !item.content.trim() && !item.externalUrl) return;
      await repo.saveWriting({ ...item, published: !item.published, updatedAt: stamp });
    }
  } else if (kind === "audio") {
    const item = (await repo.listAudio()).find((entry) => entry.id === id);
    if (item) await repo.saveAudio({ ...item, published: !item.published, updatedAt: stamp });
  }
  refreshSite();
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const kind = field(formData, "kind");
  const id = field(formData, "id");
  const repo = backend();
  const settings = await repo.getSettings();
  const stamp = nowIso();
  if (kind === "book") {
    const item = (await repo.listBooks()).find((entry) => entry.id === id);
    if (!item) return;
    const active = settings.featuredBookId === id;
    await repo.saveBook({ ...item, featured: !active, updatedAt: stamp });
    await repo.updateSettings({ featuredBookId: active ? null : id });
  } else if (kind === "poem") {
    const item = (await repo.listPoems()).find((entry) => entry.id === id);
    if (!item) return;
    const active = settings.featuredPoemId === id;
    await repo.savePoem({ ...item, featured: !active, updatedAt: stamp });
    await repo.updateSettings({ featuredPoemId: active ? null : id });
  } else if (kind === "writing") {
    const item = (await repo.listWritings()).find((entry) => entry.id === id);
    if (!item) return;
    const active = settings.featuredWritingId === id;
    await repo.saveWriting({ ...item, featured: !active, updatedAt: stamp });
    await repo.updateSettings({ featuredWritingId: active ? null : id });
  } else if (kind === "audio") {
    const item = (await repo.listAudio()).find((entry) => entry.id === id);
    if (!item) return;
    const active = settings.featuredAudioId === id;
    await repo.saveAudio({ ...item, featured: !active, updatedAt: stamp });
    await repo.updateSettings({ featuredAudioId: active ? null : id });
  }
  refreshSite();
}

export async function deleteBook(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  await backend().deleteBook(id);
  await clearFeature("book", id);
  refreshSite();
}

export async function deletePoem(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  await backend().deletePoem(id);
  await clearFeature("poem", id);
  refreshSite();
}

export async function deleteWriting(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  await backend().deleteWriting(id);
  await clearFeature("writing", id);
  refreshSite();
}

export async function deleteAudio(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  await backend().deleteAudio(id);
  await clearFeature("audio", id);
  refreshSite();
}

export async function toggleLinkActive(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const repo = backend();
  const item = (await repo.listLinks()).find((entry) => entry.id === id);
  if (!item) return;
  await repo.saveLink({ ...item, active: !item.active, updatedAt: nowIso() });
  refreshSite();
}

export async function deleteLink(formData: FormData) {
  await requireAdmin();
  await backend().deleteLink(field(formData, "id"));
  refreshSite();
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await backend().deleteMessage(field(formData, "id"));
  refreshSite();
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const removed = await backend().deleteMedia(field(formData, "id"));
  if (removed) {
    const { removeStoredFile } = await import("./uploads");
    await removeStoredFile(removed.path);
  }
  refreshSite();
}

const recentMessages = new Map<string, number[]>();

export async function sendMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (field(formData, "company")) return ok("It's with me now. Thank you.");
  const name = field(formData, "name").slice(0, 120);
  const email = field(formData, "email").slice(0, 180);
  const body = String(formData.get("message") || "").trim().slice(0, 5000);
  if (name.length < 1) return fail("Please leave your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please leave a real email address.");
  if (body.length < 2) return fail("Write a few words first.");
  const now = Date.now();
  const hits = (recentMessages.get(email) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (hits.length >= 5) return fail("That's enough notes for the moment. Try again later.");
  hits.push(now);
  recentMessages.set(email, hits);
  try {
    await backend().saveMessage({
      id: randomUUID(),
      name,
      email,
      body,
      createdAt: nowIso(),
    });
    refreshSite();
    return ok("It's with me now. Thank you.");
  } catch {
    return fail("The note couldn't be sent. Try again in a moment.");
  }
}
