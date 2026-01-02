// app/useful_tools/diffTool/page.tsx
"use client";

import { useState } from "react";
import { calcTextStats, diffLines, TextStats, DiffLine } from "./diffUtils";
import TextAreaWithStats from "./TextAreaWithStats";
import DiffViewer from "./DiffViewer";
import ToolHeader from "@/app/components/ToolHeader";

export default function DiffToolPage() {
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");

  const [beforeStats, setBeforeStats] = useState<TextStats>(() =>
    calcTextStats("")
  );
  const [afterStats, setAfterStats] = useState<TextStats>(() =>
    calcTextStats("")
  );

  const [diffLinesState, setDiffLinesState] = useState<DiffLine[]>([]);

  const handleCompare = () => {
    const diff = diffLines(beforeText, afterText);
    setDiffLinesState(diff);
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8">
      {/* タイトルと使い方 */}
      <ToolHeader
        title="差分比較ツール"
        description="2つのテキストの差分を行単位で比較・表示します。追加・削除・変更された行が一目でわかります。"
        steps={
          <>
            <li>
              左右のテキストエリアに比較したい2つのテキストを貼り付けます。
            </li>
            <li>「差分を比較」ボタンを押すと、差分が下部に表示されます。</li>
            <li>
              追加・削除・変更された行が色分けされて表示され、一目で違いがわかります。
            </li>
          </>
        }
      />

      {/* 入力＆統計 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <TextAreaWithStats
          label="Before（元テキスト）"
          placeholder="ここに元のテキストを入力 / 貼り付け"
          value={beforeText}
          onChange={(value) => {
            setBeforeText(value);
            setBeforeStats(calcTextStats(value));
          }}
          statsLabel="Before の統計"
          stats={beforeStats}
          color="blue"
        />
        <TextAreaWithStats
          label="After（変更後テキスト）"
          placeholder="ここに変更後のテキストを入力 / 貼り付け"
          value={afterText}
          onChange={(value) => {
            setAfterText(value);
            setAfterStats(calcTextStats(value));
          }}
          statsLabel="After の統計"
          stats={afterStats}
          color="green"
        />
      </div>

      {/* ボタン */}
      <button
        onClick={handleCompare}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 active:scale-[0.98]"
      >
        差分を比較
      </button>

      {/* 差分ビュー */}
      <DiffViewer lines={diffLinesState} />
    </div>
  );
}
