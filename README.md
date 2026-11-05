# خرید چی (Kharidchi)

فروشگاه آزمایشی با **Next.js (App Router) + TypeScript** و بک‌اند **Node.js** (Route Handlers) و دیتابیس **libSQL/Turso** (یا SQLite موقت).

## اجرای محلی
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```
ورود ادمین در حالت dev: `admin` / `admin12345` → `/admin/login`

## انتشار رایگان روی Netlify
1. پروژه را در GitHub بگذارید و در Netlify «Import from Git» کنید (build: `npm run build`، افزونه‌ی Next.js خودکار است).
2. در Netlify → Site configuration → Environment variables این‌ها را ست کنید:
   - `NEXT_PUBLIC_SITE_URL` (آدرس نهایی)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD` (رمز طولانی)، `SESSION_SECRET` (حداقل ۳۲ کاراکتر تصادفی)
   - برای دیتابیس **دائمی**: `TURSO_DATABASE_URL` و `TURSO_AUTH_TOKEN` (turso.tech، پلن رایگان)
3. دیپلوی کنید. بدون Turso، دیتابیس روی `/tmp` است و با هر cold start به داده‌ی نمونه برمی‌گردد.
4. در Google Search Console سایت را اضافه و `https://YOUR-SITE/sitemap.xml` را ثبت کنید.

## امنیت
CSP و هدرهای امنیتی، HSTS، کوکی ادمین HttpOnly/SameSite=Strict، JWT، بررسی Origin، محدودیت نرخ، honeypot، اعتبارسنجی zod، whitelist ستون‌ها در CRUD، کوئری‌های پارامتری، محاسبه‌ی قیمت فقط در سرور، رندر متن بدون HTML خام.

## سئو / SXO / AEO / GEO / AIO
metadata و canonical، JSON-LD (Organization, WebSite+SearchAction, Product, Article, Person, FAQPage, BreadcrumbList)، sitemap پویا، robots با اجازه‌ی صریح به خزنده‌های هوش مصنوعی، `/llms.txt` و `/llms-full.txt`، بلوک «پاسخ کوتاه/خلاصه» در محصول و مقاله، speakable، manifest، فونت self-hosted.

## فاوآیکون
`app/icon.svg` موقت است. با پرامپت `docs/prompt-favicon-chatgpt.txt` طرح نهایی بسازید و فایل‌ها (`icon.png`, `apple-icon.png`, `favicon.ico`) را در پوشه‌ی `app/` بگذارید.
