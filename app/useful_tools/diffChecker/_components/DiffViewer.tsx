// app/useful_tools/diffTool/DiffViewer.tsx
"use client";

import { DiffLine } from "./diffUtils";

type Props = {
  lines: DiffLine[];
};

export default function DiffViewer({ lines }: Props) {
  if (lines.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        まだ差分がありません。「差分を比較」ボタンを押してください。
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* BEFORE */}
      <div className="bg-white/[0.02] rounded-md border border-white/10 p-4">
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">Before</h2>
        <div className="border border-white/10 rounded-md overflow-auto bg-white/[0.02]">
          <ul className="text-sm font-mono">
            {lines.map((line, index) => {
              const bg =
                line.type === "delete" ? "bg-red-100 text-red-800" : "";
              return (
                <li
                  key={index}
                  className={`px-3 py-1 ${bg} hover:bg-white/[0.05]`}
                >
                  <span className="text-zinc-500 mr-2">{index + 1}</span>
                  {line.before || ""}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* AFTER */}
      <div className="bg-white/[0.02] rounded-md border border-white/10 p-4">
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">After</h2>
        <div className="border border-white/10 rounded-md overflow-auto bg-white/[0.02]">
          <ul className="text-sm font-mono">
            {lines.map((line, index) => {
              const bg =
                line.type === "insert" ? "bg-green-100 text-green-800" : "";
              return (
                <li
                  key={index}
                  className={`px-3 py-1 ${bg} hover:bg-white/[0.05]`}
                >
                  <span className="text-zinc-500 mr-2">{index + 1}</span>
                  {line.after || ""}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
