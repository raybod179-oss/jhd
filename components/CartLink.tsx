"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="cartlink">
      🛒 سبد خرید{count > 0 && <b>{count.toLocaleString("fa-IR")}</b>}
    </Link>
  );
}
