import "server-only";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { localRepo } from "./local-repo";
import { supabaseRepo } from "./supabase-repo";
import { supabaseConfigured } from "./supabase";
import { byDateDesc, byOrder } from "./utils";

export function storageMode(): "local" | "supabase" {
  return supabaseConfigured() ? "supabase" : "local";
}

export function backend() {
  return storageMode() === "supabase" ? supabaseRepo : localRepo;
}

export function refreshSite() {
  revalidatePath("/", "layout");
}

export const getSettings = cache(async () => backend().getSettings());
export const listBooks = cache(async () => backend().listBooks());
export const listPoems = cache(async () => backend().listPoems());
export const listWritings = cache(async () => backend().listWritings());
export const listAudio = cache(async () => backend().listAudio());
export const listLinks = cache(async () => backend().listLinks());
export const listMedia = cache(async () => backend().listMedia());
export const listMessages = cache(async () => backend().listMessages());

export const getSite = cache(async () => {
  const [settings, books, poems, writings, audio, links] = await Promise.all([
    getSettings(),
    listBooks(),
    listPoems(),
    listWritings(),
    listAudio(),
    listLinks(),
  ]);
  return {
    settings,
    books: byOrder(books.filter((item) => item.published)),
    poems: byDateDesc(poems.filter((item) => item.published)),
    writings: byDateDesc(writings.filter((item) => item.published)),
    audio: byOrder(audio.filter((item) => item.published)),
    links: byOrder(links.filter((item) => item.active)),
  };
});
