import { connection } from "next/server";
import { one, type AdSlotRow } from "@/lib/db";

export async function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  await connection(); // رندر در زمان درخواست؛ دسترسی به دیتابیس هنگام build ممنوع
  const s = await one<AdSlotRow>("SELECT * FROM ad_slots WHERE key=? AND active=1", [slot]).catch(() => null);
  if (!s || (!s.image_url && !s.text)) return null;
  const inner = s.image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={s.image_url} alt={s.text || "تبلیغ"} loading="lazy" />
  ) : (
    <span>{s.text}</span>
  );
  const cls = `ad ${className}`;
  return s.link_url ? (
    <a className={cls} href={s.link_url} target="_blank" rel="sponsored nofollow noopener noreferrer" data-slot={slot}>
      {inner}
      <small>تبلیغ</small>
    </a>
  ) : (
    <div className={cls} data-slot={slot}>{inner}<small>تبلیغ</small></div>
  );
}
