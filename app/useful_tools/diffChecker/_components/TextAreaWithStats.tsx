// app/useful_tools/diffTool/_components/TextAreaWithStats.tsx
"use client";

import type { TextStats } from "./diffUtils";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  statsLabel: string;
  stats: TextStats;
  color?: "blue" | "green";
};

export default function TextAreaWithStats({
  label,
  placeholder,
  value,
  onChange,
  statsLabel,
  stats,
  color = "blue",
}: Props) {
  const ring =
    color === "blue"
      ? "focus:ring-blue-500/40 focus:border-blue-500/40"
      : "focus:ring-emerald-500/40 focus:border-emerald-500/40";

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-sm font-semibold text-zinc-100">{label}</h3>
        <div className="text-[11px] text-zinc-400">{statsLabel}</div>
      </div>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-[200px] rounded-md border border-white/10 bg-zinc-950/40 text-zinc-100 p-3 text-sm font-mono
        placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${ring}`}
      />

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-2">
          文字数（空白/改行除く）:{" "}
          <span className="font-semibold tabular-nums">{stats.charCount}</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-2">
          空白数:{" "}
          <span className="font-semibold tabular-nums">{stats.spaceCount}</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-2">
          文字数（空白込み/改行除く）:{" "}
          <span className="font-semibold tabular-nums">
            {stats.charCountWithSpaces}
          </span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-2">
          改行数:{" "}
          <span className="font-semibold tabular-nums">
            {stats.newlineCount}
          </span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.02] p-2 col-span-2">
          文字数（空白+改行込み）:{" "}
          <span className="font-semibold tabular-nums">
            {stats.charCountWithSpacesAndNewlines}
          </span>{" "}
          / 単語数:{" "}
          <span className="font-semibold tabular-nums">{stats.wordCount}</span>
        </div>
      </div>
    </div>
  );
}
