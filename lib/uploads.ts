import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { adminSupabase, supabaseConfigured } from "./supabase";

const MAX_BYTES = 8 * 1024 * 1024;

function sniff(buffer: Buffer) {
  if (buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (buffer.length > 8 && buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") return { ext: "png", type: "image/png" };
  if (buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return { ext: "webp", type: "image/webp" };
  }
  if (buffer.length > 6 && (buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a")) {
    return { ext: "gif", type: "image/gif" };
  }
  return null;
}

export async function storeImage(file: File) {
  if (!file || file.size === 0) throw new Error("Choose an image first.");
  if (file.size > MAX_BYTES) throw new Error("That image is larger than 8 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) throw new Error("Use a JPG, PNG, WEBP, or GIF image.");
  const filename = `${randomUUID()}.${kind.ext}`;

  if (supabaseConfigured()) {
    const supabase = adminSupabase();
    const { error } = await supabase.storage.from("media").upload(filename, bytes, {
      contentType: kind.type,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("media").getPublicUrl(filename);
    return { url: data.publicUrl, path: filename };
  }

  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, filename);
  const relative = path.relative(directory, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Could not store that image.");
  await writeFile(target, bytes);
  return { url: `/uploads/${filename}`, path: `/uploads/${filename}` };
}

export async function removeStoredFile(storedPath: string) {
  if (!storedPath) return;
  if (storedPath.startsWith("/uploads/")) {
    const directory = path.join(process.cwd(), "public", "uploads");
    const target = path.join(directory, path.basename(storedPath));
    const relative = path.relative(directory, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return;
    await unlink(target).catch(() => undefined);
    return;
  }
  if (supabaseConfigured()) {
    await adminSupabase().storage.from("media").remove([storedPath]).catch(() => undefined);
  }
}
