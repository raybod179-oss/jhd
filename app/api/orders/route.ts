import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { q, ready_ } from "@/lib/db";
import { clientIp, limited } from "@/lib/ratelimit";
import { sameOrigin } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9۰-۹+]{8,15}$/),
  address: z.string().trim().min(5).max(500),
  note: z.string().trim().max(500).optional().default(""),
  website: z.string().max(0).optional(), // honeypot
  items: z.array(z.object({ id: z.number().int().positive(), qty: z.number().int().min(1).max(20) })).min(1).max(30),
});

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 403 });
  if (limited("order:" + clientIp(req), 10, 10 * 60_000)) return NextResponse.json({ error: "تعداد درخواست زیاد است؛ کمی بعد تلاش کنید." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات واردشده معتبر نیست." }, { status: 400 });
  const d = parsed.data;

  const ids = [...new Set(d.items.map((i) => i.id))];
  const rows = await q<{ id: number; name: string; price: number }>(
    `SELECT id,name,price FROM products WHERE active=1 AND id IN (${ids.map(() => "?").join(",")})`, ids
  );
  const map = new Map(rows.map((r) => [r.id, r]));
  const lines = d.items.filter((i) => map.has(i.id));
  if (!lines.length) return NextResponse.json({ error: "محصولی یافت نشد." }, { status: 400 });
  const total = lines.reduce((s, i) => s + map.get(i.id)!.price * i.qty, 0); // قیمت همیشه از سرور
  const code = "KC-" + randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

  const c = await ready_();
  const tx = await c.transaction("write");
  try {
    const r = await tx.execute({
      sql: "INSERT INTO orders(code,name,phone,address,note,total,status) VALUES(?,?,?,?,?,?, 'new')",
      args: [code, d.name, d.phone, d.address, d.note, total],
    });
    const orderId = Number(r.lastInsertRowid);
    for (const i of lines) {
      const p = map.get(i.id)!;
      await tx.execute({ sql: "INSERT INTO order_items(order_id,product_id,name,price,qty) VALUES(?,?,?,?,?)", args: [orderId, p.id, p.name, p.price, i.qty] });
    }
    await tx.commit();
  } catch {
    await tx.rollback();
    return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  } finally {
    tx.close();
  }
  return NextResponse.json({ ok: true, code });
}
