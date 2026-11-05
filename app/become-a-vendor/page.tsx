import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: `در ${SITE.name} بفروشید`, description: "درخواست همکاری به عنوان فروشنده (نسخه‌ی آزمایشی).", alternates: { canonical: "/become-a-vendor" } };
export default function Vendor() {
  return (
    <div className="box" style={{ margin: "24px 0", maxWidth: 640 }}>
      <h1>🏪 در {SITE.name} بفروشید</h1>
      <p className="muted">فرم درخواست فروشندگی. این نسخه آزمایشی است و درخواست‌ها فقط در پنل ادمین ثبت می‌شوند.</p>
      <ContactForm kind="vendor" placeholder="نام فروشگاه، نوع کالا و توضیحات…" button="ارسال درخواست" />
    </div>
  );
}
