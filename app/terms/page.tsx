import type { Metadata } from "next";
export const metadata: Metadata = { title: "قوانین و مقررات", alternates: { canonical: "/terms" } };
export default function Terms() {
  return (
    <div className="box prose" style={{ margin: "24px 0" }}>
      <h1>قوانین و مقررات</h1>
      <div className="notice">این سایت یک پروژه‌ی آزمایشی است.</div>
      <h2>۱. ماهیت سایت</h2><p>خرید چی صرفاً دمو است؛ سفارش‌ها واقعی نیستند.</p>
      <h2>۲. اطلاعات کاربران</h2><p>لطفاً اطلاعات شخصی واقعی و حساس (کارت، رمز، کد ملی) وارد نکنید.</p>
      <h2>۳. محتوا و تبلیغات</h2><p>تبلیغات با برچسب «تبلیغ» نمایش داده می‌شوند و مسئولیت آن‌ها با آگهی‌دهنده است.</p>
      <h2>۴. تغییرات</h2><p>این قوانین ممکن است هر زمان تغییر کنند.</p>
    </div>
  );
}
