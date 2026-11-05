import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postBySlug, posts } from "@/lib/queries";
import { jdate, parseDate, readingMinutes } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/Prose";
import { AdSlot } from "@/components/AdSlot";
import { abs, breadcrumbLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await postBySlug(decodeURIComponent((await params).slug));
  if (!p) return {};
  return {
    title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: parseDate(p.created_at).toISOString(), authors: p.author_name ? [p.author_name] : undefined },
  };
}

export default async function Post({ params }: P) {
  const p = await postBySlug(decodeURIComponent((await params).slug));
  if (!p) notFound();
  const more = (await posts(4)).filter((x) => x.id !== p.id).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, inLanguage: "fa-IR",
    datePublished: parseDate(p.created_at).toISOString(), dateModified: parseDate(p.created_at).toISOString(),
    mainEntityOfPage: abs(`/blog/${p.slug}`),
    author: p.author_id ? { "@type": "Person", name: p.author_name, url: abs(`/writers/${p.author_id}`) } : { "@type": "Organization", name: SITE.name },
    publisher: { "@id": abs("/#org") },
    keywords: p.tags,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".qa", "h1"] },
  };
  return (
    <>
      <JsonLd data={[ld, breadcrumbLd([{ name: "خانه", path: "/" }, { name: "وبلاگ", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }])]} />
      <nav className="crumbs" aria-label="مسیر"><Link href="/">خانه</Link> / <Link href="/blog">وبلاگ</Link> / {p.title}</nav>
      <div className="two">
        <article className="box">
          <h1>{p.title}</h1>
          <p className="muted">
            {p.author_id ? <Link href={`/writers/${p.author_id}`}>{p.author_name}</Link> : SITE.name} · <time dateTime={parseDate(p.created_at).toISOString()}>{jdate(p.created_at)}</time> · {readingMinutes(p.content).toLocaleString("fa-IR")} دقیقه مطالعه
          </p>
          <div className="qa"><b>خلاصه:</b> {p.excerpt}</div>
          <Prose text={p.content} />
          <AdSlot slot="end_of_article" />
          {p.tags && <p>{p.tags.split(",").map((t) => <span key={t} className="chip" style={{ marginLeft: 6 }}>#{t.trim()}</span>)}</p>}
        </article>
        <aside><AdSlot slot="sidebar" />
          <div className="box"><h3>مطالب بیشتر</h3>{more.map((m) => <p key={m.id}><Link href={`/blog/${m.slug}`}>{m.title}</Link></p>)}</div>
        </aside>
      </div>
    </>
  );
}
