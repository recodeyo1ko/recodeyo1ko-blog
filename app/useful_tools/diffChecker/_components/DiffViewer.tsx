// app/useful_tools/diffTool/_components/DiffViewer.tsx
"use client";

import type { CharDiffResult, InlinePart } from "./diffUtils";

function Parts({ parts }: { parts: InlinePart[] }) {
  return (
    <pre className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap break-words font-mono">
      {parts.map((p, idx) => {
        const cls =
          p.kind === "equal"
            ? "text-zinc-100"
            : p.kind === "delete"
            ? "bg-rose-500/25 text-rose-100 rounded px-0.5"
            : "bg-emerald-500/25 text-emerald-100 rounded px-0.5";

        return (
          <span key={idx} className={cls}>
            {p.text}
          </span>
        );
      })}
    </pre>
  );
}

export default function DiffViewer({
  result,
}: {
  result: CharDiffResult | null;
}) {
  if (!result) {
    return (
      <div className="text-zinc-400 text-sm">
        まだ差分がありません。「差分を比較」を押すと結果が表示されます。
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-md border border-white/10 bg-black/20 overflow-hidden">
        <div className="px-3 py-2 text-xs font-semibold text-zinc-300 bg-white/[0.03] border-b border-white/10">
          Before（削除は赤）
        </div>
        <div className="p-4">
          <Parts parts={result.beforeParts} />
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-black/20 overflow-hidden">
        <div className="px-3 py-2 text-xs font-semibold text-zinc-300 bg-white/[0.03] border-b border-white/10">
          After（追加は緑）
        </div>
        <div className="p-4">
          <Parts parts={result.afterParts} />
        </div>
      </div>
    </div>
  );
}
