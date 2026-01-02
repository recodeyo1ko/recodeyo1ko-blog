"use client";
import CopyButton from "../../components/CopyButton";
import ToolHeader from "@/app/components/ToolHeader";

import { useMemo, useState } from "react";

/** 改行種別 */
type NewlineKind = "LF" | "CRLF" | "CR" | "MIXED" | "NONE";

function detectNewlines(text: string): {
  kind: NewlineKind;
  counts: { crlf: number; lf: number; cr: number };
} {
  // まず CRLF を数える（重複カウント防止のため）
  const crlf = (text.match(/\r\n/g) ?? []).length;

  // CRLF を除外した上で LF / CR を数える
  const withoutCrlf = text.replace(/\r\n/g, "");
  const lf = (withoutCrlf.match(/\n/g) ?? []).length;
  const cr = (withoutCrlf.match(/\r/g) ?? []).length;

  const kindsUsed = [crlf > 0, lf > 0, cr > 0].filter(Boolean).length;

  let kind: NewlineKind = "NONE";
  if (kindsUsed === 0) kind = "NONE";
  else if (kindsUsed > 1) kind = "MIXED";
  else if (crlf > 0) kind = "CRLF";
  else if (lf > 0) kind = "LF";
  else if (cr > 0) kind = "CR";

  return { kind, counts: { crlf, lf, cr } };
}

function normalizeNewlines(text: string): string {
  // いったん全部 LF に寄せる
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function convertNewlines(
  text: string,
  to: Exclude<NewlineKind, "MIXED" | "NONE">
): string {
  const lfText = normalizeNewlines(text);
  if (to === "LF") return lfText;
  if (to === "CRLF") return lfText.replace(/\n/g, "\r\n");
  // to === "CR"
  return lfText.replace(/\n/g, "\r");
}

function badgeColor(kind: NewlineKind) {
  switch (kind) {
    case "LF":
      return "bg-green-100 text-green-800";
    case "CRLF":
      return "bg-blue-100 text-blue-800";
    case "CR":
      return "bg-yellow-100 text-yellow-800";
    case "MIXED":
      return "bg-red-100 text-red-800";
    case "NONE":
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function kindLabel(kind: NewlineKind) {
  switch (kind) {
    case "LF":
      return "LF（Linux/macOS）";
    case "CRLF":
      return "CRLF（Windows）";
    case "CR":
      return "CR（旧Macなど）";
    case "MIXED":
      return "混在（MIXED）";
    case "NONE":
      return "改行なし（NONE）";
  }
}

function calcLineCount(text: string) {
  if (!text) return 0;
  // LF基準で行数を推定（末尾改行があってもOK）
  const lf = normalizeNewlines(text);
  return lf.split("\n").length;
}

export default function NewlineToolPage() {
  const [input, setInput] = useState("");
  const [target, setTarget] =
    useState<Exclude<NewlineKind, "MIXED" | "NONE">>("LF");
  const [output, setOutput] = useState("");

  const info = useMemo(() => detectNewlines(input), [input]);

  const outputInfo = useMemo(() => detectNewlines(output), [output]);

  const lineCount = useMemo(() => calcLineCount(input), [input]);

  const handleConvert = () => {
    setOutput(convertNewlines(input, target));
  };
  const downloadAsTxt = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // テキスト系のみ（ざっくり）
    if (
      file.type &&
      !file.type.startsWith("text/") &&
      file.type !== "application/json" &&
      file.type !== "application/xml"
    ) {
      alert("テキストファイルを選択してください。");
      e.target.value = "";
      return;
    }

    const text = await file.text();
    setInput(text);
    setOutput("");
    e.target.value = "";
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-lg bg-gray-50 px-4 py-8">
      {/* タイトルと使い方 */}
      <ToolHeader
        title="改行コード 判定・変換ツール"
        description="テキストの改行コード（LF / CRLF /CR）を判定し、任意の形式に一括変換できます。"
        steps={
          <>
            <li>入力欄にテキストを貼り付け（またはファイルを選択）します。</li>
            <li>現在の改行状況（LF / CRLF / 混在）を自動判定します。</li>
            <li>変換先を選んで「変換」すると、結果が出ます。</li>
            <li>出力欄の内容はコピーや.txtダウンロードが可能です。</li>
          </>
        }
      />
      {/* 入力カード */}
      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">入力</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                info.kind
              )}`}
            >
              {kindLabel(info.kind)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">
              ファイルから読み込み（テキスト）
              <input
                type="file"
                accept=".txt,.md,.csv,.json,.log,.xml,.yml,.yaml,text/*,application/json,application/xml"
                onChange={onFileChange}
                className="ml-2 text-xs"
              />
            </label>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-gray-50 p-3 text-xs">
            <div className="text-gray-500">行数（推定）</div>
            <div className="mt-1 font-mono text-gray-800">
              {lineCount.toLocaleString()}
            </div>
          </div>
          <div className="rounded-md border bg-gray-50 p-3 text-xs">
            <div className="text-gray-500">CRLF</div>
            <div className="mt-1 font-mono text-gray-800">
              {info.counts.crlf.toLocaleString()}
            </div>
          </div>
          <div className="rounded-md border bg-gray-50 p-3 text-xs">
            <div className="text-gray-500">LF / CR</div>
            <div className="mt-1 font-mono text-gray-800">
              {info.counts.lf.toLocaleString()} /{" "}
              {info.counts.cr.toLocaleString()}
            </div>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここにテキストを貼り付けてください"
          className="mt-4 h-64 w-full rounded-md border border-gray-300 bg-white p-3 font-mono text-xs leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </section>
      {/* 操作 */}
      <section className="mb-6 rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-gray-800">変換</h2>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-700">
              変換先
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 md:w-64"
            >
              <option value="LF">LF（Linux/macOS）</option>
              <option value="CRLF">CRLF（Windows）</option>
              <option value="CR">CR（旧Macなど）</option>
            </select>

            <p className="text-xs text-gray-500">
              ※ 混在している場合も、選んだ形式に統一して出力します。
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleConvert}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              変換
            </button>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              クリア
            </button>
          </div>
        </div>
      </section>
      {/* 出力カード */}
      <section className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">出力</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                outputInfo.kind
              )}`}
            >
              {kindLabel(outputInfo.kind)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton text={output} />

            <button
              type="button"
              onClick={downloadAsTxt}
              disabled={!output}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              .txt ダウンロード
            </button>

            <button
              type="button"
              onClick={handleSwap}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              disabled={!output}
              title="出力を入力に戻す"
            >
              出力を入力へ
            </button>
          </div>
        </div>

        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="変換結果がここに表示されます"
          className="mt-4 h-64 w-full rounded-md border border-gray-300 bg-gray-50 p-3 font-mono text-xs leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <p className="mt-3 text-xs text-gray-500">
          ※ 出力欄も編集できます（追加修正してからコピーする用途）。
        </p>
      </section>
    </div>
  );
}
