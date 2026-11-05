import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { one, q } from "@/lib/db";
import { toman } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سفارش ثبت شد", robots: { index: false, follow: false } };

export default async function Order({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase();
  if (!/^KC-[A-Z0-9]{8}$/.test(code)) notFound();
  const o = await one<{ id: number; code: string; total: number; created_at: string }>("SELECT id,code,total,created_at FROM orders WHERE code=?", [code]);
  if (!o) notFound();
  const items = await q<{ name: string; qty: number; price: number }>("SELECT name,qty,price FROM order_items WHERE order_id=?", [o.id]);
  return (
    <div className="box" style={{ margin: "24px 0" }}>
      <div className="ok">✅ سفارش آزمایشی شما ثبت شد. کد پیگیری: <b>{o.code}</b></div>
      <h3 style={{ marginTop: 16 }}>اقلام</h3>
      {items.map((i, k) => <p key={k}>{i.name} × {i.qty.toLocaleString("fa-IR")} — {toman(i.price * i.qty)}</p>)}
      <p>جمع کل: <b>{toman(o.total)}</b></p>
      <div className="notice">⚠️ این یک <b>پروژه‌ی تستی</b> است؛ هیچ مبلغی دریافت نشد و هیچ کالایی ارسال نخواهد شد.</div>
      <p><Link href="/" className="btn" style={{ marginTop: 12 }}>بازگشت به فروشگاه</Link></p>
    </div>
  );
}
