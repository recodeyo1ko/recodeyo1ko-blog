"use client";
import { useState } from "react";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";
import CopyButton from "@/app/components/CopyButton";

type Mode = "toZenkaku" | "toHankaku";

/**
 * 半角 → 全角
 * 対象：ASCII記号・英数字 (0x21-0x7E) + 半角スペース
 */
const toZenkaku = (str: string): string => {
  let result = "";
  for (const char of str) {
    const code = char.charCodeAt(0);

    // 半角スペース -> 全角スペース
    if (code === 0x20) {
      result += String.fromCharCode(0x3000);
      continue;
    }

    // 半角 ASCII 記号・英数字 -> 全角
    if (code >= 0x21 && code <= 0x7e) {
      result += String.fromCharCode(code + 0xfee0);
      continue;
    }

    // それ以外はそのまま
    result += char;
  }
  return result;
};

/**
 * 全角 → 半角
 * 対象：全角記号・英数字 (0xFF01-0xFF5E) + 全角スペース
 */
const toHankaku = (str: string): string => {
  let result = "";
  for (const char of str) {
    const code = char.charCodeAt(0);

    // 全角スペース -> 半角スペース
    if (code === 0x3000) {
      result += String.fromCharCode(0x20);
      continue;
    }

    // 全角 ASCII 記号・英数字 -> 半角
    if (code >= 0xff01 && code <= 0xff5e) {
      result += String.fromCharCode(code - 0xfee0);
      continue;
    }

    // それ以外はそのまま
    result += char;
  }
  return result;
};

const HankakuZenkakuPage = () => {
  const [mode, setMode] = useState<Mode>("toZenkaku");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = () => {
    if (!input) {
      setOutput("");
      return;
    }

    if (mode === "toZenkaku") {
      setOutput(toZenkaku(input));
    } else {
      setOutput(toHankaku(input));
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const inputLength = input.length;
  const outputLength = output.length;

  const placeholderInput =
    mode === "toZenkaku"
      ? "例: ABC 123 !?\n半角の英数字・記号・スペースを全角に変換します。"
      : "例: ＡＢＣ　１２３　！？\n全角の英数字・記号・スペースを半角に変換します。";

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="半角・全角 変換ツール"
          description="テキストの半角英数字・記号・スペースを全角に、または全角から半角に一括変換できます。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>変換モードを選択します（半角→全角、または全角→半角）。</li>
              <li>入力テキストエリアに変換したいテキストを貼り付けます。</li>
              <li>
                「変換」ボタンを押すと、出力テキストエリアに変換結果が表示されます。
              </li>
              <li>
                必要に応じて「クリア」ボタンで入力・出力をリセットできます。
              </li>
            </>
          }
        />

        {/* モード選択セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            変換モード
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-4">
              <label className="flex items-center text-sm md:text-base text-zinc-300">
                <input
                  type="radio"
                  value="toZenkaku"
                  checked={mode === "toZenkaku"}
                  onChange={() => {
                    setMode("toZenkaku");
                    setOutput("");
                  }}
                  className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
                />
                半角 → 全角
              </label>
              <label className="flex items-center text-sm md:text-base text-zinc-300">
                <input
                  type="radio"
                  value="toHankaku"
                  checked={mode === "toHankaku"}
                  onChange={() => {
                    setMode("toHankaku");
                    setOutput("");
                  }}
                  className="mr-1 bg-white/[0.02] border-white/10 text-zinc-100 focus:ring-zinc-500"
                />
                全角 → 半角
              </label>
            </div>
            <p className="text-xs text-zinc-500">
              対象:
              英数字・記号・スペースのみ変換します。ひらがな・カタカナ・漢字は変化しません。
            </p>
          </div>
        </section>

        {/* テキスト変換セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">
            テキスト変換
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 入力エリア */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-zinc-300 mb-2">
                入力テキスト
                <span className="ml-2 text-xs text-zinc-500">
                  文字数: {inputLength}
                </span>
              </label>
              <textarea
                rows={8}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-md p-2 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-y"
                placeholder={placeholderInput}
              />
            </div>

            {/* 出力エリア */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-zinc-300">
                  出力テキスト
                  <span className="ml-2 text-xs text-zinc-500">
                    文字数: {outputLength}
                  </span>
                </label>
                <CopyButton text={output} />
              </div>
              <textarea
                rows={8}
                value={output}
                readOnly
                className="w-full bg-white/[0.02] border border-white/10 rounded-md p-2 text-sm font-mono text-zinc-100 bg-zinc-800 resize-y"
                placeholder="変換結果がここに表示されます。"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleConvert}
              className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
            >
              変換
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-white/10 bg-white/[0.02] text-zinc-300 rounded-md hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
            >
              クリア
            </button>
          </div>
        </section>

        {/* 使用例セクション */}
        <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-3">使用例</h2>
          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>システム入力欄に合わせて半角英数字に統一する</li>
            <li>資料やメールで全角英数字に揃えたい場合に一括変換する</li>
            <li>スペースの全角・半角の混在を解消する</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HankakuZenkakuPage;
