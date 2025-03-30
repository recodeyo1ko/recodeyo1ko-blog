"use client";
import { useState } from "react";
import InputForm from "./inputForm";

const convertWorkTime = (
  value: number,
  unit: string,
  workHoursPerDay: number,
  workDaysPerMonth: number
): Record<string, number> => {
  let hours = 0;

  // 選択された単位に応じて、まず人時（hours）に変換
  if (unit === "hours") {
    hours = value;
  } else if (unit === "days") {
    hours = value * workHoursPerDay; // 1人日 = 所定労働時間
  } else if (unit === "months") {
    hours = value * workHoursPerDay * workDaysPerMonth; // 1人月 = 所定労働時間 × 営業日数
  }

  // 人時を基準に他の単位を計算
  return {
    hours: hours,
    days: hours / workHoursPerDay,
    months: hours / (workHoursPerDay * workDaysPerMonth),
  };
};

const WorkTimeConversionPage = () => {
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8); // 所定労働時間 (デフォルト: 8時間)
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(20); // 営業日数 (デフォルト: 20日)

  const handleConvert = (value: number, unit: string) => {
    const conversionResult = convertWorkTime(
      value,
      unit,
      workHoursPerDay,
      workDaysPerMonth
    );
    setResult(conversionResult);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">人時変換ツール</h1>

      {/* 所定労働時間と営業日数の入力フォーム */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="workHoursPerDay" className="font-medium">
            所定労働時間 (時間/日):
          </label>
          <input
            type="number"
            id="workHoursPerDay"
            value={workHoursPerDay}
            onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="workDaysPerMonth" className="font-medium">
            営業日数 (日/月):
          </label>
          <input
            type="number"
            id="workDaysPerMonth"
            value={workDaysPerMonth}
            onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          />
        </div>
      </div>

      <InputForm onConvert={handleConvert} />
      {result && (
        <div className="mt-6 space-y-2">
          <p>人時: {result.hours.toFixed(2)}</p>
          <p>人日: {result.days.toFixed(2)}</p>
          <p>人月: {result.months.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default WorkTimeConversionPage;
