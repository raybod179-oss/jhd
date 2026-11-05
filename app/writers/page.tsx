import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "نویسندگان", description: "نویسندگان وبلاگ خرید چی را بشناسید.", alternates: { canonical: "/writers" } };

export default async function Writers() {
  const as = await authors();
  return (
    <>
      <h1 style={{ marginTop: 24 }}>نویسندگان</h1>
      <div className="grid">
        {as.map((a) => (
          <Link key={a.id} href={`/writers/${a.id}`} className="card pcard">
            <div className="pimg" style={{ aspectRatio: "2/1" }}>{a.emoji}</div>
            <div className="pbody"><h3>{a.name}</h3><span className="muted">{a.role}</span><p>{a.bio}</p></div>
          </Link>
        ))}
      </div>
      <p className="box" style={{ marginTop: 24 }}>می‌خواهید در وبلاگ بنویسید؟ از <Link href="/contact" style={{ color: "var(--brand)" }}>تماس با ما</Link> پیام بدهید.</p>
    </>
  );
}
