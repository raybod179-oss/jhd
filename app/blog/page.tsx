import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/queries";
import { jdate, readingMinutes } from "@/lib/format";
import { AdSlot } from "@/components/AdSlot";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "وبلاگ",
  description: "مقاله‌ها و راهنمای خرید، سئو، تبلیغات و کسب‌وکار آنلاین در وبلاگ خرید چی.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const ps = await posts();
  return (
    <>
      <h1 style={{ marginTop: 24 }}>وبلاگ خرید چی</h1>
      <div className="two">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
          {ps.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card pcard">
              <div className="pbody">
                <h2 style={{ fontSize: "1.1rem" }}>{p.title}</h2>
                <p className="muted">{p.excerpt}</p>
                <small className="muted" style={{ marginTop: "auto" }}>{p.author_name} · {jdate(p.created_at)} · {readingMinutes(p.content).toLocaleString("fa-IR")} دقیقه</small>
              </div>
            </Link>
          ))}
        </div>
        <aside><AdSlot slot="sidebar" /></aside>
      </div>
    </>
  );
}
