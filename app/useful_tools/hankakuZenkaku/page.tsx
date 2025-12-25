"use client";

import { useState } from "react";

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

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert("出力結果をコピーしました。");
    } catch {
      alert(
        "クリップボードにコピーできませんでした。ブラウザの設定を確認してください。"
      );
    }
  };

  const inputLength = input.length;
  const outputLength = output.length;

  const placeholderInput =
    mode === "toZenkaku"
      ? "例: ABC 123 !?\n半角の英数字・記号・スペースを全角に変換します。"
      : "例: ＡＢＣ　１２３　！？\n全角の英数字・記号・スペースを半角に変換します。";

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">半角・全角変換ツール</h1>

      <div className="w-full max-w-4xl space-y-6">
        {/* 📦 モード選択ボックス */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">変換モード</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex gap-4">
              <label className="flex items-center text-sm md:text-base">
                <input
                  type="radio"
                  value="toZenkaku"
                  checked={mode === "toZenkaku"}
                  onChange={() => {
                    setMode("toZenkaku");
                    // モード変更時に出力は一旦クリア
                    setOutput("");
                  }}
                  className="mr-1"
                />
                半角 → 全角
              </label>
              <label className="flex items-center text-sm md:text-base">
                <input
                  type="radio"
                  value="toHankaku"
                  checked={mode === "toHankaku"}
                  onChange={() => {
                    setMode("toHankaku");
                    setOutput("");
                  }}
                  className="mr-1"
                />
                全角 → 半角
              </label>
            </div>
            <p className="text-xs text-gray-600">
              対象:
              英数字・記号・スペースのみ変換します。ひらがな・カタカナ・漢字は変化しません。
            </p>
          </div>
        </section>

        {/* 📦 入力／出力ボックス */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">テキスト変換</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 入力エリア */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">
                入力テキスト
                <span className="ml-2 text-xs text-gray-500">
                  文字数: {inputLength}
                </span>
              </label>
              <textarea
                rows={8}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border rounded-md p-2 text-sm font-mono resize-y"
                placeholder={placeholderInput}
              />
            </div>

            {/* 出力エリア */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  出力テキスト
                  <span className="ml-2 text-xs text-gray-500">
                    文字数: {outputLength}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!output}
                  className={`text-xs px-3 py-1 rounded border ${
                    output
                      ? "bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  コピー
                </button>
              </div>
              <textarea
                rows={8}
                value={output}
                readOnly
                className="w-full border rounded-md p-2 text-sm font-mono bg-gray-50 resize-y"
                placeholder="変換結果がここに表示されます。"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleConvert}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
            >
              変換
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm"
            >
              クリア
            </button>
          </div>
        </section>

        {/* 📦 使い方ボックス（不要なら削除OK） */}
        <section className="border rounded-lg shadow-sm bg-white p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-3">使用例</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
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
