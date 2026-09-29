import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "studio_session";

export type Session = {
  sub: string;
  email: string;
  mode: "local" | "supabase";
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing. Add it to .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(session: Session) {
  return new SignJWT({ email: session.email, mode: session.mode })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      mode: payload.mode === "supabase" ? "supabase" : "local",
    };
  } catch {
    return null;
  }
}
