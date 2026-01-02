"use client";
import { useState } from "react";
import InputForm from "./inputForm";
import ToolHeader from "@/app/components/ToolHeader";

const convertWorkTime = (
  value: number,
  unit: string,
  workHoursPerDay: number,
  workDaysPerMonth: number
): Record<string, number> => {
  let hours = 0;

  if (unit === "hours") {
    hours = value;
  } else if (unit === "days") {
    hours = value * workHoursPerDay;
  } else if (unit === "months") {
    hours = value * workHoursPerDay * workDaysPerMonth;
  }

  return {
    hours,
    days: hours / workHoursPerDay,
    months: hours / (workHoursPerDay * workDaysPerMonth),
  };
};

const WorkTimeConversionPage = () => {
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(20);

  const handleConvert = (value: number, unit: string) => {
    setResult(convertWorkTime(value, unit, workHoursPerDay, workDaysPerMonth));
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-lg bg-gray-50 px-4 py-8">
      {/* タイトルと使い方 */}
      <ToolHeader
        title="労働時間変換ツール"
        description="人時・人日・人月の間で変換を行います。所定労働時間や営業日数も設定可能です。"
        steps={
          <>
            <li>所定労働時間（時間/日）と営業日数（日/月）を設定します。</li>
            <li>変換したい値と単位（人時・人日・人月）を入力します。</li>
            <li>
              「変換」ボタンを押すと、他の単位に変換された結果が表示されます。
            </li>
          </>
        }
      />

      {/* 入力カード */}
      <section className="w-full max-w-2xl border rounded-lg shadow-sm bg-white p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">条件入力</h2>

        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center space-x-2">
            <label htmlFor="workHoursPerDay" className="font-medium w-48">
              所定労働時間 (時間/日):
            </label>
            <input
              type="number"
              id="workHoursPerDay"
              value={workHoursPerDay}
              onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
              className="border rounded-md px-2 py-1 flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="workDaysPerMonth" className="font-medium w-48">
              営業日数 (日/月):
            </label>
            <input
              type="number"
              id="workDaysPerMonth"
              value={workDaysPerMonth}
              onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
              className="border rounded-md px-2 py-1 flex-1"
            />
          </div>
        </div>

        {/* 人時/人日/人月 入力フォーム */}
        <InputForm onConvert={handleConvert} />
      </section>

      {/* 結果カード */}
      {result && (
        <section className="mt-6 w-full max-w-2xl border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">変換結果</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600"></span>
              <span className="font-mono font-semibold">
                {result.hours.toFixed(2)}{" "}
                <span className="ml-1 text-gray-500">人時</span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600"></span>
              <span className="font-mono font-semibold">
                {result.days.toFixed(2)}{" "}
                <span className="ml-1 text-gray-500">人日</span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600"></span>
              <span className="font-mono font-semibold">
                {result.months.toFixed(2)}{" "}
                <span className="ml-1 text-gray-500">人月</span>
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default WorkTimeConversionPage;
