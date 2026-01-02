"use client";

import { useEffect, useMemo, useState } from "react";
// 既に CopyButton がある前提（パスはあなたの構成に合わせて調整）
import CopyButton from "@/app/components/CopyButton";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";

type DrawMode = "shuffle" | "winners";

type HistoryItem = {
  id: string;
  createdAt: number;
  mode: DrawMode;
  winners: string[];
  ordered?: string[];
  allowDuplicates: boolean;
  count: number;
};

const STORAGE_KEY = "useful_tools_lottery_history_v1";

/** cryptoベースの安全寄り乱数（0..maxExclusive-1） */
function cryptoRandInt(maxExclusive: number) {
  if (maxExclusive <= 0) return 0;
  const arr = new Uint32Array(1);
  const maxUint = 0xffffffff;
  // バイアス回避：採用可能な最大値まで捨てる
  const limit = Math.floor((maxUint + 1) / maxExclusive) * maxExclusive;
  let x = 0;
  do {
    crypto.getRandomValues(arr);
    x = arr[0];
  } while (x >= limit);
  return x % maxExclusive;
}

/** Fisher–Yates */
function shuffle<T>(input: T[]) {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = cryptoRandInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeList(raw: string) {
  return raw
    .split(/\r\n|\n|\r/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function LotteryPage() {
  const [text, setText] = useState("");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [winnerCount, setWinnerCount] = useState(1);

  const [shuffled, setShuffled] = useState<string[] | null>(null);
  const [winners, setWinners] = useState<string[] | null>(null);
  const [remaining, setRemaining] = useState<string[] | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [saveHistory, setSaveHistory] = useState(true);

  const candidates = useMemo(() => normalizeList(text), [text]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as HistoryItem[];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    if (!saveHistory) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
    } catch {
      // noop
    }
  }, [history, saveHistory]);

  const canRun = candidates.length > 0;
  const maxWithoutDup = candidates.length;

  const handleShuffle = () => {
    if (!canRun) return;
    const ordered = shuffle(candidates);
    setShuffled(ordered);
    setWinners(null);

    if (saveHistory) {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        mode: "shuffle",
        winners: [],
        ordered,
        allowDuplicates,
        count: 0,
      };
      setHistory((prev) => [item, ...prev].slice(0, 50));
    }
  };

  const handleDraw = () => {
    if (!canRun) return;

    // ① 重複なし：候補をシャッフルして先頭N
    if (!allowDuplicates) {
      const n = Math.min(Math.max(1, winnerCount), maxWithoutDup);
      const ordered = shuffle(candidates);
      const picked = ordered.slice(0, n);
      setWinners(picked);
      setShuffled(ordered);

      if (saveHistory) {
        const item: HistoryItem = {
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          mode: "winners",
          winners: picked,
          ordered,
          allowDuplicates: false,
          count: n,
        };
        setHistory((prev) => [item, ...prev].slice(0, 50));
      }
      return;
    }

    // ② 重複あり：毎回ランダム抽選をN回
    const n = Math.min(Math.max(1, winnerCount), 999);
    const picked: string[] = [];
    for (let i = 0; i < n; i++) {
      const idx = cryptoRandInt(candidates.length);
      picked.push(candidates[idx]);
    }
    setWinners(picked);
    setShuffled(null);

    if (saveHistory) {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        mode: "winners",
        winners: picked,
        allowDuplicates: true,
        count: n,
      };
      setHistory((prev) => [item, ...prev].slice(0, 50));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  };

  const resultText = useMemo(() => {
    const lines: string[] = [];
    if (winners && winners.length > 0) {
      lines.push("【当選者】");
      winners.forEach((w, i) => lines.push(`${i + 1}. ${w}`));
      lines.push("");
    }
    if (shuffled && shuffled.length > 0) {
      lines.push("【シャッフル結果】");
      shuffled.forEach((x, i) => lines.push(`${i + 1}. ${x}`));
    }
    return lines.join("\n").trim();
  }, [winners, shuffled]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ToolHeader
          title="抽選・シャッフルツール"
          description="候補リストからランダムに当選者を抽選したり、順番をシャッフルしたりするツールです。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>候補リストに名前や項目を1行ずつ入力します。</li>
              <li>当選人数を指定し、重複の有無を設定します。</li>
              <li>
                「シャッフル」ボタンで順番をランダム化、
                「抽選」ボタンで当選者を決定します。
              </li>
              <li>
                結果は下部に表示され、コピーも可能です。履歴も保存できます。
              </li>
            </>
          }
        />

        {/* 入力セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-100">候補リスト</h2>
            <div className="text-sm text-zinc-500">{candidates.length} 件</div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"例）\n佐藤\n鈴木\n高橋\n…"}
            className="w-full h-40 resize-y rounded-md bg-white/[0.02] border border-white/10 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white/[0.02] rounded-md border border-white/10 p-4 hover:bg-white/[0.05]">
              <div className="text-sm font-semibold text-zinc-300">
                当選人数
              </div>
              <input
                type="number"
                min={1}
                max={allowDuplicates ? 999 : Math.max(1, maxWithoutDup)}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Number(e.target.value))}
                className="mt-2 w-full rounded-md bg-white/[0.02] border border-white/10 px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              {!allowDuplicates && (
                <div className="mt-2 text-xs text-zinc-500">
                  重複なしの場合、最大 {maxWithoutDup} 人まで
                </div>
              )}
            </div>

            <div className="bg-white/[0.02] rounded-md border border-white/10 p-4 hover:bg-white/[0.05]">
              <div className="text-sm font-semibold text-zinc-300">設定</div>
              <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="rounded border-white/10 bg-white/[0.02] text-zinc-100 focus:ring-zinc-500"
                />
                重複を許可する（同じ人が複数回当選OK）
              </label>

              <label className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={saveHistory}
                  onChange={(e) => setSaveHistory(e.target.checked)}
                  className="rounded border-white/10 bg-white/[0.02] text-zinc-100 focus:ring-zinc-500"
                />
                履歴を保存（このブラウザ内）
              </label>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button
                type="button"
                disabled={!canRun}
                onClick={handleShuffle}
                className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                シャッフル（順番）
              </button>
              <button
                type="button"
                disabled={!canRun}
                onClick={handleDraw}
                className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                抽選（当選者）
              </button>
            </div>
          </div>
        </section>

        {/* 結果セクション */}
        <section className="mb-12 bg-white/[0.02] rounded-md p-6 border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-100">結果</h2>
            <div className="flex items-center gap-2">
              {resultText && <CopyButton text={resultText} />}
            </div>
          </div>

          {!resultText ? (
            <p className="text-sm text-zinc-500">
              まだ結果がありません。上で「シャッフル」または「抽選」を実行してください。
            </p>
          ) : (
            <pre className="whitespace-pre-wrap break-words rounded-md bg-white/[0.02] border border-white/10 p-3 text-sm text-zinc-100">
              {resultText}
            </pre>
          )}

          {winners && winners.length > 0 && (
            <div className="mt-6 bg-white/[0.02] rounded-md border border-white/10 p-4">
              <div className="text-sm font-semibold text-zinc-300">
                当選者（{winners.length}）
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {winners.map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className="rounded-md bg-white/[0.05] px-3 py-1 text-sm font-semibold text-zinc-100 hover:bg-white/[0.1]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 履歴セクション */}
        <section className="bg-white/[0.02] rounded-md p-6 border border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-100">履歴</h2>
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              履歴をクリア
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-zinc-500">履歴はまだありません。</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => {
                const dt = new Date(h.createdAt);
                const title =
                  h.mode === "shuffle"
                    ? "シャッフル"
                    : `抽選（${h.count}）${
                        h.allowDuplicates ? "重複あり" : "重複なし"
                      }`;

                const textToCopy =
                  h.mode === "shuffle"
                    ? (h.ordered ?? []).join("\n")
                    : (h.winners ?? []).join("\n");

                return (
                  <div
                    key={h.id}
                    className="bg-white/[0.02] rounded-md border border-white/10 p-4 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-zinc-100">
                          {title}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {dt.toLocaleString()}
                        </div>
                      </div>
                      <CopyButton text={textToCopy} />
                    </div>

                    {h.mode === "winners" && h.winners?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {h.winners.map((w, i) => (
                          <span
                            key={`${h.id}-${w}-${i}`}
                            className="rounded-md bg-white/[0.05] px-3 py-1 text-xs font-semibold text-zinc-100 hover:bg-white/[0.1]"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
