import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "kc_admin";
const isProd = process.env.NODE_ENV === "production";

function secret(): Uint8Array | null {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return new TextEncoder().encode(s);
  if (!isProd) return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
  return null;
}

export function adminConfigured(): boolean {
  if (!isProd) return true;
  return !!(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 10 && secret());
}

const sha = (s: string) => createHash("sha256").update(s).digest();

export function checkCredentials(user: string, pass: string): boolean {
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || (isProd ? "" : "admin12345");
  if (!p) return false;
  const okU = timingSafeEqual(sha(user), sha(u));
  const okP = timingSafeEqual(sha(pass), sha(p));
  return okU && okP;
}

export async function createSession(): Promise<void> {
  const key = secret();
  if (!key) throw new Error("SESSION_SECRET not set");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const key = secret();
  const t = (await cookies()).get(COOKIE)?.value;
  if (!key || !t) return false;
  try {
    const { payload } = await jwtVerify(t, key, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// دفاع در برابر CSRF: فقط درخواست‌های هم‌مبدأ با JSON
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
