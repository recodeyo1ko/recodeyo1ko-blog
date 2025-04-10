"use client";
import React, { useState } from "react";

interface InputFormProps {
  onConvert: (value: number, unit: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onConvert }) => {
  const [value, setValue] = useState<number | "">("");
  const [unit, setUnit] = useState("hours");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value !== "") {
      onConvert(Number(value), unit);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(e.target.value !== "" ? Number(e.target.value) : "")
          }
          placeholder="Enter value"
          className="border rounded-md px-4 py-2"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="hours">人時</option>
          <option value="days">人日</option>
          <option value="months">人月</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-md"
      >
        変換
      </button>
    </form>
  );
};

export default InputForm;
