"use client";
import { useState } from "react";

export function ContactForm({ kind, placeholder, button = "ارسال" }: { kind: "contact" | "vendor" | "advertise" | "writer"; placeholder: string; button?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("busy");
    const r = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, name: fd.get("name"), phone: fd.get("phone"), email: fd.get("email"), body: fd.get("body"), website: fd.get("website") }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setState("ok"); (e.target as HTMLFormElement).reset(); } else { setState("err"); setMsg(j.error || "خطا در ارسال"); }
  }
  if (state === "ok") return <div className="ok">✅ پیام شما ثبت شد (نسخه‌ی آزمایشی). ممنون!</div>;
  return (
    <form className="f" onSubmit={submit}>
      <label>نام<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
      <label>موبایل<input name="phone" inputMode="tel" maxLength={20} autoComplete="tel" /></label>
      <label>ایمیل<input name="email" type="email" maxLength={120} autoComplete="email" /></label>
      <label>پیام<textarea name="body" required minLength={5} maxLength={2000} rows={5} placeholder={placeholder} /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
      {state === "err" && <div className="err">{msg}</div>}
      <button className="btn" disabled={state === "busy"}>{state === "busy" ? "در حال ارسال…" : button}</button>
    </form>
  );
}
