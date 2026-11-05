import type { Metadata } from "next";
import { FAQ } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
export const metadata: Metadata = { title: "سوالات متداول", description: "پاسخ پرسش‌های پرتکرار درباره‌ی فروشگاه آزمایشی خرید چی.", alternates: { canonical: "/faq" } };
export default function Faq() {
  return (
    <div className="box" style={{ margin: "24px 0" }}>
      <h1>سوالات متداول</h1>
      {FAQ.map((f) => (<section key={f.q}><h2 style={{ fontSize: "1.1rem" }}>{f.q}</h2><p>{f.a}</p></section>))}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </div>
  );
}
