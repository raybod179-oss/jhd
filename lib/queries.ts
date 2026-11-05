import "server-only";
import { q, one, type Product, type Category, type Post, type Author } from "./db";

const PSEL = `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id`;

export const categories = () => q<Category>("SELECT * FROM categories ORDER BY sort, id");
export const featured = (n = 8) => q<Product>(`${PSEL} WHERE p.active=1 AND p.featured=1 ORDER BY p.id DESC LIMIT ?`, [n]);
export const latest = (n = 8) => q<Product>(`${PSEL} WHERE p.active=1 ORDER BY p.id DESC LIMIT ?`, [n]);
export const allProducts = (n = 100) => q<Product>(`${PSEL} WHERE p.active=1 ORDER BY p.id DESC LIMIT ?`, [n]);
export const byCategory = (id: number) => q<Product>(`${PSEL} WHERE p.active=1 AND p.category_id=? ORDER BY p.id DESC`, [id]);
export const productBySlug = (slug: string) => one<Product>(`${PSEL} WHERE p.active=1 AND p.slug=?`, [slug]);
export const related = (cat: number | null, id: number) => q<Product>(`${PSEL} WHERE p.active=1 AND p.category_id IS ? AND p.id<>? LIMIT 4`, [cat, id]);
export const searchProducts = (term: string) => {
  const like = `%${term.replace(/[%_]/g, "")}%`;
  return q<Product>(`${PSEL} WHERE p.active=1 AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?) LIMIT 40`, [like, like, like]);
};
export const categoryBySlug = (slug: string) => one<Category>("SELECT * FROM categories WHERE slug=?", [slug]);

const POSEL = `SELECT po.*, a.name AS author_name FROM posts po LEFT JOIN authors a ON a.id=po.author_id`;
export const posts = (n = 50) => q<Post>(`${POSEL} WHERE po.published=1 ORDER BY po.id DESC LIMIT ?`, [n]);
export const postBySlug = (slug: string) => one<Post>(`${POSEL} WHERE po.published=1 AND po.slug=?`, [slug]);
export const postsByAuthor = (id: number) => q<Post>(`${POSEL} WHERE po.published=1 AND po.author_id=? ORDER BY po.id DESC`, [id]);
export const authors = () => q<Author>("SELECT * FROM authors WHERE active=1 ORDER BY id");
export const authorById = (id: number) => one<Author>("SELECT * FROM authors WHERE active=1 AND id=?", [id]);
