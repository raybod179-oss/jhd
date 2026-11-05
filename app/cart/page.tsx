"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { toman } from "@/lib/format";

export default function CartPage() {
  const { items, total, setQty, remove } = useCart();
  return (
    <>
      <h1 style={{ marginTop: 24 }}>سبد خرید</h1>
      {items.length === 0 ? (
        <div className="box">سبد خرید خالی است. <Link href="/products" style={{ color: "var(--brand)" }}>مشاهده‌ی محصولات</Link></div>
      ) : (
        <div className="two">
          <div className="box overflow">
            <table className="t">
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontSize: "2rem" }}>{i.emoji}</td>
                    <td><Link href={`/product/${i.slug}`}>{i.name}</Link><div className="muted">{toman(i.price)}</div></td>
                    <td>
                      <div className="qty">
                        <button aria-label="کم" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                        <span>{i.qty.toLocaleString("fa-IR")}</span>
                        <button aria-label="زیاد" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                      </div>
                    </td>
                    <td><b>{toman(i.price * i.qty)}</b></td>
                    <td><button className="btn small danger" onClick={() => remove(i.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="box">
            <h3>خلاصه سفارش</h3>
            <p>جمع کل: <b>{toman(total)}</b></p>
            <p className="notice">🧪 پرداختی انجام نمی‌شود.</p>
            <Link href="/checkout" className="btn" style={{ display: "block", textAlign: "center" }}>ادامه و ثبت سفارش آزمایشی</Link>
          </aside>
        </div>
      )}
    </>
  );
}
