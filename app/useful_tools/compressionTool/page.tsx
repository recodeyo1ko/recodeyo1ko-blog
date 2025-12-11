// app/useful_tools/compressionTool/page.tsx
"use client";

import { useCallback, useState } from "react";
import CommandHelpPanel from "./CommandHelpPanel";

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
    <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 font-mono text-[11px] whitespace-pre-wrap break-all">
      <div className="mb-1 text-[10px] text-gray-500">計算結果（正規化済み）</div>
      <div>{calcSpans}</div>

      <div className="mt-2 mb-1 text-[10px] text-gray-500">
        比較対象（正規化済み）
      </div>
      <div>{inputSpans}</div>

      <div className="mt-2 text-[10px] text-gray-500">
        ※ 空白除去・小文字化後の文字列を比較し、不一致箇所だけ赤くハイライトしています。
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
    <main className="mx-auto max-w-screen-md px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">
        クイック圧縮率チェッカー
      </h1>
      <p className="mb-3 text-sm text-gray-600">
        ファイルをドラッグ＆ドロップすると、圧縮率（gzip 想定）・推定展開サイズ・SHA-256
        ハッシュをその場で計測します。
      </p>

      {/* ▼ 1GB 制限の注意書き */}
      <div className="mb-4 rounded-md border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-800">
        このツールはブラウザ上で処理するため、
        <span className="font-semibold">1GB を超えるファイルは対象外</span>
        です。より大きなファイルや詳細情報が必要な場合は、ページ下部の
        「コマンド表」を参考に OS のコマンドで確認してください。
      </div>

      {/* ドロップゾーン */}
      <section
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400"
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
        <p className="text-sm font-semibold text-gray-700">
          ここにファイルをドラッグ＆ドロップ
        </p>
        <p className="mt-1 text-xs text-gray-500">
          クリックしてファイルを選択することもできます
        </p>
        {isProcessing && (
          <p className="mt-3 text-xs text-blue-600">計測中です…</p>
        )}
      </section>

      {!hasCompressionSupport && (
        <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
          このブラウザは <code>CompressionStream</code> に対応していないため、
          圧縮率（gzip）の計測はスキップされます。ハッシュ計算のみ実行されます。
        </div>
      )}

      {/* 結果表示 */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">計測結果</h2>

        {!result ? (
          <p className="text-sm text-gray-500">
            まだファイルが選択されていません。上のエリアにファイルをドロップしてください。
          </p>
        ) : (
          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ファイル名</span>
              <span className="font-mono text-gray-800">
                {result.fileName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">元サイズ</span>
              <span className="font-mono text-gray-800">
                {formatBytes(result.size)} ({result.size.toLocaleString()} B)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">推定展開サイズ</span>
              <span className="font-mono text-gray-800">
                {estimatedDecompressedSize !== null
                  ? `${formatBytes(
                      estimatedDecompressedSize
                    )} (${estimatedDecompressedSize.toLocaleString()} B)`
                  : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">gzip 圧縮後サイズ</span>
              <span className="font-mono text-gray-800">
                {result.compressedSize !== null
                  ? `${formatBytes(
                      result.compressedSize
                    )} (${result.compressedSize.toLocaleString()} B)`
                  : "ブラウザ未対応 / 計測不可"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">圧縮率</span>
              <span className="font-mono text-gray-800">
                {result.ratio !== null
                  ? `${(result.ratio * 100).toFixed(2)} %`
                  : "ブラウザ未対応 / 計測不可"}
              </span>
            </div>

            <div className="pt-2">
              <span className="block text-gray-500">SHA-256 ハッシュ</span>
              <div className="mt-1 break-all rounded-md bg-gray-50 px-2 py-1 font-mono text-xs text-gray-800">
                {result.hash ?? "-"}
              </div>
            </div>

            {result.error && (
              <div className="mt-2 rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700">
                エラー: {result.error}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ハッシュ値比較フォーム */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          ハッシュ値比較
        </h2>

        <p className="mb-2 text-xs text-gray-600">
          ダウンロードサイトに記載されているハッシュ値などを貼り付けて、
          上で計算した SHA-256 と一致しているかを確認できます。
          空白と大文字小文字は無視して比較します。
        </p>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              比較対象ハッシュ値（SHA-256 など）
            </label>
            <textarea
              className="h-16 w-full rounded-md border border-gray-300 px-2 py-1 text-xs font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="ここに比較したいハッシュ値を貼り付けてください"
              value={compareHashInput}
              onChange={(e) => setCompareHashInput(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-500">
              計算された SHA-256
            </div>
            <div className="break-all rounded-md bg-gray-50 px-2 py-1 font-mono text-[11px] text-gray-800">
              {result?.hash ?? "- ファイルを選択するとここに表示されます -"}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">比較結果</span>
            {hashStatus === "none" && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                入力が不足しています
              </span>
            )}
            {hashStatus === "match" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✅ 一致しています
              </span>
            )}
            {hashStatus === "mismatch" && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                ❌ 一致していません
              </span>
            )}
          </div>

          {result?.hash && compareHashInput.trim() && (
            renderHashDiff(result.hash, compareHashInput)
          )}
        </div>
      </section>

      {/* ▼ コマンド表コンポーネント */}
      <CommandHelpPanel />
    </main>
  );
}
