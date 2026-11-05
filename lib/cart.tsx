"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = { id: number; slug: string; name: string; price: number; emoji: string; qty: number };
type Ctx = {
  items: CartItem[]; count: number; total: number;
  add: (p: Omit<CartItem, "qty">) => void; setQty: (id: number, qty: number) => void; remove: (id: number) => void; clear: () => void;
};
const C = createContext<Ctx | null>(null);
const KEY = "kharidchi_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) setItems(raw.filter((i) => i && Number.isInteger(i.id) && i.qty > 0).slice(0, 30));
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);
  const v = useMemo<Ctx>(() => ({
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
    add: (p) => setItems((cur) => {
      const f = cur.find((i) => i.id === p.id);
      return f ? cur.map((i) => (i.id === p.id ? { ...i, qty: Math.min(20, i.qty + 1) } : i)) : [...cur, { ...p, qty: 1 }];
    }),
    setQty: (id, qty) => setItems((cur) => (qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty: Math.min(20, qty) } : i)))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  }), [items]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
export function useCart() {
  const c = useContext(C);
  if (!c) throw new Error("CartProvider missing");
  return c;
}
