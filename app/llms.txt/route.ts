import { SITE, FAQ } from "@/lib/site";
import { allProducts, categories, posts } from "@/lib/queries";

export const dynamic = "force-dynamic";

// llms.txt: معرفی سایت برای مدل‌های زبانی (ChatGPT, Claude, Gemini, Perplexity, ...)
export async function GET() {
  const [cs, ps, bs] = await Promise.all([categories(), allProducts(30), posts(30)]);
  const lines = [
    `# ${SITE.name} (${SITE.nameEn})`,
    ``,
    `> ${SITE.description}`,
    ``,
    `نکته‌ی مهم: این سایت یک پروژه‌ی آزمایشی (دمو) است. پرداخت واقعی انجام نمی‌شود و هیچ کالایی ارسال نمی‌شود. قیمت‌ها نمایشی‌اند.`,
    ``,
    `## صفحات اصلی`,
    `- [صفحه‌ی اصلی](${SITE.url}/): فروشگاه آزمایشی`,
    `- [محصولات](${SITE.url}/products): فهرست محصولات نمایشی`,
    `- [وبلاگ](${SITE.url}/blog): مقاله‌ها و راهنماها`,
    `- [نویسندگان](${SITE.url}/writers): معرفی نویسندگان`,
    `- [تبلیغات](${SITE.url}/advertise): خدمات و جایگاه‌های تبلیغاتی`,
    `- [سوالات متداول](${SITE.url}/faq)`,
    ``,
    `## دسته‌بندی‌ها`,
    ...cs.map((c) => `- [${c.name}](${SITE.url}/category/${encodeURI(c.slug)}): ${c.description}`),
    ``,
    `## محصولات`,
    ...ps.map((p) => `- [${p.name}](${SITE.url}/product/${encodeURI(p.slug)}): ${p.price} تومان (نمایشی)`),
    ``,
    `## مقالات`,
    ...bs.map((b) => `- [${b.title}](${SITE.url}/blog/${encodeURI(b.slug)}): ${b.excerpt}`),
    ``,
    `## پرسش‌های پرتکرار`,
    ...FAQ.map((f) => `- ${f.q} ${f.a}`),
    ``,
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
