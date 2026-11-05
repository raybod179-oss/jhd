import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { RESOURCES } from "@/lib/resources";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = { title: "پنل مدیریت", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  return (
    <div style={{ margin: "16px 0" }}>
      {ok && (
        <nav className="admin-nav" aria-label="منوی مدیریت">
          <Link href="/admin">داشبورد</Link>
          {Object.values(RESOURCES).map((r) => <Link key={r.key} href={`/admin/${r.key}`}>{r.title}</Link>)}
          <LogoutButton />
        </nav>
      )}
      {children}
    </div>
  );
}
