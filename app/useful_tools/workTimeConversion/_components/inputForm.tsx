"use client";
import { useState } from "react";

interface InputFormProps {
  onConvert: (value: number, unit: string) => void;
}

export default function InputForm({ onConvert }: InputFormProps) {
  const [value, setValue] = useState(0);
  const [unit, setUnit] = useState("hours");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(value, unit);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* 入力行 */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1 bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <option value="hours">人時</option>
          <option value="days">人日</option>
          <option value="months">人月</option>
        </select>
      </div>

      {/* 変換ボタン（右寄せにしやすい） */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-zinc-700 text-zinc-100 px-6 py-2 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          変換
        </button>
      </div>
    </form>
  );
}
