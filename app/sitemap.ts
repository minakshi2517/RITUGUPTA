import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const paths = [
    "",
    "/about",
    "/books",
    "/poetry",
    "/writing",
    "/listen",
    "/links",
    "/contact",
    ...site.books.map((book) => `/books/${book.slug}`),
    ...site.poems.map((poem) => `/poetry/${poem.slug}`),
    ...site.writings.map((piece) => `/writing/${piece.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));
}
