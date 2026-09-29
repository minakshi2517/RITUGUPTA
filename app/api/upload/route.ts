import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { backend } from "@/lib/data";
import { storeImage } from "@/lib/uploads";
import { nowIso } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
    const stored = await storeImage(file);
    const alt = String(formData.get("alt") || "");
    await backend().saveMedia({
      id: randomUUID(),
      url: stored.url,
      path: stored.path,
      alt,
      createdAt: nowIso(),
    });
    return NextResponse.json({ url: stored.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The image could not be saved.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
