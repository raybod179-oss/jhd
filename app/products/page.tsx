import type { Metadata } from "next";
import Link from "next/link";
import { allProducts, categories } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AdSlot } from "@/components/AdSlot";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "همه‌ی محصولات",
  description: "فهرست کامل محصولات نمایشی فروشگاه آزمایشی خرید چی؛ موبایل، لپ‌تاپ، لوازم خانگی، مد و بیشتر.",
  alternates: { canonical: "/products" },
};

export default async function Products() {
  const [ps, cats] = await Promise.all([allProducts(), categories()]);
  return (
    <>
      <h1 style={{ marginTop: 24 }}>همه‌ی محصولات</h1>
      <div className="chips">{cats.map((c) => <Link key={c.id} className="chip" href={`/category/${c.slug}`}>{c.emoji} {c.name}</Link>)}</div>
      <div className="two">
        <div className="grid">{ps.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        <aside><AdSlot slot="sidebar" /></aside>
      </div>
    </>
  );
}
