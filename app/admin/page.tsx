import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { one, q } from "@/lib/db";
import { toman, num } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const n = async (t: string) => Number((await one<{ n: number }>(`SELECT COUNT(*) AS n FROM ${t}`))?.n ?? 0);
  const [products, posts, orders, msgs, sales, recent] = await Promise.all([
    n("products"), n("posts"), n("orders"), n("messages"),
    one<{ s: number }>("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE status<>'cancelled'"),
    q<{ code: string; name: string; total: number; status: string; created_at: string }>("SELECT code,name,total,status,created_at FROM orders ORDER BY id DESC LIMIT 8"),
  ]);
  return (
    <>
      <h1>داشبورد</h1>
      <div className="stats">
        <div className="stat"><b>{num(products)}</b>محصول</div>
        <div className="stat"><b>{num(posts)}</b>مطلب وبلاگ</div>
        <div className="stat"><b>{num(orders)}</b>سفارش آزمایشی</div>
        <div className="stat"><b>{num(msgs)}</b>پیام و درخواست</div>
        <div className="stat"><b style={{ fontSize: "1.1rem" }}>{toman(sales?.s ?? 0)}</b>جمع فروش نمایشی</div>
      </div>
      <h2 style={{ marginTop: 24 }}>آخرین سفارش‌ها</h2>
      <div className="box overflow"><table className="t"><thead><tr><th>کد</th><th>نام</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
        <tbody>{recent.map((o) => <tr key={o.code}><td>{o.code}</td><td>{o.name}</td><td>{toman(o.total)}</td><td>{o.status}</td></tr>)}</tbody></table></div>
    </>
  );
}
