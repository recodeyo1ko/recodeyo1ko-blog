"use client";
import { useState } from "react";

const Conversion = () => {
  const [conversionType, setConversionType] = useState("toDecimal");
  const [inputValue, setInputValue] = useState<string>("00:00");
  const [result, setResult] = useState<string | null>(null);

  // Function to handle conversion
  const handleConversion = () => {
    if (conversionType === "toDecimal") {
      const [hours, minutes] = inputValue
        .split(":")
        .map((num) => parseInt(num, 10));

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
      setResult(decimal.toFixed(3)); // 4桁目を四捨五入して小数第3位まで表示
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
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="toDecimal"
            checked={conversionType === "toDecimal"}
            onChange={() => {
              setConversionType("toDecimal");
              setInputValue("00:00");
            }}
          />
          60進数を10進数に変換する
        </label>
        <label>
          <input
            type="radio"
            value="toSexagesimal"
            checked={conversionType === "toSexagesimal"}
            onChange={() => {
              setConversionType("toSexagesimal");
              setInputValue("0.0");
            }}
          />
          10進数を60進数に変換する
        </label>
      </div>

      <div className="mb-4 text-center">
        {conversionType === "toDecimal" && <p>例: 13:45 (13時間45分を入力)</p>}
        {conversionType === "toSexagesimal" && (
          <p>例: 13.75 (13.75時間を入力)</p>
        )}
      </div>

      <div className="flex items-center mb-6 w-full max-w-2xl">
        <div className="flex-1">
          {conversionType === "toDecimal" ? (
            <input
              type="time"
              step="60"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          ) : (
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="例: 13.75"
              className="w-full p-2 border rounded"
            />
          )}
        </div>
        <div className="mx-4">
          <button
            onClick={handleConversion}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            変換
          </button>
        </div>
        <div className="flex-1">
          {result !== null && <p className="text-lg font-medium">{result}</p>}
        </div>
      </div>
    </div>
  );
};

export default Conversion;
