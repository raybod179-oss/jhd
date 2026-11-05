"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCart({ p }: { p: { id: number; slug: string; name: string; price: number; emoji: string } }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn"
      onClick={() => { add(p); setDone(true); setTimeout(() => setDone(false), 1500); }}
    >
      {done ? "✓ به سبد اضافه شد" : "افزودن به سبد خرید"}
    </button>
  );
}
