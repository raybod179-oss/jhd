"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/lib/resources";

type R = { key: string; title: string; idCol: string; canCreate: boolean; canDelete: boolean; fields: Field[] };
type Row = Record<string, unknown>;

export function Crud({ resource, rows }: { resource: R; rows: Row[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const listCols = resource.fields.filter((f) => f.list);
  const label = (f: Field, v: unknown) => {
    if (f.type === "checkbox") return v ? "✓" : "—";
    if (f.type === "select") return f.options?.find((o) => o.value === String(v ?? ""))?.label ?? String(v ?? "");
    if (f.type === "number") return Number(v ?? 0).toLocaleString("fa-IR");
    return String(v ?? "").slice(0, 70);
  };

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: Row = {};
    for (const f of resource.fields) {
      if (f.readonly) continue;
      body[f.name] = f.type === "checkbox" ? fd.get(f.name) === "on" : fd.get(f.name);
    }
    setBusy(true); setErr("");
    const url = isNew ? `/api/admin/${resource.key}` : `/api/admin/${resource.key}/${edit![resource.idCol]}`;
    const r = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { setEdit(null); router.refresh(); } else setErr(j.error || "خطا");
  }
  async function del(row: Row) {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/admin/${resource.key}/${row[resource.idCol]}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <h1>{resource.title}</h1>
      {resource.canCreate && !edit && <p><button className="btn" onClick={() => { setIsNew(true); setEdit({}); setErr(""); }}>+ افزودن</button></p>}
      {edit && (
        <form className="box f" onSubmit={save} key={String(edit[resource.idCol] ?? "new")} style={{ marginBottom: 16 }}>
          <h3>{isNew ? "افزودن" : "ویرایش"}</h3>
          {resource.fields.map((f) => {
            const v = edit[f.name];
            if (f.readonly) return <label key={f.name}>{f.label}<input value={String(v ?? "")} readOnly disabled /></label>;
            if (f.type === "checkbox") return <label key={f.name} style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name={f.name} defaultChecked={isNew ? f.name === "active" || f.name === "published" : !!v} style={{ width: "auto" }} />{f.label}</label>;
            if (f.type === "textarea") return <label key={f.name}>{f.label}<textarea name={f.name} defaultValue={String(v ?? "")} rows={f.name === "content" ? 12 : 3} maxLength={f.max} /></label>;
            if (f.type === "select") return <label key={f.name}>{f.label}<select name={f.name} defaultValue={String(v ?? "")}>{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
            return <label key={f.name}>{f.label}<input name={f.name} type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"} defaultValue={String(v ?? (f.type === "number" ? 0 : ""))} required={f.required} maxLength={f.max} min={f.type === "number" ? 0 : undefined} /></label>;
          })}
          {err && <div className="err">{err}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" disabled={busy}>{busy ? "…" : "ذخیره"}</button>
            <button type="button" className="btn ghost" onClick={() => setEdit(null)}>انصراف</button>
          </div>
        </form>
      )}
      <div className="box overflow">
        <table className="t">
          <thead><tr>{listCols.map((f) => <th key={f.name}>{f.label}</th>)}<th /></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[resource.idCol])}>
                {listCols.map((f) => <td key={f.name}>{label(f, row[f.name])}</td>)}
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="btn small" onClick={() => { setIsNew(false); setEdit(row); setErr(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>ویرایش</button>{" "}
                  {resource.canDelete && <button className="btn small danger" onClick={() => del(row)}>حذف</button>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={listCols.length + 1} className="muted">موردی وجود ندارد.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
