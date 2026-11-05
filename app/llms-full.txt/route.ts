import { SITE } from "@/lib/site";
import { posts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const bs = await posts(100);
  const out = [`# ${SITE.name} — متن کامل مقالات`, ``, ...bs.flatMap((b) => [`## ${b.title}`, `آدرس: ${SITE.url}/blog/${b.slug}`, b.excerpt, b.content, ``])];
  return new Response(out.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
