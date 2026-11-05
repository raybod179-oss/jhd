import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { allProducts, authors, categories, posts } from "@/lib/queries";
import { parseDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ps, cs, bs, as] = await Promise.all([allProducts(1000), categories(), posts(1000), authors()]);
  const u = (p: string) => SITE.url + p;
  const now = new Date();
  const st = ["", "/products", "/blog", "/writers", "/about", "/contact", "/faq", "/terms", "/advertise", "/become-a-vendor"].map((p) => ({ url: u(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 }));
  return [
    ...st,
    ...cs.map((c) => ({ url: u(`/category/${encodeURI(c.slug)}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...ps.map((p) => ({ url: u(`/product/${encodeURI(p.slug)}`), lastModified: parseDate(p.created_at), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...bs.map((b) => ({ url: u(`/blog/${encodeURI(b.slug)}`), lastModified: parseDate(b.created_at), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...as.map((a) => ({ url: u(`/writers/${a.id}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
