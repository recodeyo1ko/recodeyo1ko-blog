"use client";

import type { CharDiffResult, InlinePart } from "./diffUtils";

function Parts({ parts }: { parts: InlinePart[] }) {
  return (
    <pre className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap break-words font-mono">
      {parts.map((p, idx) => {
        // Web表示（ダーク）は今まで通り：差分は赤背景
        const cls =
          p.kind === "equal"
            ? "text-zinc-100"
            : "bg-red-500/20 text-zinc-100 rounded px-0.5";

        return (
          <span key={idx} className={cls} data-kind={p.kind}>
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
      <div className="px-4 py-6 text-sm text-zinc-500">
        まだ差分がありません。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md">
      <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.02]">
        <div className="px-4 py-2 text-xs text-zinc-400">
          Before（元テキスト）
        </div>
        <div className="px-4 py-2 text-xs text-zinc-400 border-l border-white/10">
          After（変更後）
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="px-4 py-4">
          <Parts parts={result.beforeParts} />
        </div>
        <div className="px-4 py-4 border-l border-white/10">
          <Parts parts={result.afterParts} />
        </div>
      </div>
    </div>
  );
}
