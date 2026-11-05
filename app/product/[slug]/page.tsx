import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productBySlug, related } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbLd } from "@/lib/jsonld";
import { toman } from "@/lib/format";
import { AdSlot } from "@/components/AdSlot";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await productBySlug(decodeURIComponent((await params).slug));
  if (!p) return {};
  const desc = `${p.name} با قیمت نمایشی ${toman(p.price)} در فروشگاه آزمایشی خرید چی. ${p.description}`.slice(0, 200);
  return { title: p.name, description: desc, alternates: { canonical: `/product/${p.slug}` }, openGraph: { title: p.name, description: desc, type: "website", url: `/product/${p.slug}` } };
}

export default async function ProductPage({ params }: P) {
  const p = await productBySlug(decodeURIComponent((await params).slug));
  if (!p) notFound();
  const rel = await related(p.category_id, p.id);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: String(p.id),
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    category: p.category_name,
    url: abs(`/product/${p.slug}`),
    offers: {
      "@type": "Offer", priceCurrency: "IRR", price: String(p.price * 10), url: abs(`/product/${p.slug}`),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  return (
    <>
      <JsonLd data={[ld, breadcrumbLd([{ name: "خانه", path: "/" }, ...(p.category_slug ? [{ name: p.category_name!, path: `/category/${p.category_slug}` }] : []), { name: p.name, path: `/product/${p.slug}` }])]} />
      <nav className="crumbs" aria-label="مسیر"><Link href="/">خانه</Link> / {p.category_slug && <><Link href={`/category/${p.category_slug}`}>{p.category_name}</Link> / </>}{p.name}</nav>
      <div className="pd">
        <div className="card pimg" aria-hidden>{p.emoji}</div>
        <div>
          <h1>{p.name}</h1>
          {p.brand && <p className="muted">برند: {p.brand}</p>}
          <div className="qa"><b>پاسخ کوتاه:</b> {p.name} در این فروشگاه آزمایشی با قیمت نمایشی {toman(p.price)} عرضه شده است؛ خرید آن واقعی نیست و کالایی ارسال نمی‌شود.</div>
          <p style={{ fontSize: "1.6rem", fontWeight: 800 }}>{toman(p.price)} {p.old_price > p.price && <span className="old">{toman(p.old_price)}</span>}</p>
          <p>{p.description}</p>
          <p><AddToCart p={{ id: p.id, slug: p.slug, name: p.name, price: p.price, emoji: p.emoji }} /></p>
          <div className="notice">🧪 این محصول نمایشی است و پرداخت و ارسال واقعی ندارد.</div>
        </div>
      </div>
      <AdSlot slot="mobile_view" className="ad-m" />
      {rel.length > 0 && <section className="sec"><h2>محصولات مرتبط</h2><div className="grid">{rel.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </>
  );
}
