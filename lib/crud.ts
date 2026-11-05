import "server-only";
import type { InValue } from "@libsql/client";
import { RESOURCES, type Field, type Resource } from "./resources";
import { slugify } from "./format";

export function getResource(key: string): Resource | null {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : null;
}

// تبدیل بدنه‌ی JSON به مقادیر امن بر اساس تعریف فیلدها (whitelist)
export function sanitize(res: Resource, body: Record<string, unknown>, creating: boolean) {
  const cols: string[] = [];
  const vals: InValue[] = [];
  for (const f of res.fields as Field[]) {
    if (f.readonly) continue;
    if (!(f.name in body)) {
      if (creating && f.type === "checkbox") { cols.push(f.name); vals.push(0); }
      continue;
    }
    const raw = body[f.name];
    let v: InValue;
    if (f.type === "number") v = Number.isFinite(Number(raw)) ? Math.max(0, Math.round(Number(raw))) : 0;
    else if (f.type === "checkbox") v = raw ? 1 : 0;
    else {
      v = String(raw ?? "").trim().slice(0, f.max ?? 500);
      if (f.type === "url" && v && !/^https:\/\/[^\s]+$/i.test(v)) throw new Error(`${f.label}: فقط آدرس https معتبر`);
      if (f.type === "select" && f.options && !f.options.some((o) => o.value === v)) throw new Error(`${f.label}: مقدار نامعتبر`);
      if (f.type === "select" && f.optionsFrom) v = v === "" ? null : Number(v);
    }
    if (f.required && (v === "" || v === null)) throw new Error(`${f.label} الزامی است`);
    cols.push(f.name);
    vals.push(v);
  }
  if (res.slugFrom) {
    const i = cols.indexOf("slug");
    const src = String(body[res.slugFrom] ?? "");
    let slug = i >= 0 ? String(vals[i] || "") : "";
    slug = slugify(slug || src);
    if (!slug && creating) slug = "item-" + Date.now().toString(36);
    if (i >= 0) vals[i] = slug;
    else if (slug) { cols.push("slug"); vals.push(slug); }
  }
  return { cols, vals };
}
