// app/useful_tools/compressionTool/page.tsx
"use client";

import { useCallback, useState } from "react";
import CommandHelpPanel from "./_components/CommandHelpPanel";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

type CompressionResult = {
  fileName: string;
  size: number; // 元サイズ（バイト）
  compressedSize: number | null; // gzip 圧縮後サイズ（バイト）
  ratio: number | null; // compressedSize / size
  hash: string | null; // SHA-256
  error?: string;
};

const MAX_SIZE = 1 * 1024 * 1024 * 1024; // 1GB

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(2)} ${units[i]}`;
}

async function calcSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// gzip 圧縮してサイズだけ取得（CompressionStream 未対応なら null）
async function compressWithGzip(file: File): Promise<number | null> {
  try {
    const CS: any = (globalThis as any).CompressionStream;
    if (!CS || typeof (file as any).stream !== "function") {
      return null; // 未対応環境
    }

    const compressionStream = new CS("gzip");
    const stream = (file as any).stream().pipeThrough(compressionStream);
    const reader = stream.getReader();

    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) total += value.byteLength;
    }
    return total;
  } catch (err) {
    console.error("compressWithGzip error:", err);
    return null;
  }
}

// 入力されたハッシュと計算結果の比較（空白・大文字小文字無視）
function compareHash(calculated: string | null, input: string) {
  const normalizedCalc = normalizeHashForCompare(calculated ?? "");
  const normalizedInput = normalizeHashForCompare(input);

  if (!normalizedCalc || !normalizedInput) return "none" as const;
  return normalizedCalc === normalizedInput ? "match" : "mismatch";
}

// 比較用に正規化（空白削除 + 小文字化）
function normalizeHashForCompare(str: string) {
  return str.replace(/\s+/g, "").toLowerCase();
}

// 上下に並べて、不一致箇所をハイライトして表示
function renderHashDiff(
  calculated: string | null,
  input: string
): JSX.Element | null {
  const a = normalizeHashForCompare(calculated ?? "");
  const b = normalizeHashForCompare(input ?? "");

  if (!a || !b) return null;

  const maxLen = Math.max(a.length, b.length);

  const calcSpans: JSX.Element[] = [];
  const inputSpans: JSX.Element[] = [];

  for (let i = 0; i < maxLen; i++) {
    const ca = a[i] ?? "";
    const cb = b[i] ?? "";

    const mismatch = ca !== cb;

    calcSpans.push(
      <span
        key={`calc-${i}`}
        className={
          "px-[1px]" +
          (mismatch && ca ? " bg-red-200 text-red-900 rounded" : "")
        }
      >
        {ca || "·"}
      </span>
    );

    inputSpans.push(
      <span
        key={`input-${i}`}
        className={
          "px-[1px]" +
          (mismatch && cb ? " bg-red-200 text-red-900 rounded" : "")
        }
      >
        {cb || "·"}
      </span>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-white/10 bg-white/[0.02] px-2 py-2 font-mono text-[11px] whitespace-pre-wrap break-all">
      <div className="mb-1 text-[10px] text-zinc-500">
        計算結果（正規化済み）
      </div>
      <div>{calcSpans}</div>

      <div className="mt-2 mb-1 text-[10px] text-zinc-500">
        比較対象（正規化済み）
      </div>
      <div>{inputSpans}</div>

      <div className="mt-2 text-[10px] text-zinc-500">
        ※
        空白除去・小文字化後の文字列を比較し、不一致箇所だけ赤くハイライトしています。
        一致しない位置は「·」で穴あき表示されます。
      </div>
    </div>
  );
}

export default function CompressionToolPage() {
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ハッシュ比較用入力
  const [compareHashInput, setCompareHashInput] = useState("");

  const handleFile = useCallback(async (file: File) => {
    const size = file.size;

    // ▼ 1GB 超えは処理しない
    if (size > MAX_SIZE) {
      setResult({
        fileName: file.name,
        size,
        compressedSize: null,
        ratio: null,
        hash: null,
        error: `1GB を超えるファイルはブラウザ上での計測対象外です (${formatBytes(
          size
        )})。大きなファイルは下部のコマンド表を参考に OS のコマンドで確認してください。`,
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // 並列で処理（ハッシュ計算 & 圧縮）
      const [hash, compressedSize] = await Promise.all([
        calcSHA256(file),
        compressWithGzip(file),
      ]);

      let ratio: number | null = null;
      if (compressedSize !== null && size > 0) {
        ratio = compressedSize / size;
      }

      setResult({
        fileName: file.name,
        size,
        compressedSize,
        ratio,
        hash,
      });
    } catch (e: any) {
      setResult({
        fileName: file.name,
        size: file.size,
        compressedSize: null,
        ratio: null,
        hash: null,
        error: e?.message ?? "計測中にエラーが発生しました。",
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (!e.dataTransfer?.files?.length) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      void handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFile(file);
      e.target.value = "";
    }
  };

  const hasCompressionSupport =
    typeof (globalThis as any).CompressionStream !== "undefined";

  const estimatedDecompressedSize =
    result && result.size > 0 ? result.size : null; // 今回は元サイズを「展開サイズ」として表示

  // ハッシュ比較ステータス
  const hashStatus = compareHash(result?.hash ?? null, compareHashInput);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="ファイル圧縮率＆ハッシュ計測ツール"
          description="ファイルをドラッグ＆ドロップするだけで、gzip 圧縮後のサイズと圧縮率、SHA-256 ハッシュをブラウザ上で計測します。大きなファイルも高速に処理可能です。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>
                上のエリアにファイルをドラッグ＆ドロップ、またはクリックして選択します。
              </li>
              <li>
                ファイルの元サイズ、gzip 圧縮後サイズ、圧縮率、SHA-256
                ハッシュが表示されます。
              </li>
              <li>
                下部の入力欄にハッシュ値を貼り付けると、計算結果と一致しているか確認できます。
              </li>
            </>
          }
        />

        {/* ドロップゾーン */}
        <section
          className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-10 text-center transition ${
            dragOver
              ? "border-zinc-500 bg-white/[0.05]"
              : "border-white/10 bg-white/[0.02] hover:border-zinc-400"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={onFileInputChange}
          />
          <p className="text-sm font-semibold text-zinc-300">
            ここにファイルをドラッグ＆ドロップ
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            クリックしてファイルを選択することもできます
          </p>
          {isProcessing && (
            <p className="mt-3 text-xs text-zinc-400">計測中です…</p>
          )}
        </section>

        {!hasCompressionSupport && (
          <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-100 px-3 py-2 text-xs text-yellow-800">
            このブラウザは <code>CompressionStream</code> に対応していないため、
            圧縮率（gzip）の計測はスキップされます。ハッシュ計算のみ実行されます。
          </div>
        )}

        {/* 結果表示 */}
        <section className="mb-8 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">計測結果</h2>

          {!result ? (
            <p className="text-sm text-zinc-500">
              まだファイルが選択されていません。上のエリアにファイルをドロップしてください。
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">ファイル名</span>
                <span className="font-mono text-zinc-100">
                  {result.fileName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">元サイズ</span>
                <span className="font-mono text-zinc-100">
                  {formatBytes(result.size)} ({result.size.toLocaleString()} B)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">推定展開サイズ</span>
                <span className="font-mono text-zinc-100">
                  {estimatedDecompressedSize !== null
                    ? `${formatBytes(
                        estimatedDecompressedSize
                      )} (${estimatedDecompressedSize.toLocaleString()} B)`
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">gzip 圧縮後サイズ</span>
                <span className="font-mono text-zinc-100">
                  {result.compressedSize !== null
                    ? `${formatBytes(
                        result.compressedSize
                      )} (${result.compressedSize.toLocaleString()} B)`
                    : "ブラウザ未対応 / 計測不可"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">圧縮率</span>
                <span className="font-mono text-zinc-100">
                  {result.ratio !== null
                    ? `${(result.ratio * 100).toFixed(2)} %`
                    : "ブラウザ未対応 / 計測不可"}
                </span>
              </div>

              <div className="pt-2">
                <span className="block text-zinc-500">SHA-256 ハッシュ</span>
                <div className="mt-1 break-all rounded-md bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-xs text-zinc-100">
                  {result.hash ?? "-"}
                </div>
              </div>

              {result.error && (
                <div className="mt-2 rounded-md border border-red-300 bg-red-100 px-2 py-1 text-xs text-red-800">
                  エラー: {result.error}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ハッシュ値比較フォーム */}
        <section className="mb-10 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">
            ハッシュ値比較
          </h2>

          <p className="mb-2 text-xs text-zinc-500">
            ダウンロードサイトに記載されているハッシュ値などを貼り付けて、
            上で計算した SHA-256 と一致しているかを確認できます。
            空白と大文字小文字は無視して比較します。
          </p>

          <div className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-300">
                比較対象ハッシュ値（SHA-256 など）
              </label>
              <textarea
                className="h-16 w-full rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-xs font-mono text-zinc-100 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                placeholder="ここに比較したいハッシュ値を貼り付けてください"
                value={compareHashInput}
                onChange={(e) => setCompareHashInput(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1 text-xs text-zinc-500">
                計算された SHA-256
              </div>
              <div className="break-all rounded-md bg-white/[0.02] border border-white/10 px-2 py-1 font-mono text-[11px] text-zinc-100">
                {result?.hash ?? "- ファイルを選択するとここに表示されます -"}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">比較結果</span>
              {hashStatus === "none" && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-800">
                  入力が不足しています
                </span>
              )}
              {hashStatus === "match" && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  ✅ 一致しています
                </span>
              )}
              {hashStatus === "mismatch" && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                  ❌ 一致していません
                </span>
              )}
            </div>

            {result?.hash &&
              compareHashInput.trim() &&
              renderHashDiff(result.hash, compareHashInput)}
          </div>
        </section>

        {/* ▼ コマンド表コンポーネント */}
        <CommandHelpPanel />
      </div>
    </div>
  );
}
