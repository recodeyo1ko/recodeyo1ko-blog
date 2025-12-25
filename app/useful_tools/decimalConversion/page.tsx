"use client";
import { useState } from "react";
import ReferenceTable from "./ReferenceTable";

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
    const calculatedWorkMinutes = endMinutes - startMinutes - breakMinutes;

    if (calculatedWorkMinutes < 0) {
      alert("終了時間が開始時間より早いか、休憩時間が稼働時間を超えています。");
      return;
    }

    setWorkMinutes(calculatedWorkMinutes);
  };

  // 任意の 60進 ⇔ 10進 変換用
  const [conversionType, setConversionType] =
    useState<ConversionType>("toDecimal");
  const [conversionInput, setConversionInput] = useState<string>("00:00");
  const [conversionResult, setConversionResult] = useState<string | null>(null);

  const handleSimpleConversion = () => {
    if (conversionType === "toDecimal") {
      const [hours, minutes] = conversionInput
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
      setConversionResult(decimal.toFixed(3));
    } else {
      const decimalValue = parseFloat(conversionInput);
      if (isNaN(decimalValue)) {
        alert("無効な入力です。少数を入力してください。");
        return;
      }

      const hours = Math.floor(decimalValue);
      const minutes = Math.round((decimalValue - hours) * 60);
      setConversionResult(`${hours}:${minutes.toString().padStart(2, "0")}`);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">60進数⇔10進数変換ツール</h1>

      <div className="w-full max-w-4xl space-y-6">
        {/*  ボックス1：稼働時間計算 */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">稼働時間計算</h2>

          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="startTime" className="font-medium w-32">
                開始時間 (HH:MM):
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded-md px-2 py-1 flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="endTime" className="font-medium w-32">
                終了時間 (HH:MM):
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border rounded-md px-2 py-1 flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="breakTime" className="font-medium w-32">
                休憩時間 (HH:MM):
              </label>
              <input
                type="time"
                id="breakTime"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
                className="border rounded-md px-2 py-1 flex-1"
              />
            </div>
            <button
              onClick={handleConvertWorkTime}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-start"
            >
              稼働時間を計算
            </button>
          </div>

          {workMinutes !== null && (
            <div className="mt-2 space-y-2">
              <p>稼働時間 (60進数): {formatMinutesToHHMM(workMinutes)}</p>
              <p>稼働時間 (10進数): {formatMinutesToDecimal(workMinutes)}</p>
              <p className="text-sm text-gray-600">
                計算式: 稼働時間 = (終了時間 - 開始時間) - 休憩時間
                <br />
                例: {formatMinutesToHHMM(parseTimeToMinutes(endTime))} -{" "}
                {formatMinutesToHHMM(parseTimeToMinutes(startTime))} -{" "}
                {formatMinutesToHHMM(parseTimeToMinutes(breakTime))} ={" "}
                {formatMinutesToHHMM(workMinutes)}
              </p>
            </div>
          )}
        </section>

        {/*  ボックス2：任意の 60進 ⇔ 10進 変換 */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">
            任意の時間を 60進数 ⇔ 10進数 変換
          </h2>

          <div className="flex items-center mb-4 space-x-4">
            <label className="flex items-center text-sm md:text-base">
              <input
                type="radio"
                value="toDecimal"
                checked={conversionType === "toDecimal"}
                onChange={() => {
                  setConversionType("toDecimal");
                  setConversionInput("00:00");
                  setConversionResult(null);
                }}
                className="mr-1"
              />
              60進数（HH:MM）→ 10進数
            </label>
            <label className="flex items-center text-sm md:text-base">
              <input
                type="radio"
                value="toSexagesimal"
                checked={conversionType === "toSexagesimal"}
                onChange={() => {
                  setConversionType("toSexagesimal");
                  setConversionInput("0.0");
                  setConversionResult(null);
                }}
                className="mr-1"
              />
              10進数 → 60進数（HH:MM）
            </label>
          </div>

          <div className="mb-3 text-sm text-gray-600">
            {conversionType === "toDecimal" && (
              <p>例: 13:45 (13時間45分を入力)</p>
            )}
            {conversionType === "toSexagesimal" && (
              <p>例: 13.75 (13.75時間を入力)</p>
            )}
          </div>

          <div className="flex items-center w-full">
            <div className="flex-1">
              {conversionType === "toDecimal" ? (
                <input
                  type="time"
                  step="60"
                  value={conversionInput}
                  onChange={(e) => setConversionInput(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
              ) : (
                <input
                  type="number"
                  step="0.01"
                  value={conversionInput}
                  onChange={(e) => setConversionInput(e.target.value)}
                  placeholder="例: 13.75"
                  className="w-full p-2 border rounded mb-2"
                />
              )}
            </div>
            <button
              onClick={handleSimpleConversion}
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              変換
            </button>
          </div>

          {conversionResult !== null && (
            <div className="mt-3 text-right">
              <p className="text-lg font-medium">{conversionResult}</p>
            </div>
          )}
        </section>

        {/*  ボックス3：参考表 */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">
            参考: 60進数と10進数の対応表
          </h2>
          <ReferenceTable />
        </section>
      </div>
    </div>
  );
};

export default DecimalConversionPage;
