import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "تماس با ما", description: `راه‌های ارتباط با ${SITE.name}`, alternates: { canonical: "/contact" } };
export default function Contact() {
  return (
    <div className="box" style={{ margin: "24px 0", maxWidth: 640 }}>
      <h1>تماس با ما</h1>
      {SITE.email && <p>ایمیل: {SITE.email}</p>}
      <ContactForm kind="contact" placeholder="پیام خود را بنویسید…" />
    </div>
  );
}
