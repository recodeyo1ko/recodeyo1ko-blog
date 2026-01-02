// app/useful_tools/diffTool/TextAreaWithStats.tsx
"use client";

import { TextStats } from "./diffUtils";

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
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-zinc-300">{label}</h2>
      <textarea
        className="h-64 w-full bg-white/[0.02] border border-white/10 rounded-md p-3 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-2 rounded-md bg-white/[0.02] border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.05]">
        <div className="font-semibold mb-1">{statsLabel}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>文字数: {stats.charCount}</span>
          <span>空白数: {stats.spaceCount}</span>
          <span>空白込み文字数: {stats.charCountWithSpaces}</span>
          <span>改行数: {stats.newlineCount}</span>
          <span>改行込み文字数: {stats.charCountWithSpacesAndNewlines}</span>
          <span>単語数: {stats.wordCount}</span>
        </div>
      </div>
    </div>
  );
}
