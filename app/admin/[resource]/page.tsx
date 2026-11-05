import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getResource } from "@/lib/crud";
import { q } from "@/lib/db";
import { Crud } from "./Crud";

export const dynamic = "force-dynamic";

export default async function AdminResource({ params }: { params: Promise<{ resource: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const res = getResource((await params).resource);
  if (!res) notFound();
  const [rows, cats, auths] = await Promise.all([
    q(`SELECT * FROM ${res.table} ORDER BY ${res.order} LIMIT 500`),
    q<{ id: number; name: string }>("SELECT id,name FROM categories ORDER BY sort,id"),
    q<{ id: number; name: string }>("SELECT id,name FROM authors ORDER BY id"),
  ]);
  const fields = res.fields.map((f) =>
    f.optionsFrom ? { ...f, options: [{ value: "", label: "—" }, ...(f.optionsFrom === "categories" ? cats : auths).map((o) => ({ value: String(o.id), label: o.name }))] } : f
  );
  return <Crud resource={{ key: res.key, title: res.title, idCol: res.idCol, canCreate: res.canCreate, canDelete: res.canDelete, fields }} rows={rows as Record<string, unknown>[]} />;
}
