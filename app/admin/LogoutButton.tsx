"use client";
export function LogoutButton() {
  return (
    <button className="btn small danger" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); location.href = "/admin/login"; }}>
      خروج
    </button>
  );
}
