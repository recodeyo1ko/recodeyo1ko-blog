"use client";

import { useState } from "react";
import ReferenceTable from "./_components/ReferenceTable";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToHHMM = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

const formatMinutesToDecimal = (minutes: number): string => {
  const hours = minutes / 60;
  return hours.toFixed(2);
};

type ConversionType = "toDecimal" | "toSexagesimal";

const DecimalConversionPage = () => {
  // 稼働時間計算用
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakTime, setBreakTime] = useState("01:15");
  const [workMinutes, setWorkMinutes] = useState<number | null>(null);

  const handleConvertWorkTime = () => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const breakMinutes = parseTimeToMinutes(breakTime);
    const totalWorkMinutes = endMinutes - startMinutes - breakMinutes;
    setWorkMinutes(totalWorkMinutes);
  };

  // 任意の 60進 ⇔ 10進 変換用
  const [conversionType, setConversionType] =
    useState<ConversionType>("toDecimal");
  const [inputValue, setInputValue] = useState("00:00");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    if (conversionType === "toDecimal") {
      const [hours, minutes] = inputValue.split(":").map(Number);
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        minutes < 0 ||
        minutes >= 60
      ) {
        alert("無効な入力です。正しい形式で時間を入力してください。");
        return;
      }
      const decimal = hours + minutes / 60;
      setResult(decimal.toFixed(3));
    } else {
      const decimalValue = parseFloat(inputValue);
      if (isNaN(decimalValue)) {
        alert("無効な入力です。少数を入力してください。");
        return;
      }
      const hours = Math.floor(decimalValue);
      const minutes = Math.round((decimalValue - hours) * 60);
      setResult(`${hours}:${minutes.toString().padStart(2, "0")}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="10進・60進 数変換ツール"
          description="稼働時間の計算と、10進数と60進数（時間表記）の相互変換を行うツールです。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>
                開始時間、終了時間、休憩時間を入力して「計算」ボタンを押すと、実働時間が表示されます。
              </li>
              <li>
                10進数と60進数の変換モードを選択し、対応する形式で値を入力します。
              </li>
              <li>「変換」ボタンを押すと、変換結果が表示されます。</li>
            </>
          }
        />

        {/* 稼働時間計算 */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            稼働時間計算
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                開始時間
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                終了時間
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                休憩時間
              </label>
              <input
                type="time"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleConvertWorkTime}
              className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              計算
            </button>
            {workMinutes !== null && (
              <div className="text-sm text-zinc-300">
                実働時間: {formatMinutesToHHMM(workMinutes)} (
                {formatMinutesToDecimal(workMinutes)} 時間)
              </div>
            )}
          </div>
        </section>

        {/* 変換 */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">変換</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-zinc-300">
                <input
                  type="radio"
                  value="toDecimal"
                  checked={conversionType === "toDecimal"}
                  onChange={() => {
                    setConversionType("toDecimal");
                    setInputValue("00:00");
                    setResult(null);
                  }}
                  className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
                />
                60進数 → 10進数
              </label>
              <label className="flex items-center text-sm text-zinc-300">
                <input
                  type="radio"
                  value="toSexagesimal"
                  checked={conversionType === "toSexagesimal"}
                  onChange={() => {
                    setConversionType("toSexagesimal");
                    setInputValue("0.0");
                    setResult(null);
                  }}
                  className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
                />
                10進数 → 60進数
              </label>
            </div>

            <div className="text-sm text-zinc-500 mb-2">
              {conversionType === "toDecimal" && "例: 13:45 (13時間45分を入力)"}
              {conversionType === "toSexagesimal" &&
                "例: 13.75 (13.75時間を入力)"}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                {conversionType === "toDecimal" ? (
                  <input
                    type="time"
                    step="60"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  />
                ) : (
                  <input
                    type="number"
                    step="0.01"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="例: 13.75"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  />
                )}
              </div>
              <button
                onClick={handleConvert}
                className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                変換
              </button>
              <div className="flex-1">
                {result && (
                  <div className="text-sm font-mono text-zinc-100">
                    {result}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 参照表 */}
        <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">参照表</h2>
          <ReferenceTable />
        </section>
      </div>
    </div>
  );
};

export default DecimalConversionPage;
