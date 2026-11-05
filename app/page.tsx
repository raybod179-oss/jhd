import Link from "next/link";
import type { Metadata } from "next";
import { categories, featured, latest, posts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { AdSlot } from "@/components/AdSlot";
import { FAQ, SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { jdate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | فروشگاه اینترنتی آزمایشی با تجربه‌ی خرید کامل` },
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [cats, feat, last, ps] = await Promise.all([categories(), featured(8), latest(8), posts(3)]);
  return (
    <>
      <section className="hero">
        <h1>خرید چی؛ تجربه‌ی خرید آنلاین، بدون هزینه و بدون دردسر</h1>
        <p>فروشگاهی کامل با دسته‌بندی، وبلاگ، نویسندگان و پنل مدیریت. بدون ثبت‌نام و بدون کد تأیید، هر چیزی را «بخرید» — چون این یک نسخه‌ی آزمایشی است!</p>
        <p><Link href="/products" className="btn">مشاهده‌ی محصولات</Link></p>
        <div className="emojis" aria-hidden>🛒📱💻</div>
      </section>
      <div className="notice">🧪 پروژه‌ی تستی: پرداختی انجام نمی‌شود و کالایی ارسال نخواهد شد.</div>
      <div className="chips">
        {cats.map((c) => <Link key={c.id} href={`/category/${c.slug}`} className="chip">{c.emoji} {c.name}</Link>)}
      </div>
      <section className="sec">
        <h2>محصولات ویژه <Link href="/products">همه‌ی محصولات ←</Link></h2>
        <div className="grid">{feat.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <AdSlot slot="mobile_view" className="ad-m" />
      <section className="sec">
        <h2>جدیدترین محصولات</h2>
        <div className="grid">{last.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section className="sec">
        <h2>چرا خرید چی؟</h2>
        <div className="grid">
          {[["⚡", "سریع و سبک", "بهینه برای موبایل و موتورهای جستجو"], ["🔒", "امن", "هدرهای امنیتی، محدودیت درخواست و اعتبارسنجی سمت سرور"], ["🧪", "بدون پرداخت", "ثبت سفارش بدون درگاه و بدون کد تأیید"], ["🤖", "قابل‌فهم برای هوش مصنوعی", "ساختار داده، llms.txt و پاسخ‌های کوتاه"]].map(([i, t, d]) => (
            <div key={t} className="box"><div style={{ fontSize: "2rem" }}>{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="sec">
        <h2>تازه‌ترین مطالب وبلاگ <Link href="/blog">همه‌ی مطالب ←</Link></h2>
        <div className="grid">
          {ps.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card pcard">
              <div className="pbody"><h3>{p.title}</h3><p className="muted">{p.excerpt}</p><small className="muted">{p.author_name} · {jdate(p.created_at)}</small></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="sec box">
        <h2>پرسش‌های پرتکرار</h2>
        {FAQ.slice(0, 4).map((f) => (<details key={f.q}><summary><b>{f.q}</b></summary><p>{f.a}</p></details>))}
        <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      </section>
    </>
  );
}
