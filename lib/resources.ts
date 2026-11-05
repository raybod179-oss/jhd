// تعریف منابع پنل ادمین (جدول‌ها، فیلدها). فقط ستون‌های لیست‌شده قابل نوشتن‌اند.
export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "checkbox" | "select" | "url";
  options?: { value: string; label: string }[];
  optionsFrom?: "categories" | "authors";
  list?: boolean;
  readonly?: boolean;
  required?: boolean;
  max?: number;
};
export type Resource = {
  key: string;
  table: string;
  idCol: string;
  title: string;
  canCreate: boolean;
  canDelete: boolean;
  order: string;
  slugFrom?: string;
  fields: Field[];
};

const ORDER_STATUS = [
  { value: "new", label: "جدید" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال‌شده (نمایشی)" },
  { value: "done", label: "تکمیل" },
  { value: "cancelled", label: "لغو" },
];

export const RESOURCES: Record<string, Resource> = {
  products: {
    key: "products", table: "products", idCol: "id", title: "محصولات", canCreate: true, canDelete: true,
    order: "id DESC", slugFrom: "name",
    fields: [
      { name: "name", label: "نام محصول", type: "text", list: true, required: true, max: 200 },
      { name: "slug", label: "نامک (slug) — خالی = خودکار", type: "text", max: 120 },
      { name: "category_id", label: "دسته‌بندی", type: "select", optionsFrom: "categories", list: true },
      { name: "brand", label: "برند", type: "text", max: 80 },
      { name: "price", label: "قیمت (تومان)", type: "number", list: true, required: true },
      { name: "old_price", label: "قیمت قبل از تخفیف", type: "number" },
      { name: "stock", label: "موجودی", type: "number", list: true },
      { name: "emoji", label: "ایموجی تصویر", type: "text", max: 8 },
      { name: "description", label: "توضیحات", type: "textarea", max: 5000 },
      { name: "featured", label: "ویژه", type: "checkbox" },
      { name: "active", label: "فعال", type: "checkbox", list: true },
    ],
  },
  categories: {
    key: "categories", table: "categories", idCol: "id", title: "دسته‌بندی‌ها", canCreate: true, canDelete: true,
    order: "sort ASC, id ASC", slugFrom: "name",
    fields: [
      { name: "name", label: "نام دسته", type: "text", list: true, required: true, max: 100 },
      { name: "slug", label: "نامک (slug)", type: "text", max: 120 },
      { name: "emoji", label: "ایموجی", type: "text", max: 8 },
      { name: "description", label: "توضیحات", type: "textarea", max: 500 },
      { name: "sort", label: "ترتیب", type: "number", list: true },
    ],
  },
  posts: {
    key: "posts", table: "posts", idCol: "id", title: "مطالب وبلاگ", canCreate: true, canDelete: true,
    order: "id DESC", slugFrom: "title",
    fields: [
      { name: "title", label: "عنوان", type: "text", list: true, required: true, max: 200 },
      { name: "slug", label: "نامک (slug)", type: "text", max: 120 },
      { name: "author_id", label: "نویسنده", type: "select", optionsFrom: "authors", list: true },
      { name: "excerpt", label: "خلاصه (برای سئو و پاسخ هوش مصنوعی)", type: "textarea", max: 400 },
      { name: "content", label: "متن (برای تیتر خط را با ## شروع کنید)", type: "textarea", max: 50000 },
      { name: "tags", label: "برچسب‌ها (با ویرگول)", type: "text", max: 200 },
      { name: "published", label: "منتشر شده", type: "checkbox", list: true },
    ],
  },
  authors: {
    key: "authors", table: "authors", idCol: "id", title: "نویسندگان", canCreate: true, canDelete: true,
    order: "id ASC",
    fields: [
      { name: "name", label: "نام", type: "text", list: true, required: true, max: 100 },
      { name: "role", label: "سمت", type: "text", list: true, max: 100 },
      { name: "emoji", label: "ایموجی آواتار", type: "text", max: 8 },
      { name: "bio", label: "بیوگرافی", type: "textarea", max: 1000 },
      { name: "active", label: "فعال", type: "checkbox", list: true },
    ],
  },
  orders: {
    key: "orders", table: "orders", idCol: "id", title: "سفارش‌ها (آزمایشی)", canCreate: false, canDelete: true,
    order: "id DESC",
    fields: [
      { name: "code", label: "کد سفارش", type: "text", list: true, readonly: true },
      { name: "name", label: "نام", type: "text", list: true, readonly: true },
      { name: "phone", label: "موبایل", type: "text", list: true, readonly: true },
      { name: "address", label: "آدرس", type: "textarea", readonly: true },
      { name: "note", label: "توضیحات", type: "textarea", readonly: true },
      { name: "total", label: "جمع کل", type: "number", list: true, readonly: true },
      { name: "status", label: "وضعیت", type: "select", options: ORDER_STATUS, list: true },
    ],
  },
  ad_slots: {
    key: "ad_slots", table: "ad_slots", idCol: "key", title: "جایگاه‌های تبلیغ", canCreate: false, canDelete: false,
    order: "rowid ASC",
    fields: [
      { name: "label", label: "جایگاه", type: "text", list: true, readonly: true },
      { name: "image_url", label: "آدرس تصویر بنر (https)", type: "url", max: 500 },
      { name: "link_url", label: "لینک مقصد (https)", type: "url", max: 500 },
      { name: "text", label: "متن بنر / آلت تصویر", type: "text", list: true, max: 200 },
      { name: "active", label: "فعال", type: "checkbox", list: true },
    ],
  },
  messages: {
    key: "messages", table: "messages", idCol: "id", title: "پیام‌ها و درخواست‌ها", canCreate: false, canDelete: true,
    order: "id DESC",
    fields: [
      { name: "kind", label: "نوع", type: "text", list: true, readonly: true },
      { name: "name", label: "نام", type: "text", list: true, readonly: true },
      { name: "phone", label: "موبایل", type: "text", readonly: true },
      { name: "email", label: "ایمیل", type: "text", readonly: true },
      { name: "body", label: "متن", type: "textarea", list: true, readonly: true },
    ],
  },
};
