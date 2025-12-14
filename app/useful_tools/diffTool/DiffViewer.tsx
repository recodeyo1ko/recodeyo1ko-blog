// app/useful_tools/diffTool/DiffViewer.tsx
"use client";

import { DiffLine } from "./diffUtils";

type Props = {
  lines: DiffLine[];
};

export default function DiffViewer({ lines }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* BEFORE */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Before</h2>
        <div className="border rounded-md overflow-auto bg-white">
          <ul className="text-sm font-mono">
            {lines.map((line, index) => {
              const bg = line.type === "delete" ? "bg-red-100" : "";
              return (
                <li key={index} className={`px-3 py-1 ${bg}`}>
                  <span className="text-gray-400 mr-2">{index + 1}</span>
                  {line.before || ""}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* AFTER */}
      <div>
        <h2 className="text-lg font-semibold mb-2">After</h2>
        <div className="border rounded-md overflow-auto bg-white">
          <ul className="text-sm font-mono">
            {lines.map((line, index) => {
              const bg = line.type === "insert" ? "bg-green-100" : "";
              return (
                <li key={index} className={`px-3 py-1 ${bg}`}>
                  <span className="text-gray-400 mr-2">{index + 1}</span>
                  {line.after || ""}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
