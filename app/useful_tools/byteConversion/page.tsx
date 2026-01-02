"use client";

import ToolHeader from "@/app/components/useful_tool/ToolHeader";
import { useMemo, useState } from "react";

const siUnits = ["B", "KB", "MB", "GB", "TB", "PB"] as const;
const iecUnits = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] as const;

type Unit = (typeof siUnits)[number] | (typeof iecUnits)[number];

const siFactor: Record<(typeof siUnits)[number], number> = {
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
  PB: 1e15,
};

const iecFactor: Record<(typeof iecUnits)[number], number> = {
  B: 1,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
  PiB: 1024 ** 5,
};

// 「GB/TB」などSI表記を「GiB/TiB」などIEC相当に対応させる（2進として解釈したい時用）
const siToIecEquivalent: Record<
  Exclude<(typeof siUnits)[number], "B">,
  (typeof iecUnits)[number]
> = {
  KB: "KiB",
  MB: "MiB",
  GB: "GiB",
  TB: "TiB",
  PB: "PiB",
};

function formatNumber(n: number) {
  // toFixed固定だと小さい値で見づらいので、必要に応じて調整
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function ByteConversionPage() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<Unit>("GB");

  const [resultShrink, setResultShrink] = useState<
    { unit: string; value: number }[]
  >([]);
  const [result1024, setResult1024] = useState<
    { unit: string; value: number }[]
  >([]);

  const fromUnitIsSI = useMemo(
    () => siUnits.includes(fromUnit as any),
    [fromUnit]
  );

  const handleConvert = () => {
    // A) 少なくなる：入力を「SI(×1000)の単位」としてByteに直し、IECで表示する
    // 例：5 TB(=5×10^12 B) → TiB(= ÷1024^4) で 4.55 TiB のように見える
    let bytesAssumingSI = 0;
    if (fromUnitIsSI) {
      bytesAssumingSI =
        inputValue * siFactor[fromUnit as (typeof siUnits)[number]];
    } else {
      // 入力がすでにKiB等なら、そのままIECでByte化した方が自然
      bytesAssumingSI =
        inputValue * iecFactor[fromUnit as (typeof iecUnits)[number]];
    }

    setResultShrink(
      iecUnits.map((unit) => ({
        unit,
        value: bytesAssumingSI / iecFactor[unit],
      }))
    );

    // B) 1024をかけた：入力を「2進(×1024)の単位」としてByteに直し、SIで表示する
    // 例：5 TB を「5 TiB相当」とみなす（=5×1024^4 B） → TB(= ÷10^12) で 5.49 TB みたいに見える
    let bytesAssumingBinary = 0;

    if (fromUnitIsSI) {
      if (fromUnit === "B") {
        bytesAssumingBinary = inputValue;
      } else {
        const iecEq =
          siToIecEquivalent[fromUnit as Exclude<(typeof siUnits)[number], "B">];
        bytesAssumingBinary = inputValue * iecFactor[iecEq];
      }
    } else {
      // 入力がすでにKiB等なら、そのままIECでByte化（=1024基準の解釈）
      bytesAssumingBinary =
        inputValue * iecFactor[fromUnit as (typeof iecUnits)[number]];
    }

    setResult1024(
      siUnits.map((unit) => ({
        unit,
        value: bytesAssumingBinary / siFactor[unit],
      }))
    );
  };

  const hasResults = resultShrink.length > 0 || result1024.length > 0;

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="10進・2進 バイト変換ツール"
          description="入力したバイト数を、10進（SI）と2進（IEC）の両方の基準で変換・表示します。メーカー表記とOS表示の違いを理解するのに役立ちます。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>
                数値と単位を入力し、「変換」ボタンを押すと、両方の基準での変換結果が表示されます。
              </li>
              <li>
                左側のセクションでは、入力を10進（SI）基準として解釈し、2進（IEC）で表示します。
              </li>
              <li>
                右側のセクションでは、入力を2進（IEC）基準として解釈し、10進（SI）で表示します。
              </li>
            </>
          }
        />

        {/* 入力セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">入力</h2>

          {/* 入力フォーム */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="inputValue"
                className="font-medium text-zinc-300 w-20"
              >
                数値:
              </label>
              <input
                type="number"
                id="inputValue"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 flex-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="fromUnit"
                className="font-medium text-zinc-300 w-20"
              >
                単位:
              </label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="bg-white/[0.02] border border-white/10 rounded-md px-2 py-1 flex-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {[...siUnits, ...iecUnits].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* 変換ボタン：右下 */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConvert}
                className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                変換
              </button>
            </div>
          </div>
        </section>

        {/* 結果（2つのセクション） */}
        {hasResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* A: 少なくなる表示 */}
            <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4 border-b border-white/10 pb-2">
                少なく見える（メーカー表記 → OS表示）
              </h2>

              <div className="text-sm text-zinc-400 mb-4 space-y-1">
                <p>
                  <strong>計算:</strong> 入力を <strong>10^3（×1000）</strong>{" "}
                  としてByte化 → <strong>2^10（÷1024）</strong>{" "}
                  系（KiB/MiB/GiB/TiB）で表示
                </p>
                <p className="text-zinc-500">
                  例: 5TB = 5×10^12B を TiB（÷1024^4）で見ると約 4.55TiB
                  になり、少なく見えます。
                </p>
              </div>

              <ul className="space-y-2">
                {resultShrink.map(({ unit, value }) => (
                  <li
                    key={unit}
                    className="flex justify-between text-zinc-100 hover:bg-white/[0.05] p-2 rounded-md"
                  >
                    <span>{unit}</span>
                    <span className="font-mono">{formatNumber(value)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* B: 1024基準 */}
            <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4 border-b border-white/10 pb-2">
                1024基準として解釈（2進 → 10進で表示）
              </h2>

              <div className="text-sm text-zinc-400 mb-4 space-y-1">
                <p>
                  <strong>計算:</strong> 入力を <strong>2^10（×1024）</strong>{" "}
                  としてByte化（TB→TiB相当として扱う） →{" "}
                  <strong>10^3（÷1000）</strong> 系（KB/MB/GB/TB）で表示
                </p>
                <p className="text-zinc-500">
                  例: 5（TiB相当）= 5×1024^4B を TB（÷10^12）で見ると約 5.50TB
                  になり、大きく見えます。
                </p>
              </div>

              <ul className="space-y-2">
                {result1024.map(({ unit, value }) => (
                  <li
                    key={unit}
                    className="flex justify-between text-zinc-100 hover:bg-white/[0.05] p-2 rounded-md"
                  >
                    <span>{unit}</span>
                    <span className="font-mono">{formatNumber(value)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
