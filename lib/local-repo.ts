import "server-only";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { createDefaultStore, defaultSettings } from "./defaults";
import type { AudioItem, Book, ExternalLink, MediaItem, Message, Poem, SiteSettings, Store, Writing } from "./types";

const file = path.join(process.cwd(), "data", "store.json");

let chain: Promise<unknown> = Promise.resolve();
let reading: Promise<Store> | null = null;

function normalize(raw: Partial<Store> | null): Store {
  const base = createDefaultStore();
  const settings = raw?.settings;
  return {
    settings: {
      ...defaultSettings(),
      ...(settings || {}),
      aboutSections: settings?.aboutSections ?? base.settings.aboutSections,
      aboutQuotes: settings?.aboutQuotes ?? base.settings.aboutQuotes,
    },
    books: raw?.books ?? [],
    poems: raw?.poems ?? [],
    writings: raw?.writings ?? [],
    audio: raw?.audio ?? [],
    links: raw?.links ?? [],
    media: raw?.media ?? [],
    messages: raw?.messages ?? [],
  };
}

async function load(): Promise<Store> {
  try {
    const raw = await readFile(file, "utf8");
    return normalize(JSON.parse(raw) as Partial<Store>);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code && code !== "ENOENT") throw error;
    const fresh = createDefaultStore();
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function read() {
  if (!reading) {
    reading = load().finally(() => {
      reading = null;
    });
  }
  return reading;
}

function update(mutator: (store: Store) => void | Promise<void>) {
  const run = chain.then(async () => {
    const current = await read();
    await mutator(current);
    const tmp = `${file}.tmp`;
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(tmp, JSON.stringify(current, null, 2));
    await rename(tmp, file);
    return current;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export const localRepo = {
  async getSettings() {
    return (await read()).settings;
  },
  async updateSettings(patch: Partial<SiteSettings>) {
    const next = await update((store) => {
      store.settings = { ...store.settings, ...patch, updatedAt: new Date().toISOString() };
    });
    return next.settings;
  },
  async listBooks() {
    return (await read()).books;
  },
  async saveBook(book: Book) {
    await update((store) => {
      const index = store.books.findIndex((item) => item.id === book.id);
      if (index >= 0) store.books[index] = book;
      else store.books.push(book);
    });
    return book;
  },
  async deleteBook(id: string) {
    await update((store) => {
      store.books = store.books.filter((item) => item.id !== id);
    });
  },
  async listPoems() {
    return (await read()).poems;
  },
  async savePoem(poem: Poem) {
    await update((store) => {
      const index = store.poems.findIndex((item) => item.id === poem.id);
      if (index >= 0) store.poems[index] = poem;
      else store.poems.push(poem);
    });
    return poem;
  },
  async deletePoem(id: string) {
    await update((store) => {
      store.poems = store.poems.filter((item) => item.id !== id);
    });
  },
  async listWritings() {
    return (await read()).writings;
  },
  async saveWriting(piece: Writing) {
    await update((store) => {
      const index = store.writings.findIndex((item) => item.id === piece.id);
      if (index >= 0) store.writings[index] = piece;
      else store.writings.push(piece);
    });
    return piece;
  },
  async deleteWriting(id: string) {
    await update((store) => {
      store.writings = store.writings.filter((item) => item.id !== id);
    });
  },
  async listAudio() {
    return (await read()).audio;
  },
  async saveAudio(item: AudioItem) {
    await update((store) => {
      const index = store.audio.findIndex((entry) => entry.id === item.id);
      if (index >= 0) store.audio[index] = item;
      else store.audio.push(item);
    });
    return item;
  },
  async deleteAudio(id: string) {
    await update((store) => {
      store.audio = store.audio.filter((item) => item.id !== id);
    });
  },
  async listLinks() {
    return (await read()).links;
  },
  async saveLink(link: ExternalLink) {
    await update((store) => {
      const index = store.links.findIndex((item) => item.id === link.id);
      if (index >= 0) store.links[index] = link;
      else store.links.push(link);
    });
    return link;
  },
  async deleteLink(id: string) {
    await update((store) => {
      store.links = store.links.filter((item) => item.id !== id);
    });
  },
  async listMedia() {
    return (await read()).media;
  },
  async saveMedia(item: MediaItem) {
    await update((store) => {
      store.media.unshift(item);
    });
    return item;
  },
  async deleteMedia(id: string) {
    let removed: MediaItem | undefined;
    await update((store) => {
      removed = store.media.find((item) => item.id === id);
      store.media = store.media.filter((item) => item.id !== id);
    });
    return removed || null;
  },
  async listMessages() {
    return (await read()).messages;
  },
  async saveMessage(message: Message) {
    await update((store) => {
      store.messages.unshift(message);
    });
    return message;
  },
  async deleteMessage(id: string) {
    await update((store) => {
      store.messages = store.messages.filter((item) => item.id !== id);
    });
  },
};
