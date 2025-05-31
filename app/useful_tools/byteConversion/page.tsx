"use client";

import { useState } from "react";

const siUnits = ["B", "KB", "MB", "GB", "TB", "PB"];
const iecUnits = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

const conversionFactors: { [unit: string]: number } = {
  B: 1,
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
  PB: 1e15,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
  PiB: 1024 ** 5,
};

export default function ByteConversionPage() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [fromUnit, setFromUnit] = useState<string>("GB");
  const [convertedSI, setConvertedSI] = useState<
    { unit: string; value: number }[]
  >([]);
  const [convertedIEC, setConvertedIEC] = useState<
    { unit: string; value: number }[]
  >([]);

  const handleConvert = () => {
    const bytes = inputValue * conversionFactors[fromUnit];

    setConvertedSI(
      siUnits.map((unit) => ({
        unit,
        value: bytes / conversionFactors[unit],
      }))
    );

    setConvertedIEC(
      iecUnits.map((unit) => ({
        unit,
        value: bytes / conversionFactors[unit],
      }))
    );
  };

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
            onChange={(e) => setFromUnit(e.target.value)}
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

      {(convertedSI.length > 0 || convertedIEC.length > 0) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* SI表示 */}
          <div className="bg-white shadow rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2 border-b">
              SI単位 (10^3)
            </h2>
            <ul className="space-y-1">
              {convertedSI.map(({ unit, value }) => (
                <li key={unit} className="flex justify-between">
                  <span>{unit}</span>
                  <span>{value.toFixed(4)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IEC表示 */}
          <div className="bg-white shadow rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2 border-b">
              IEC単位 (2^10)
            </h2>
            <ul className="space-y-1">
              {convertedIEC.map(({ unit, value }) => (
                <li key={unit} className="flex justify-between">
                  <span>{unit}</span>
                  <span>{value.toFixed(4)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
