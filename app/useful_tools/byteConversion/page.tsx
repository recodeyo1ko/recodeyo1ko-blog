"use client";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Byte単位変換ツール</h1>

      {/* 入力フォーム */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="inputValue" className="font-medium">
            数値:
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="fromUnit" className="font-medium">
            単位:
          </label>
          <select
            id="fromUnit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="border rounded-md px-2 py-1"
          >
            {[...siUnits, ...iecUnits].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleConvert}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        変換
      </button>

      {hasResults && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* A: 少なくなる表示 */}
          <div className="bg-white shadow rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2 border-b">
              少なく見える（メーカー表記 → OS表示）
            </h2>

            <div className="text-sm text-gray-700 mb-3 space-y-1">
              <p>
                <b>計算:</b> 入力を <b>10^3（×1000）</b> としてByte化 →{" "}
                <b>2^10（÷1024）</b> 系（KiB/MiB/GiB/TiB）で表示
              </p>
              <p className="text-gray-500">
                例: 5TB = 5×10^12B を TiB（÷1024^4）で見ると約 4.55TiB
                になり、少なく見えます。
              </p>
            </div>

            <ul className="space-y-1">
              {resultShrink.map(({ unit, value }) => (
                <li key={unit} className="flex justify-between">
                  <span>{unit}</span>
                  <span>{formatNumber(value)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* B: 1024をかけた表示 */}
          <div className="bg-white shadow rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2 border-b">
              1024基準として解釈（2進 → 10進で表示）
            </h2>

            <div className="text-sm text-gray-700 mb-3 space-y-1">
              <p>
                <b>計算:</b> 入力を <b>2^10（×1024）</b>{" "}
                としてByte化（TB→TiB相当として扱う） → <b>10^3（÷1000）</b>{" "}
                系（KB/MB/GB/TB）で表示
              </p>
              <p className="text-gray-500">
                例: 5（TiB相当）= 5×1024^4B を TB（÷10^12）で見ると約 5.50TB
                になり、大きく見えます。
              </p>
            </div>

            <ul className="space-y-1">
              {result1024.map(({ unit, value }) => (
                <li key={unit} className="flex justify-between">
                  <span>{unit}</span>
                  <span>{formatNumber(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
