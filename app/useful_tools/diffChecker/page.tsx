// app/useful_tools/diffTool/page.tsx
"use client";

import { useRef, useState } from "react";
import {
  calcTextStats,
  diffChars,
  TextStats,
  CharDiffResult,
} from "./_components/diffUtils";
import TextAreaWithStats from "./_components/TextAreaWithStats";
import DiffViewer from "./_components/DiffViewer";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

function RowButton({
  title,
  subtitle,
  onClick,
  disabled,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full text-left",
        "rounded-md px-3 py-2",
        "border border-white/10 bg-white/[0.02]",
        "hover:bg-white/[0.05] transition-colors",
        "disabled:opacity-40 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-zinc-200">{title}</span>
        {subtitle ? (
          <span className="text-xs text-zinc-500">{subtitle}</span>
        ) : null}
      </div>
    </button>
  );
}

function MetaRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-4 px-3 py-2 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm text-zinc-200 tabular-nums">{value}</div>
    </div>
  );
}

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
  const [exporting, setExporting] = useState(false);

  const exportRef = useRef<HTMLDivElement | null>(null);

  const handleCompare = () => {
    setDiffResult(diffChars(beforeText, afterText));
  };

  const handleExportPdf = async () => {
    if (!exportRef.current || !diffResult) return;

    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // ① exportRef を複製して、PDF用の見た目をCSSで強制する
      const clone = exportRef.current.cloneNode(true) as HTMLElement;
      clone.classList.add("pdf-export-root");

      // ② PDF用CSS（白背景・黒文字・差分だけ赤背景）
      const style = document.createElement("style");
      style.textContent = `
  /* PDF全体：白背景・黒文字 */
  .pdf-export-root{
    background:#ffffff !important;
    color:#111111 !important;
    padding:16px !important;
  }
  .pdf-export-root *{
    color:#111111 !important;
    border-color:#e5e7eb !important;
  }
  .pdf-export-root pre{
    color:#111111 !important;
    line-height: 1.7 !important;
  }

  /* ここが本題：差分に「マーカー」ハイライト（文字にかぶせる） */
  .pdf-export-root span[data-kind="delete"],
  .pdf-export-root span[data-kind="insert"]{
    position: relative !important;
    display: inline-block !important;
    vertical-align: baseline !important;
    padding: 0 1px !important;     /* 文字幅だけ少し広げる */
    border-radius: 2px !important; /* 角丸は小さめ */
    background: transparent !important; /* 背景塗りはしない */
  }

  /* マーカー（赤い帯） */
  .pdf-export-root span[data-kind="delete"]::before,
  .pdf-export-root span[data-kind="insert"]::before{
    content: "" !important;
    position: absolute !important;
    left: -1px !important;
    right: -1px !important;

    /* 文字に「かぶさる」位置調整：帯を少し上に寄せる */
    bottom: 0.15em !important;

    /* マーカーの太さ（ここを調整） */
    height: 0.95em !important;

    /* 赤ハイライト（薄め） */
    background: rgba(239, 68, 68, 0.28) !important;

    /* マーカーっぽい丸み */
    border-radius: 2px !important;

    /* 文字の下に敷く */
    z-index: -1 !important;
  }

  /* 連続する差分でも自然になる */
  .pdf-export-root span[data-kind="delete"],
  .pdf-export-root span[data-kind="insert"]{
    box-decoration-break: clone !important;
    -webkit-box-decoration-break: clone !important;
  }
`;

      // ③ 画面外に置いてレンダリングさせる
      const sandbox = document.createElement("div");
      sandbox.style.position = "fixed";
      sandbox.style.left = "-10000px";
      sandbox.style.top = "0";
      sandbox.style.width = `${exportRef.current.offsetWidth}px`;
      sandbox.style.zIndex = "-1";
      sandbox.appendChild(style);
      sandbox.appendChild(clone);
      document.body.appendChild(sandbox);

      // ④ クローンをキャプチャ（背景は白で固定）
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // 後片付け
      document.body.removeChild(sandbox);

      // ⑤ PDF化（複数ページ対応）
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const now = new Date();
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      pdf.save(`差分結果-${y}${mo}${d}-${hh}${mm}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <ToolHeader
          title="差分チェッカー"
          description="2つのテキストを文字単位で比較し、差分のみを控えめにハイライト表示します。"
          stepsVariant="ordered"
          className="mb-10"
          steps={
            <>
              <li>Before / After にテキストを入力（または貼り付け）します。</li>
              <li>「差分を比較」をクリックします。</li>
              <li>必要に応じて「PDFにエクスポート」で保存します。</li>
            </>
          }
        />

        {/* 画面全体の枠（薄い面＋薄い境界） */}
        <div className="rounded-md border border-white/10 bg-white/[0.02] overflow-hidden">
          {/* 見出し行 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="text-sm font-semibold text-zinc-200">差分比較</div>
            <div className="text-xs text-zinc-500">文字単位</div>
          </div>

          <div className="p-4 space-y-4">
            {/* 入力 */}
            <div className="grid md:grid-cols-2 gap-4">
              <TextAreaWithStats
                label="Before（元テキスト）"
                placeholder="ここに元のテキストを入力"
                value={beforeText}
                onChange={(value) => {
                  setBeforeText(value);
                  setBeforeStats(calcTextStats(value));
                }}
                statsLabel="統計"
                stats={beforeStats}
              />

              <TextAreaWithStats
                label="After（変更後）"
                placeholder="ここに変更後のテキストを入力"
                value={afterText}
                onChange={(value) => {
                  setAfterText(value);
                  setAfterStats(calcTextStats(value));
                }}
                statsLabel="統計"
                stats={afterStats}
              />
            </div>

            {/* 操作（行UI） */}
            <div className="grid md:grid-cols-2 gap-3">
              <RowButton
                title="差分を比較"
                subtitle="比較を実行"
                onClick={handleCompare}
              />
              <RowButton
                title={exporting ? "PDFを作成中…" : "PDFにエクスポート"}
                subtitle="結果をPDFとして保存"
                onClick={handleExportPdf}
                disabled={!diffResult || exporting}
              />
            </div>

            {/* 統計（プロパティ行） */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-xs text-zinc-500 px-1">Before の統計</div>
                <MetaRow
                  label="文字数（空白・改行除く）"
                  value={beforeStats.charCount}
                />
                <MetaRow label="空白数" value={beforeStats.spaceCount} />
                <MetaRow label="改行数" value={beforeStats.newlineCount} />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-zinc-500 px-1">After の統計</div>
                <MetaRow
                  label="文字数（空白・改行除く）"
                  value={afterStats.charCount}
                />
                <MetaRow label="空白数" value={afterStats.spaceCount} />
                <MetaRow label="改行数" value={afterStats.newlineCount} />
              </div>
            </div>

            {/* 結果（PDF化対象） */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="text-sm font-semibold text-zinc-200">
                  差分結果
                </div>
                <div className="text-xs text-zinc-500">差分のみハイライト</div>
              </div>

              <div
                ref={exportRef}
                className="rounded-md border border-white/10 bg-white/[0.02]"
              >
                <DiffViewer result={diffResult} />
              </div>
            </div>
          </div>

          {/* フッター（余計な説明は入れない） */}
          <div className="px-4 py-3 border-t border-white/10 text-xs text-zinc-500">
            © 差分チェッカー
          </div>
        </div>
      </div>
    </div>
  );
}
