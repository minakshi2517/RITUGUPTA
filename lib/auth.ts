import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { anonSupabase, supabaseAuthConfigured } from "./supabase";
import { readSession, SESSION_COOKIE, signSession, type Session } from "./session";

const attempts = new Map<string, { count: number; reset: number }>();

function sameSecret(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

function rateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.reset < now) {
    attempts.set(key, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

async function setSession(session: Session) {
  const token = await signSession(session);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function authenticate(email: string, password: string, ip = "local") {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password || password.length > 200) {
    return { ok: false as const, message: "Those details don't match." };
  }
  if (rateLimit(ip)) {
    return { ok: false as const, message: "Too many attempts. Wait a few minutes and try again." };
  }

  if (supabaseAuthConfigured()) {
    const supabase = anonSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalized, password });
    if (!error && data.user) {
      await setSession({ sub: data.user.id, email: data.user.email || normalized, mode: "supabase" });
      return { ok: true as const };
    }
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (adminEmail && adminPassword && sameSecret(normalized, adminEmail) && sameSecret(password, adminPassword)) {
    await setSession({ sub: "local-admin", email: adminEmail, mode: "local" });
    return { ok: true as const };
  }

  return { ok: false as const, message: "Those details don't match." };
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
