import { NextResponse } from "next/server";
import { adminConfigured, checkCredentials, createSession, sameOrigin } from "@/lib/auth";
import { clientIp, limited } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 403 });
  if (!adminConfigured()) return NextResponse.json({ error: "ADMIN_PASSWORD و SESSION_SECRET در تنظیمات سرور ست نشده‌اند." }, { status: 503 });
  if (limited("login:" + clientIp(req), 8, 15 * 60_000)) return NextResponse.json({ error: "تلاش بیش از حد؛ بعداً دوباره امتحان کنید." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const ok = checkCredentials(String(body.username ?? ""), String(body.password ?? ""));
  await new Promise((r) => setTimeout(r, 400)); // کند کردن brute-force
  if (!ok) return NextResponse.json({ error: "نام کاربری یا رمز اشتباه است." }, { status: 401 });
  await createSession();
  return NextResponse.json({ ok: true });
}
