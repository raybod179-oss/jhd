import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { orgLd, siteLd } from "@/lib/jsonld";
import { CartProvider } from "@/lib/cart";
import { JsonLd } from "@/components/JsonLd";
import { TestBanner } from "@/components/TestBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | فروشگاه اینترنتی آزمایشی`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fa_IR", siteName: SITE.name, title: SITE.name, description: SITE.description, url: SITE.url },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: SITE.brand, width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <a className="skip" href="#main">پرش به محتوا</a>
        <JsonLd data={[orgLd(), siteLd()]} />
        <CartProvider>
          <TestBanner />
          <AdSlot slot="top_bar" className="topbar-ad" />
          <div className="wrap"><AdSlot slot="top_header_desktop" className="ad-d" /></div>
          <Header />
          <div className="wrap"><AdSlot slot="mobile_header" className="ad-m" /></div>
          <main id="main" className="wrap">{children}</main>
          <Footer />
          <div className="sticky-m"><AdSlot slot="mobile_sticky" /></div>
        </CartProvider>
      </body>
    </html>
  );
}
