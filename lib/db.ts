import "server-only";
import { createClient, type Client, type InValue } from "@libsql/client";
import { seed } from "./seed";

let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  } else {
    // بدون Turso: روی نتلیفای فقط /tmp قابل نوشتن است (موقت؛ با هر cold start دوباره seed می‌شود)
    const file = process.env.NODE_ENV === "production" ? "file:/tmp/kharidchi.db" : "file:./kharidchi.db";
    client = createClient({ url: file });
  }
  return client;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories(
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  description TEXT DEFAULT '', emoji TEXT DEFAULT '🛍️', sort INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  description TEXT DEFAULT '', price INTEGER NOT NULL, old_price INTEGER DEFAULT 0,
  category_id INTEGER, brand TEXT DEFAULT '', emoji TEXT DEFAULT '📦', stock INTEGER DEFAULT 10,
  featured INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS authors(
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT DEFAULT '', bio TEXT DEFAULT '',
  emoji TEXT DEFAULT '✍️', active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
  excerpt TEXT DEFAULT '', content TEXT DEFAULT '', author_id INTEGER, tags TEXT DEFAULT '',
  published INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL,
  address TEXT NOT NULL, note TEXT DEFAULT '', total INTEGER NOT NULL, status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS order_items(
  id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER, name TEXT NOT NULL,
  price INTEGER NOT NULL, qty INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS ad_slots(
  key TEXT PRIMARY KEY, label TEXT NOT NULL, image_url TEXT DEFAULT '', link_url TEXT DEFAULT '',
  text TEXT DEFAULT '', active INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT DEFAULT 'contact', name TEXT NOT NULL, phone TEXT DEFAULT '',
  email TEXT DEFAULT '', body TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_pub ON posts(published, created_at);
`;

async function init(): Promise<void> {
  const c = getClient();
  await c.executeMultiple(SCHEMA);
  const r = await c.execute("SELECT COUNT(*) AS n FROM categories");
  if (Number(r.rows[0][0]) === 0) await seed(c);
}

export async function ready_(): Promise<Client> {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  await ready;
  return getClient();
}

export async function q<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const c = await ready_();
  const r = await c.execute({ sql, args });
  return r.rows.map((row) => Object.fromEntries(r.columns.map((col, i) => [col, row[i]]))) as T[];
}

export async function one<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T | null> {
  return (await q<T>(sql, args))[0] ?? null;
}

export async function run(sql: string, args: InValue[] = []) {
  const c = await ready_();
  return c.execute({ sql, args });
}

export async function batch(stmts: { sql: string; args?: InValue[] }[]) {
  const c = await ready_();
  return c.batch(stmts.map((s) => ({ sql: s.sql, args: s.args ?? [] })), "write");
}

// ----- انواع -----
export type Category = { id: number; slug: string; name: string; description: string; emoji: string; sort: number };
export type Product = {
  id: number; slug: string; name: string; description: string; price: number; old_price: number;
  category_id: number | null; brand: string; emoji: string; stock: number; featured: number; active: number;
  created_at: string; category_name?: string; category_slug?: string;
};
export type Author = { id: number; name: string; role: string; bio: string; emoji: string; active: number };
export type Post = {
  id: number; slug: string; title: string; excerpt: string; content: string; author_id: number | null;
  tags: string; published: number; created_at: string; author_name?: string;
};
export type AdSlotRow = { key: string; label: string; image_url: string; link_url: string; text: string; active: number };
