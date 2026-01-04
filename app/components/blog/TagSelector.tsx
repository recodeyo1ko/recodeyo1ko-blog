"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type Tag = { id: string; name: string };

export default function TagSelector({
  basePath,
  selectedTag,
  tags,
  totalCount,
  counts,
}: {
  basePath: string; // /categories/xxx
  selectedTag: string; // "" or tagName
  tags: Tag[];
  totalCount: number;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const go = (tagName: string) => {
    const url = tagName
      ? `${basePath}?tag=${encodeURIComponent(tagName)}`
      : basePath;
    router.push(url);
    if (detailsRef.current) detailsRef.current.open = false; // 自動で閉じる
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="
          list-none cursor-pointer select-none
          inline-flex items-center gap-2
          h-7 rounded-md px-2.5
          border border-white/10 bg-white/[0.02]
          text-[12px] font-semibold text-zinc-300
          hover:bg-white/[0.05] transition
        "
      >
        <span className="text-zinc-400">技術タグ：</span>
        {selectedTag ? (
          <span className="text-zinc-100">{selectedTag}</span>
        ) : (
          <span className="text-zinc-300">指定なし</span>
        )}
        <span className="text-zinc-600">▾</span>
      </summary>

      <div
        className="
          absolute z-20 mt-2 w-[260px]
          rounded-lg border border-white/10
          bg-zinc-950/60 backdrop-blur
          overflow-hidden
        "
      >
        <div className="px-3 py-2 text-[12px] text-zinc-500 border-b border-white/10">
          技術タグを選択
        </div>

        <div className="max-h-[240px] overflow-auto">
          <button
            type="button"
            onClick={() => go("")}
            className={[
              "w-full flex items-center justify-between px-3 py-2 text-sm text-left",
              "text-zinc-300 hover:bg-white/[0.05] transition",
              !selectedTag ? "bg-white/[0.03]" : "",
            ].join(" ")}
          >
            <span className="font-semibold">指定なし</span>
            <span className="text-[12px] text-zinc-500">{totalCount}</span>
          </button>

          <div className="h-px bg-white/10" />

          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(t.name)}
              className={[
                "w-full flex items-center justify-between px-3 py-2 text-sm text-left",
                "text-zinc-300 hover:bg-white/[0.05] transition",
                selectedTag === t.name ? "bg-white/[0.03]" : "",
              ].join(" ")}
            >
              <span className="font-semibold">{t.name}</span>
              <span className="text-[12px] text-zinc-500">
                {counts[t.name] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </details>
  );
}
