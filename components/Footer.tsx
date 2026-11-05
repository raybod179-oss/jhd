import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <h4>{SITE.name}</h4>
            <p>فروشگاه اینترنتی «{SITE.name}» یک پروژه‌ی آزمایشی برای تست تجربه‌ی خرید، وبلاگ، نویسندگان و تبلیغات است.</p>
            <p>
              {SITE.telegram && <a href={SITE.telegram} rel="me noopener noreferrer" target="_blank">تلگرام</a>}
              {SITE.instagram && <a href={SITE.instagram} rel="me noopener noreferrer" target="_blank">اینستاگرام</a>}
            </p>
          </div>
          <div>
            <h4>درباره {SITE.name}</h4>
            <Link href="/about">درباره ما</Link>
            <Link href="/blog">وبلاگ</Link>
            <Link href="/writers">نویسندگان</Link>
            <Link href="/advertise">تبلیغات در سایت</Link>
            <Link href="/contact">تماس با ما</Link>
            <Link href="/become-a-vendor">🏪 در {SITE.name} بفروشید</Link>
          </div>
          <div>
            <h4>خدمات مشتریان</h4>
            <Link href="/faq">سوالات متداول</Link>
            <Link href="/terms">قوانین و مقررات</Link>
            <Link href="/llms.txt">llms.txt</Link>
            <Link href="/sitemap.xml">نقشه‌ی سایت</Link>
          </div>
          <div>
            <h4>دسته‌بندی‌ها</h4>
            <Link href="/products">همه‌ی محصولات</Link>
            <Link href="/category/mobile-and-tablet">موبایل و تبلت</Link>
            <Link href="/category/laptop-and-computer">لپ‌تاپ و کامپیوتر</Link>
            <Link href="/category/home-appliance">لوازم خانگی</Link>
          </div>
        </div>
        <p className="legal">
          ⚠️ «{SITE.name}» یک <b>پروژه‌ی تستی</b> است. همه‌ی محصولات و قیمت‌ها نمایشی‌اند، هیچ پرداختی انجام نمی‌شود و هیچ کالایی ارسال نخواهد شد. لطفاً اطلاعات شخصی حساس وارد نکنید.
        </p>
      </div>
    </footer>
  );
}
