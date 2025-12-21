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

const DecimalConversionPage = () => {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakTime, setBreakTime] = useState("01:15");
  const [workMinutes, setWorkMinutes] = useState<number | null>(null);

  const handleConvert = () => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">60進数⇔10進数変換</h1>

      {/* 稼働時間の入力フォーム */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="startTime" className="font-medium">
            開始時間 (HH:MM):
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="endTime" className="font-medium">
            終了時間 (HH:MM):
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="breakTime" className="font-medium">
            休憩時間 (HH:MM):
          </label>
          <input
            type="time"
            id="breakTime"
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          変換
        </button>
      </div>

      {workMinutes !== null && (
        <div className="mt-6 space-y-2">
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

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold mb-4">参考: 60進数と10進数の対応表</h2>
        <ReferenceTable />
      </div>
    </div>
  );
};

export default DecimalConversionPage;
