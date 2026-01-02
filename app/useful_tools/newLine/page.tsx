"use client";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";
import CopyButton from "../../components/CopyButton";
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
      return "bg-zinc-100 text-zinc-700";
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
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="改行コード変換ツール"
          description="テキストの改行コードを、LF・CRLF・CRのいずれかに変換します。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>
                テキストを入力欄に貼り付けるか、ファイルから読み込みます。
              </li>
              <li>現在の改行コード種別と行数が表示されます。</li>
              <li>変換先の改行コードを選択し、「変換」ボタンを押します。</li>
              <li>
                変換結果が出力欄に表示されるので、必要に応じてコピー・ダウンロードします。
              </li>
            </>
          }
        />

        {/* 入力セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-zinc-100">入力</h2>
            <span
              className={`rounded-md px-3 py-1 text-xs font-semibold ${badgeColor(
                info.kind
              )}`}
            >
              {kindLabel(info.kind)}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm text-zinc-400">
              ファイルから読み込み（テキスト）
              <input
                type="file"
                accept=".txt,.md,.csv,.json,.log,.xml,.yml,.yaml,text/*,application/json,application/xml"
                onChange={onFileChange}
                className="ml-2 text-sm bg-transparent text-zinc-100"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.02] p-4 rounded-md border border-white/10 hover:bg-white/[0.05]">
              <div className="text-sm text-zinc-500">行数（推定）</div>
              <div className="text-lg font-mono text-zinc-100">
                {lineCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/[0.02] p-4 rounded-md border border-white/10 hover:bg-white/[0.05]">
              <div className="text-sm text-zinc-500">CRLF</div>
              <div className="text-lg font-mono text-zinc-100">
                {info.counts.crlf.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/[0.02] p-4 rounded-md border border-white/10 hover:bg-white/[0.05]">
              <div className="text-sm text-zinc-500">LF / CR</div>
              <div className="text-lg font-mono text-zinc-100">
                {info.counts.lf.toLocaleString()} /{" "}
                {info.counts.cr.toLocaleString()}
              </div>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにテキストを貼り付けてください"
            className="w-full h-64 p-4 bg-white/[0.02] border border-white/10 rounded-md font-mono text-sm leading-relaxed text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </section>

        {/* 変換セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">変換</h2>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                変換先
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full md:w-64 p-2 bg-white/[0.02] border border-white/10 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                <option value="LF">LF（Linux/macOS）</option>
                <option value="CRLF">CRLF（Windows）</option>
                <option value="CR">CR（旧Macなど）</option>
              </select>
              <p className="text-xs text-zinc-500 mt-1">
                ※ 混在している場合も、選んだ形式に統一して出力します。
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConvert}
                className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                変換
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                className="px-4 py-2 border border-white/10 bg-white/[0.02] text-zinc-300 rounded-md hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                クリア
              </button>
            </div>
          </div>
        </section>

        {/* 出力セクション */}
        <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-zinc-100">出力</h2>
              <span
                className={`rounded-md px-3 py-1 text-xs font-semibold ${badgeColor(
                  outputInfo.kind
                )}`}
              >
                {kindLabel(outputInfo.kind)}
              </span>
            </div>

            <div className="flex gap-2">
              <CopyButton text={output} />
              <button
                type="button"
                onClick={downloadAsTxt}
                disabled={!output}
                className="px-3 py-1 border border-white/10 bg-white/[0.02] text-zinc-300 rounded-md hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 text-sm"
              >
                .txt ダウンロード
              </button>
              <button
                type="button"
                onClick={handleSwap}
                className="px-3 py-1 border border-white/10 bg-white/[0.02] text-zinc-300 rounded-md hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 text-sm"
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
            className="w-full h-64 p-4 bg-white/[0.02] border border-white/10 rounded-md font-mono text-sm leading-relaxed text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />

          <p className="mt-4 text-sm text-zinc-500">
            ※ 出力欄も編集できます（追加修正してからコピーする用途）。
          </p>
        </section>
      </div>
    </div>
  );
}
