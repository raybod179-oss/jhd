import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authorById, postsByAuthor } from "@/lib/queries";
import { JsonLd } from "@/components/JsonLd";
import { abs } from "@/lib/jsonld";
import { jdate } from "@/lib/format";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const a = await authorById(Number((await params).id));
  if (!a) return {};
  return { title: `${a.name} — نویسنده`, description: a.bio.slice(0, 160), alternates: { canonical: `/writers/${a.id}` } };
}

export default async function Writer({ params }: P) {
  const id = Number((await params).id);
  const a = Number.isInteger(id) ? await authorById(id) : null;
  if (!a) notFound();
  const ps = await postsByAuthor(a.id);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: a.name, jobTitle: a.role, description: a.bio, url: abs(`/writers/${a.id}`) }} />
      <div className="box" style={{ margin: "24px 0" }}>
        <div style={{ fontSize: "3rem" }}>{a.emoji}</div>
        <h1>{a.name}</h1><p className="muted">{a.role}</p><p>{a.bio}</p>
      </div>
      <h2>مطالب {a.name}</h2>
      {ps.map((p) => <p key={p.id}><Link href={`/blog/${p.slug}`}>{p.title}</Link> <small className="muted">· {jdate(p.created_at)}</small></p>)}
    </>
  );
}
