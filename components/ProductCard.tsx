import Link from "next/link";
import type { Product } from "@/lib/db";
import { toman, num } from "@/lib/format";

export function ProductCard({ p }: { p: Product }) {
  const off = p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
  return (
    <Link href={`/product/${p.slug}`} className="card pcard">
      <div className="pimg" aria-hidden>
        {p.emoji}
        {off > 0 && <span className="badge">{num(off)}٪</span>}
      </div>
      <div className="pbody">
        <h3>{p.name}</h3>
        {p.category_name && <span className="muted" style={{ fontSize: ".8rem" }}>{p.category_name}</span>}
        <div style={{ marginTop: "auto" }}>
          {off > 0 && <span className="old">{toman(p.old_price)}</span>}
          <div className="price">{toman(p.price)}</div>
        </div>
      </div>
    </Link>
  );
}
