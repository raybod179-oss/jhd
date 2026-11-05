import Link from "next/link";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";

export function Header() {
  return (
    <header className="site">
      <div className="wrap hrow">
        <Link href="/" className="logo" aria-label={SITE.name}>
          <span className="mark">🛒</span>
          {SITE.name}
        </Link>
        <form className="search" action="/search" role="search">
          <input name="q" type="search" placeholder="جستجوی محصول…" aria-label="جستجو" maxLength={80} />
          <button type="submit">جستجو</button>
        </form>
        <nav className="main" aria-label="منوی اصلی">
          <Link href="/products">محصولات</Link>
          <Link href="/blog">وبلاگ</Link>
          <Link href="/writers">نویسندگان</Link>
          <Link href="/advertise">تبلیغات</Link>
        </nav>
        <CartLink />
      </div>
    </header>
  );
}
