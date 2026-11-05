import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { byCategory, categoryBySlug } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = await categoryBySlug(decodeURIComponent((await params).slug));
  if (!c) return {};
  return { title: `خرید ${c.name}`, description: `${c.description || c.name} — محصولات نمایشی دسته‌ی ${c.name} در خرید چی.`, alternates: { canonical: `/category/${c.slug}` } };
}

export default async function Category({ params }: P) {
  const c = await categoryBySlug(decodeURIComponent((await params).slug));
  if (!c) notFound();
  const ps = await byCategory(c.id);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "خانه", path: "/" }, { name: c.name, path: `/category/${c.slug}` }])} />
      <nav className="crumbs" aria-label="مسیر"><Link href="/">خانه</Link> / {c.name}</nav>
      <h1>{c.emoji} {c.name}</h1>
      <p className="muted">{c.description}</p>
      <div className="two">
        {ps.length ? <div className="grid">{ps.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>محصولی در این دسته نیست.</p>}
        <aside><AdSlot slot="sidebar" /></aside>
      </div>
    </>
  );
}
