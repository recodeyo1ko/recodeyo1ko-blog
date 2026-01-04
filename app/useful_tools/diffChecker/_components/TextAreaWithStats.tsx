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
};

function StatRow({ k, v }: { k: string; v: number }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 px-3 py-2 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
      <div className="text-xs text-zinc-500">{k}</div>
      <div className="text-sm text-zinc-200 tabular-nums">{v}</div>
    </div>
  );
}

export default function TextAreaWithStats({
  label,
  placeholder,
  value,
  onChange,
  statsLabel,
  stats,
}: Props) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-sm font-semibold text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500">{statsLabel}</div>
      </div>

      <div className="p-4">
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full min-h-[220px] rounded-md",
            "border border-white/10 bg-zinc-950/40",
            "px-3 py-2 text-sm font-mono text-zinc-100",
            "placeholder:text-zinc-600",
            "focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20",
          ].join(" ")}
        />
      </div>

      <div className="p-4 pt-0 space-y-2">
        <div className="text-xs text-zinc-500 px-1">統計</div>
        <StatRow k="文字数（空白・改行除く）" v={stats.charCount} />
        <StatRow k="空白数" v={stats.spaceCount} />
        <StatRow k="改行数" v={stats.newlineCount} />
        <StatRow
          k="文字数（空白込み・改行除く）"
          v={stats.charCountWithSpaces}
        />
      </div>
    </div>
  );
}
