// app/useful_tools/diffTool/page.tsx
"use client";

import { useState } from "react";
import {
  calcTextStats,
  diffChars,
  TextStats,
  CharDiffResult,
} from "./_components/diffUtils";
import TextAreaWithStats from "./_components/TextAreaWithStats";
import DiffViewer from "./_components/DiffViewer";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

export default function DiffToolPage() {
  const [beforeText, setBeforeText] = useState("");
  const [afterText, setAfterText] = useState("");

  const [beforeStats, setBeforeStats] = useState<TextStats>(() =>
    calcTextStats("")
  );
  const [afterStats, setAfterStats] = useState<TextStats>(() =>
    calcTextStats("")
  );

  const [diffResult, setDiffResult] = useState<CharDiffResult | null>(null);

  const handleCompare = () => {
    setDiffResult(diffChars(beforeText, afterText));
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="差分チェッカー（文字単位）"
          description="2つのテキストを文字単位で比較し、異なる箇所だけをハイライトします。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>
                左右のテキストエリアに比較したいテキストを入力または貼り付けます。
              </li>
              <li>「差分を比較」ボタンをクリックします。</li>
              <li>
                削除（赤）/追加（緑）として、違う箇所だけがハイライトされます。
              </li>
            </>
          }
        />

        {/* 入力＆統計 */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            テキスト入力
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
        </section>

        {/* ボタン */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <button
            onClick={handleCompare}
            className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            差分を比較
          </button>
        </section>

        {/* 差分ビュー */}
        <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            差分結果（文字単位）
          </h2>
          <DiffViewer result={diffResult} />
        </section>
      </div>
    </div>
  );
}
