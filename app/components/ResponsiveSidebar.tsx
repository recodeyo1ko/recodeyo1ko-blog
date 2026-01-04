"use client";

import { useEffect, useState } from "react";

export default function ResponsiveSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // md以上にリサイズされたらドロワーを閉じる（状態事故防止）
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* ===================== */}
      {/* Mobile: top menu bar */}
      {/* ===================== */}
      <div className="md:hidden sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur px-4 py-2">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/[0.05]"
        >
          メニュー
        </button>
      </div>

      {/* ===================== */}
      {/* Mobile: overlay */}
      {/* ===================== */}
      {open && (
        <button
          aria-label="close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* ===================== */}
      {/* Mobile: drawer sidebar */}
      {/* ===================== */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 md:hidden",
          "w-[78vw] max-w-[320px]",
          "border-r border-white/10 bg-zinc-950/85 backdrop-blur",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="h-full overflow-y-auto p-3">
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/[0.05]"
            >
              閉じる
            </button>
          </div>
          {children}
        </div>
      </aside>

      {/* ===================== */}
      {/* Tablet & Desktop */}
      {/* 常設サイドバー */}
      {/* ===================== */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-white/10 bg-zinc-900/60">
        <div className="h-[100dvh] overflow-y-auto">{children}</div>
      </aside>
    </>
  );
}
