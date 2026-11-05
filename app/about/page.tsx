import type { Metadata } from "next";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "درباره ما", description: `درباره‌ی ${SITE.name}؛ فروشگاه اینترنتی آزمایشی.`, alternates: { canonical: "/about" } };
export default function About() {
  return (
    <div className="box prose" style={{ margin: "24px 0" }}>
      <h1>درباره‌ی {SITE.name}</h1>
      <div className="qa"><b>خلاصه:</b> {SITE.name} یک فروشگاه اینترنتی آزمایشی (دمو) است که برای تست تجربه‌ی خرید، وبلاگ، نویسندگان و تبلیغات ساخته شده است.</div>
      <p>در این سایت هیچ پرداخت واقعی انجام نمی‌شود و هیچ کالایی ارسال نخواهد شد. همه‌ی محصولات و قیمت‌ها نمایشی‌اند.</p>
      <h2>امکانات</h2>
      <p>دسته‌بندی محصولات، سبد خرید، ثبت سفارش بدون کد تأیید، وبلاگ، نویسندگان، جایگاه‌های تبلیغاتی و پنل مدیریت.</p>
    </div>
  );
}
