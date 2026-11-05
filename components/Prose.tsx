// رندر امن متن ساده: خطوط ## به h2 تبدیل می‌شوند؛ همه‌چیز escape می‌شود (بدون dangerouslySetInnerHTML)
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{1,}/).map((l) => l.trim()).filter(Boolean);
  return (
    <div className="prose">
      {blocks.map((b, i) => (b.startsWith("## ") ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>))}
    </div>
  );
}
