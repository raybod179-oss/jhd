import type { Metadata } from "next";
import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "جستجو", robots: { index: false, follow: true } };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const term = ((await searchParams).q || "").trim().slice(0, 80);
  const ps = term.length >= 2 ? await searchProducts(term) : [];
  return (
    <>
      <h1 style={{ marginTop: 24 }}>نتایج جستجو{term && <>: «{term}»</>}</h1>
      {ps.length ? <div className="grid">{ps.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">{term.length >= 2 ? "نتیجه‌ای پیدا نشد." : "حداقل دو حرف وارد کنید."}</p>}
    </>
  );
}
