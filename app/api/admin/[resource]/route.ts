import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getResource, sanitize } from "@/lib/crud";
import { q, run } from "@/lib/db";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const res = getResource((await params).resource);
  if (!res) return NextResponse.json({ error: "not found" }, { status: 404 });
  const rows = await q(`SELECT * FROM ${res.table} ORDER BY ${res.order} LIMIT 500`);
  return NextResponse.json({ rows });
}

export async function POST(req: Request, { params }: Ctx) {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const res = getResource((await params).resource);
  if (!res || !res.canCreate) return NextResponse.json({ error: "not allowed" }, { status: 405 });
  try {
    const body = await req.json();
    const { cols, vals } = sanitize(res, body, true);
    await run(`INSERT INTO ${res.table}(${cols.join(",")}) VALUES(${cols.map(() => "?").join(",")})`, vals);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error && /UNIQUE/i.test(e.message) ? "نامک (slug) تکراری است" : e instanceof Error ? e.message : "خطا";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
