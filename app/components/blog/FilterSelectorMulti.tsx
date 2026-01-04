"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "or" | "and";

type Item = {
  id?: string;
  name: string;
};

export default function FilterSelectorMulti({
  label, // "カテゴリ" / "技術タグ"
  items,
  selected,
  counts,
  totalCount,
  mode,
  modeEnabled = false, // カテゴリは false, タグは true
  onChangeSelected,
  onChangeMode,
  widthClass = "w-full max-w-[420px] lg:max-w-[560px]",
}: {
  label: string;
  items: Item[];
  selected: string[];
  counts: Record<string, number>;
  totalCount: number;
  mode: Mode;
  modeEnabled?: boolean;
  onChangeSelected: (next: string[]) => void;
  onChangeMode?: (next: Mode) => void;
  widthClass?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // ローカル編集（Applyまで親を変えない）
  const [local, setLocal] = useState<string[]>(selected);
  const [localMode, setLocalMode] = useState<Mode>(mode);

  useEffect(() => setLocal(selected), [selected]);
  useEffect(() => setLocalMode(mode), [mode]);

  // 外クリックで閉じる（lg以上の dropdown 用にも効く）
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escで閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const selectedSet = useMemo(() => new Set(local), [local]);

  const toggle = (name: string) => {
    setLocal((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const apply = () => {
    onChangeSelected(local);
    if (modeEnabled && onChangeMode) onChangeMode(localMode);
    setOpen(false);
  };

  const clear = () => {
    setLocal([]);
    onChangeSelected([]);
    setOpen(false);
  };

  const labelText = selected.length === 0 ? "指定なし" : selected.join(" / ");

  return (
    <div ref={ref} className="relative min-w-0">
      {/* トリガ */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex w-full min-w-0 items-center gap-1.5",
          "h-7 rounded-md px-2",
          "border border-white/10 bg-white/[0.02]",
          "text-[11px] font-medium text-zinc-300",
          "hover:bg-white/[0.05] transition",
          widthClass,
        ].join(" ")}
      >
        <span className="text-zinc-400 shrink-0">{label}：</span>

        <span className="min-w-0 flex-1 truncate text-left text-zinc-100">
          {labelText}
        </span>

        {selected.length > 0 && modeEnabled ? (
          <span className="hidden lg:inline text-zinc-500 shrink-0">
            {mode === "and" ? "AND" : "OR"}
          </span>
        ) : null}

        <span className="text-zinc-600 shrink-0">▾</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="close"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          <div
            className={[
              "z-50",
              // --- sm〜md: 画面内に収める（上下確保） ---
              "fixed inset-x-3 top-16 bottom-3 sm:inset-x-6 sm:top-20 sm:bottom-6",
              // --- lg以上: dropdown ---
              "lg:absolute lg:inset-auto lg:mt-2 lg:left-0 lg:top-auto lg:bottom-auto",
              "lg:w-[560px] lg:max-w-none",
              // common
              "rounded-lg border border-white/10",
              "bg-zinc-950/70 backdrop-blur",
              "overflow-hidden",
              "flex flex-col",
            ].join(" ")}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 shrink-0">
              <div className="text-[12px] text-zinc-500">
                {label}を選択（複数可）
              </div>
              <div className="text-[12px] text-zinc-500">
                選択：<span className="text-zinc-300">{local.length}</span> 件
              </div>
            </div>

            {/* モード切替（タグだけ） */}
            {modeEnabled && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 shrink-0">
                <span className="text-[12px] text-zinc-500">条件</span>

                <div className="inline-flex rounded-md border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLocalMode("or")}
                    className={[
                      "h-7 px-3 text-[12px] font-semibold transition",
                      "text-zinc-300 hover:bg-white/[0.05]",
                      localMode === "or" ? "bg-white/[0.05]" : "",
                    ].join(" ")}
                  >
                    OR
                  </button>
                  <div className="w-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => setLocalMode("and")}
                    className={[
                      "h-7 px-3 text-[12px] font-semibold transition",
                      "text-zinc-300 hover:bg-white/[0.05]",
                      localMode === "and" ? "bg-white/[0.05]" : "",
                    ].join(" ")}
                  >
                    AND
                  </button>
                </div>

                <div className="flex-1" />

                <div className="text-[12px] text-zinc-500">
                  対象：<span className="text-zinc-300">{totalCount}</span> 件
                </div>
              </div>
            )}

            {/* 一覧：ここだけスクロール */}
            <div className="flex-1 overflow-auto p-3">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {items.map((it) => {
                  const active = selectedSet.has(it.name);
                  return (
                    <button
                      key={it.id ?? it.name}
                      type="button"
                      onClick={() => toggle(it.name)}
                      className={[
                        "flex items-center justify-between gap-2",
                        "rounded-md border px-2 py-1.5",
                        "text-[11px] font-medium transition",
                        active
                          ? "border-white/20 bg-white/[0.06] text-zinc-100"
                          : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <span className="truncate">{it.name}</span>
                      <span className="text-zinc-500 shrink-0">
                        {counts[it.name] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* フッター：常に見える */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={clear}
                className="h-8 rounded-md px-3 border border-white/10 bg-white/[0.02]
                           text-[12px] font-semibold text-zinc-300 hover:bg-white/[0.05] transition"
              >
                解除
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={apply}
                className="h-8 rounded-md px-3 border border-white/10 bg-white/[0.02]
                           text-[12px] font-semibold text-zinc-100 hover:bg-white/[0.05] transition"
              >
                適用
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
