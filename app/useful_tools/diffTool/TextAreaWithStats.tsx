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
  const focusBorder =
    color === "green" ? "focus:border-green-500 focus:ring-green-500" : "focus:border-blue-500 focus:ring-blue-500";

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">{label}</h2>
      <textarea
        className={`h-64 w-full border rounded-md p-3 text-sm font-mono outline-none focus:ring-1 ${focusBorder}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
        <div className="font-semibold mb-1">{statsLabel}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>文字数: {stats.charCount}</span>
          <span>空白数: {stats.spaceCount}</span>
          <span>空白込み文字数: {stats.charCountWithSpaces}</span>
          <span>改行数: {stats.newlineCount}</span>
          <span>
            改行込み文字数: {stats.charCountWithSpacesAndNewlines}
          </span>
          <span>単語数: {stats.wordCount}</span>
        </div>
      </div>
    </div>
  );
}
