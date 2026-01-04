"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Tag = { id?: string; name: string };
type Mode = "or" | "and";

export default function TagFilterSelectorMulti({
  basePath,
  selectedTags,
  mode,
  tags,
  counts,
  totalCount,
}: {
  basePath: string; // /categories/xxx
  selectedTags: string[];
  mode: Mode;
  tags: Tag[];
  counts: Record<string, number>;
  totalCount: number;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // 開いている間の操作用（ローカル）
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);
  const [localMode, setLocalMode] = useState<Mode>(mode);

  useEffect(() => setLocalTags(selectedTags), [selectedTags]);
  useEffect(() => setLocalMode(mode), [mode]);

  // 外クリックで閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedSet = useMemo(() => new Set(localTags), [localTags]);

  const toggle = (name: string) => {
    setLocalTags((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const apply = () => {
    if (localTags.length === 0) {
      router.push(basePath);
      setOpen(false);
      return;
    }
    const q = `?tags=${encodeURIComponent(
      localTags.join(",")
    )}&mode=${localMode}`;
    router.push(`${basePath}${q}`);
    setOpen(false);
  };

  const clear = () => {
    setLocalTags([]);
    router.push(basePath);
    setOpen(false);
  };

  const label =
    selectedTags.length === 0
      ? "指定なし"
      : `${selectedTags.join(" / ")}（${selectedTags.length}件）`;

  return (
    <div ref={ref} className="relative">
      {/* トリガ（横幅あり） */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-2
          h-8 rounded-md px-2.5
          border border-white/10 bg-white/[0.02]
          text-[12px] font-semibold text-zinc-300
          hover:bg-white/[0.05] transition
          min-w-[360px]
        "
      >
        <span className="text-zinc-400">技術タグ：</span>
        <span className="min-w-0 flex-1 truncate text-left text-zinc-100">
          {label}
        </span>
        {selectedTags.length > 0 && (
          <span className="text-zinc-500">{mode === "and" ? "AND" : "OR"}</span>
        )}
        <span className="text-zinc-600">▾</span>
      </button>

      {/* ドロップダウン */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-[560px]
            rounded-lg border border-white/10
            bg-zinc-950/60 backdrop-blur
            overflow-hidden
          "
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
            <div className="text-[12px] text-zinc-500">
              技術タグを選択（複数可）
            </div>
            <div className="text-[12px] text-zinc-500">
              選択：<span className="text-zinc-300">{localTags.length}</span> 件
            </div>
          </div>

          {/* モード切替（OR / AND） */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
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

          {/* タグ一覧：グリッドで横幅あり */}
          <div className="max-h-[340px] overflow-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tags.map((t) => {
                const active = selectedSet.has(t.name);
                return (
                  <button
                    key={t.id ?? t.name}
                    type="button"
                    onClick={() => toggle(t.name)}
                    className={[
                      "flex items-center justify-between gap-2",
                      "rounded-md border px-2.5 py-2",
                      "text-[12px] font-semibold transition",
                      active
                        ? "border-white/20 bg-white/[0.06] text-zinc-100"
                        : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-zinc-500 shrink-0">
                      {counts[t.name] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* フッター */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
            <button
              type="button"
              onClick={clear}
              className="
                h-8 rounded-md px-3
                border border-white/10 bg-white/[0.02]
                text-[12px] font-semibold text-zinc-300
                hover:bg-white/[0.05] transition
              "
            >
              解除
            </button>

            <div className="flex-1" />

            <button
              type="button"
              onClick={apply}
              className="
                h-8 rounded-md px-3
                border border-white/10 bg-white/[0.02]
                text-[12px] font-semibold text-zinc-100
                hover:bg-white/[0.05] transition
              "
            >
              適用
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
