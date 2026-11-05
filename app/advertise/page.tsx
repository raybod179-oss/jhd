import type { Metadata } from "next";
import { AD_SERVICES, AD_SLOTS, SITE } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
export const metadata: Metadata = { title: "تبلیغات در سایت", description: `خدمات تبلیغاتی ${SITE.name}: بنر، ریپورتاژ، محتوای متنی و ویدیویی و شبکه‌های اجتماعی.`, alternates: { canonical: "/advertise" } };
export default function Advertise() {
  return (
    <div style={{ margin: "24px 0" }}>
      <h1>تبلیغات در {SITE.name}</h1>
      <div className="two">
        <div>
          <div className="box"><h2>جایگاه‌های بنر</h2><ul>{Object.values(AD_SLOTS).map((l) => <li key={l}>{l}</li>)}</ul></div>
          <h2 style={{ marginTop: 24 }}>خدمات تبلیغاتی</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
            {Object.entries(AD_SERVICES).map(([g, items]) => (
              <div key={g} className="box"><h3>{g}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
            ))}
          </div>
        </div>
        <aside className="box"><h3>ثبت درخواست تبلیغ</h3><ContactForm kind="advertise" placeholder="نوع خدمت، بودجه و توضیحات…" button="ارسال درخواست" /></aside>
      </div>
    </div>
  );
}
