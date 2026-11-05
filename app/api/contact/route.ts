import { NextResponse } from "next/server";
import { z } from "zod";
import { run } from "@/lib/db";
import { clientIp, limited } from "@/lib/ratelimit";
import { sameOrigin } from "@/lib/auth";

const schema = z.object({
  kind: z.enum(["contact", "vendor", "advertise", "writer"]).default("contact"),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 403 });
  if (limited("msg:" + clientIp(req), 5, 10 * 60_000)) return NextResponse.json({ error: "تعداد درخواست زیاد است." }, { status: 429 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "اطلاعات معتبر نیست." }, { status: 400 });
  const d = p.data;
  await run("INSERT INTO messages(kind,name,phone,email,body) VALUES(?,?,?,?,?)", [d.kind, d.name, d.phone, d.email, d.body]);
  return NextResponse.json({ ok: true });
}
