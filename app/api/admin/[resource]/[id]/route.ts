import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getResource, sanitize } from "@/lib/crud";
import { run } from "@/lib/db";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res) return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    const body = await req.json();
    const { cols, vals } = sanitize(res, body, false);
    if (!cols.length) return NextResponse.json({ error: "چیزی برای ذخیره نیست" }, { status: 400 });
    await run(`UPDATE ${res.table} SET ${cols.map((c) => `${c}=?`).join(",")} WHERE ${res.idCol}=?`, [...vals, res.idCol === "id" ? Number(id) : id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error && /UNIQUE/i.test(e.message) ? "نامک (slug) تکراری است" : e instanceof Error ? e.message : "خطا";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res || !res.canDelete) return NextResponse.json({ error: "not allowed" }, { status: 405 });
  await run(`DELETE FROM ${res.table} WHERE ${res.idCol}=?`, [Number(id)]);
  return NextResponse.json({ ok: true });
}
