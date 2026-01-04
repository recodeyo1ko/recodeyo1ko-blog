"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FitMode = "幅に合わせる" | "高さに合わせる";
type PostcardMode = "なし" | "縦（100×148）" | "横（148×100）";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Pixelizer() {
  const [postcardMode, setPostcardMode] = useState<PostcardMode>("なし");
  const [postcardLongEdge, setPostcardLongEdge] = useState<number>(148); // 小さいほど粗い

  const [fileName, setFileName] = useState<string>("");
  const [srcUrl, setSrcUrl] = useState<string>("");
  const [pixelWidth, setPixelWidth] = useState<number>(96); // 小さいほど粗い
  const [scale, setScale] = useState<number>(6); // 出力表示の拡大率
  const [fitMode, setFitMode] = useState<FitMode>("幅に合わせる");
  const [status, setStatus] = useState<string>("画像を選択してください。");

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 取り込んだURLの後始末
  useEffect(() => {
    return () => {
      if (srcUrl) URL.revokeObjectURL(srcUrl);
    };
  }, [srcUrl]);

  const canProcess = useMemo(() => Boolean(srcUrl), [srcUrl]);

  function onPickFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("画像ファイルを選択してください。");
      return;
    }
    setStatus("読み込み中…");
    setFileName(file.name);

    // 既存URL破棄
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
  }

  function drawPixelated() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;

    // 出力用の「小さいキャンバスサイズ」を決める
    let smallW = 0;
    let smallH = 0;

    const longEdge = clamp(postcardLongEdge, 32, 512);

    if (postcardMode !== "なし") {
      // ポストカード比率：100×148（縦） / 148×100（横）
      const ratioW = postcardMode === "縦（100×148）" ? 100 : 148;
      const ratioH = postcardMode === "縦（100×148）" ? 148 : 100;

      // 長辺を longEdge に合わせて小サイズを決定
      if (ratioW >= ratioH) {
        // 横向き（長辺 = 幅）
        smallW = longEdge;
        smallH = Math.round((longEdge * ratioH) / ratioW);
      } else {
        // 縦向き（長辺 = 高さ）
        smallH = longEdge;
        smallW = Math.round((longEdge * ratioW) / ratioH);
      }
    } else {
      // 従来どおり：画像の比率に合わせて縮小
      if (fitMode === "幅に合わせる") {
        smallW = clamp(pixelWidth, 8, 512);
        smallH = Math.round((naturalH / naturalW) * smallW);
      } else {
        smallH = clamp(pixelWidth, 8, 512);
        smallW = Math.round((naturalW / naturalH) * smallH);
      }
    }

    smallW = Math.max(1, smallW);
    smallH = Math.max(1, smallH);

    // まずは「ポストカード（または通常）小キャンバス」に
    // 入力画像を"収める"（余白あり / contain）
    const off = document.createElement("canvas");
    off.width = smallW;
    off.height = smallH;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    offCtx.clearRect(0, 0, off.width, off.height);

    // 余白は透明（PNG保存で背景を残したい場合に便利）
    // 黒背景にしたい場合は "rgba(0,0,0,1)" に変更
    offCtx.fillStyle = "rgba(0,0,0,0)";
    offCtx.fillRect(0, 0, off.width, off.height);

    // contain で収める
    const imgRatio = naturalW / naturalH;
    const targetRatio = off.width / off.height;

    let drawW = off.width;
    let drawH = off.height;
    let dx = 0;
    let dy = 0;

    if (imgRatio > targetRatio) {
      // 画像が横長 → 幅いっぱい、上下に余白
      drawW = off.width;
      drawH = Math.round(off.width / imgRatio);
      dx = 0;
      dy = Math.round((off.height - drawH) / 2);
    } else {
      // 画像が縦長 → 高さいっぱい、左右に余白
      drawH = off.height;
      drawW = Math.round(off.height * imgRatio);
      dy = 0;
      dx = Math.round((off.width - drawW) / 2);
    }

    offCtx.imageSmoothingEnabled = true;
    offCtx.drawImage(img, dx, dy, drawW, drawH);

    // 出力用キャンバスに拡大（ピクセル感）
    const outScale = clamp(scale, 1, 20);
    canvas.width = off.width * outScale;
    canvas.height = off.height * outScale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

    if (postcardMode !== "なし") {
      setStatus(`変換しました（${smallW}×${smallH} をポストカード比率で出力）`);
    } else {
      setStatus(
        `変換しました（${off.width}×${off.height} → ${canvas.width}×${canvas.height}）`
      );
    }
  }

  // 画像読み込み完了時に描画
  useEffect(() => {
    if (!srcUrl) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawPixelated();
    };
    img.onerror = () => setStatus("画像の読み込みに失敗しました。");
    img.src = srcUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcUrl]);

  // パラメータ変更で再描画
  useEffect(() => {
    if (!canProcess) return;
    drawPixelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixelWidth, scale, fitMode, postcardMode, postcardLongEdge]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const a = document.createElement("a");
    const base = fileName ? fileName.replace(/\.[^/.]+$/, "") : "pixel";
    a.download = `${base}-pixel.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  function resetAll() {
    setFileName("");
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setSrcUrl("");

    setPostcardMode("なし");
    setPostcardLongEdge(148);

    setPixelWidth(96);
    setScale(6);
    setFitMode("幅に合わせる");
    setStatus("画像を選択してください。");

    imgRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <section className="rounded-md border border-white/10 bg-white/[0.02]">
      {/* 上部：見出し行 */}
      <div className="border-b border-white/10 px-4 py-3 md:px-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold">設定</div>
            <div className="text-xs text-zinc-400">{status}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/[0.05]"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={downloadPng}
              disabled={!canProcess}
              className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
            >
              PNGで保存
            </button>
          </div>
        </div>
      </div>

      {/* 行UI */}
      <div className="divide-y divide-white/10">
        {/* 行：画像 */}
        <div className="group flex flex-col gap-3 px-4 py-4 hover:bg-white/[0.05] md:flex-row md:items-center md:px-5">
          <div className="w-full md:w-56">
            <div className="text-sm font-semibold">画像</div>
            <div className="text-xs text-zinc-400">PNG / JPG / WebP など</div>
          </div>

          <div className="flex w-full items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/[0.05]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
              画像を選択
            </label>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-300">
                {fileName ? fileName : "未選択"}
              </div>
              {srcUrl ? (
                <div className="text-xs text-zinc-500">選択済み</div>
              ) : (
                <div className="text-xs text-zinc-500">
                  画像を選択すると自動で変換します
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 行：出力サイズ */}
        <div className="group flex flex-col gap-3 px-4 py-4 hover:bg-white/[0.05] md:flex-row md:items-center md:px-5">
          <div className="w-full md:w-56">
            <div className="text-sm font-semibold">出力サイズ</div>
            <div className="text-xs text-zinc-400">
              縦向き・横向きを選べます
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {(["なし", "縦（100×148）", "横（148×100）"] as const).map(
                (m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPostcardMode(m)}
                    disabled={!canProcess}
                    className={[
                      "rounded-md border px-3 py-1.5 text-sm hover:bg-white/[0.05] disabled:opacity-50",
                      m === postcardMode
                        ? "border-white/20 bg-white/[0.04] text-zinc-100"
                        : "border-white/10 bg-white/[0.02] text-zinc-200",
                    ].join(" ")}
                  >
                    {m === "なし"
                      ? "通常"
                      : m === "縦（100×148）"
                      ? "ポストカード（縦）"
                      : "ポストカード（横）"}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={32}
                max={256}
                value={postcardLongEdge}
                onChange={(e) =>
                  setPostcardLongEdge(parseInt(e.target.value, 10))
                }
                disabled={!canProcess || postcardMode === "なし"}
                className="w-full accent-zinc-200 disabled:opacity-50"
              />
              <div className="w-16 text-right text-sm text-zinc-300">
                {postcardLongEdge}
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              値を小さくすると粗くなります
            </div>
          </div>
        </div>

        {/* 行：粗さ */}
        <div className="group flex flex-col gap-3 px-4 py-4 hover:bg-white/[0.05] md:flex-row md:items-center md:px-5">
          <div className="w-full md:w-56">
            <div className="text-sm font-semibold">粗さ</div>
            <div className="text-xs text-zinc-400">小さいほど粗くなります</div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={8}
                max={256}
                value={pixelWidth}
                onChange={(e) => setPixelWidth(parseInt(e.target.value, 10))}
                disabled={!canProcess || postcardMode !== "なし"}
                className="w-full accent-zinc-200 disabled:opacity-50"
              />
              <div className="w-16 text-right text-sm text-zinc-300">
                {pixelWidth}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["幅に合わせる", "高さに合わせる"] as FitMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFitMode(m)}
                  disabled={!canProcess || postcardMode !== "なし"}
                  className={[
                    "rounded-md border px-3 py-1.5 text-sm hover:bg-white/[0.05] disabled:opacity-50",
                    m === fitMode
                      ? "border-white/20 bg-white/[0.04] text-zinc-100"
                      : "border-white/10 bg-white/[0.02] text-zinc-200",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </div>

            {postcardMode !== "なし" ? (
              <div className="text-xs text-zinc-500">
                ポストカード選択中は「粗さ」は出力サイズの値で調整します
              </div>
            ) : null}
          </div>
        </div>

        {/* 行：拡大率 */}
        <div className="group flex flex-col gap-3 px-4 py-4 hover:bg-white/[0.05] md:flex-row md:items-center md:px-5">
          <div className="w-full md:w-56">
            <div className="text-sm font-semibold">拡大率</div>
            <div className="text-xs text-zinc-400">
              見た目のサイズだけ変えます
            </div>
          </div>

          <div className="flex w-full items-center gap-3">
            <input
              type="range"
              min={1}
              max={16}
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value, 10))}
              disabled={!canProcess}
              className="w-full accent-zinc-200 disabled:opacity-50"
            />
            <div className="w-16 text-right text-sm text-zinc-300">
              ×{scale}
            </div>
          </div>
        </div>

        {/* 行：出力 */}
        <div className="px-4 py-4 md:px-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold">出力</div>
              <div className="text-xs text-zinc-400">
                キャンバスを右クリックでコピーもできます
              </div>
            </div>
          </div>

          <div className="mt-3 overflow-auto rounded-md border border-white/10 bg-white/[0.02] p-3">
            <canvas ref={canvasRef} className="block h-auto max-w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
