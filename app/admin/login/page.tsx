"use client";
import { useState } from "react";

export default function Login() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) location.href = "/admin"; else setErr(j.error || "خطا");
  }
  return (
    <form className="box f" onSubmit={submit} style={{ maxWidth: 380, margin: "40px auto" }}>
      <h1 style={{ fontSize: "1.4rem" }}>ورود به پنل مدیریت</h1>
      <label>نام کاربری<input name="username" required autoComplete="username" /></label>
      <label>رمز عبور<input name="password" type="password" required autoComplete="current-password" /></label>
      {err && <div className="err">{err}</div>}
      <button className="btn" disabled={busy}>{busy ? "…" : "ورود"}</button>
    </form>
  );
}
