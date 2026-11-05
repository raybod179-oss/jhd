"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { toman } from "@/lib/format";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setError("");
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"), phone: fd.get("phone"), address: fd.get("address"), note: fd.get("note"), website: fd.get("website"),
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { clear(); router.push(`/order/${j.code}`); } else setError(j.error || "خطا در ثبت سفارش");
  }

  if (!items.length) return <div className="box" style={{ marginTop: 24 }}>سبد خالی است. <Link href="/products" style={{ color: "var(--brand)" }}>بازگشت به محصولات</Link></div>;
  return (
    <>
      <h1 style={{ marginTop: 24 }}>ثبت سفارش آزمایشی</h1>
      <div className="notice" style={{ marginBottom: 16 }}>🧪 <b>پروژه‌ی تستی:</b> بدون کد تأیید و بدون پرداخت. اطلاعات واقعی و حساس وارد نکنید؛ می‌توانید اطلاعات فرضی بنویسید.</div>
      <div className="two">
        <form className="box f" onSubmit={submit}>
          <label>نام و نام‌خانوادگی<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
          <label>شماره موبایل (فرضی)<input name="phone" required inputMode="tel" pattern="[0-9۰-۹+]{8,15}" autoComplete="tel" /></label>
          <label>آدرس (فرضی)<textarea name="address" required minLength={5} maxLength={500} rows={3} /></label>
          <label>توضیحات (اختیاری)<textarea name="note" maxLength={500} rows={2} /></label>
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
          {error && <div className="err">{error}</div>}
          <button className="btn" disabled={busy}>{busy ? "در حال ثبت…" : "ثبت سفارش آزمایشی"}</button>
        </form>
        <aside className="box">
          <h3>سفارش شما</h3>
          {items.map((i) => <p key={i.id}>{i.emoji} {i.name} × {i.qty.toLocaleString("fa-IR")}</p>)}
          <p>جمع کل: <b>{toman(total)}</b></p>
          <p className="muted">مبلغ نهایی در سرور محاسبه می‌شود و از شما دریافت نخواهد شد.</p>
        </aside>
      </div>
    </>
  );
}
