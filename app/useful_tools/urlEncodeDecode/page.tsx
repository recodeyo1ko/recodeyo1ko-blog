"use client";

import ToolHeader from "@/app/components/ToolHeader";
import { useMemo, useState } from "react";

type KV = { key: string; value: string };

const safeDecode = (s: string) => {
  try {
    // + を空白扱いしたいケースがあるので補正
    return decodeURIComponent(s.replace(/\+/g, "%20"));
  } catch {
    return s;
  }
};

const parseUrlLike = (input: string) => {
  // 絶対URL/相対URLどちらでも扱えるようにする
  try {
    return new URL(input);
  } catch {
    return new URL(input, "https://dummy.local");
  }
};

export default function Page() {
  const [raw, setRaw] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [pairs, setPairs] = useState<KV[]>([]);
  const [hash, setHash] = useState("");

  const detect = () => {
    const text = raw.trim();
    if (!text) {
      setBaseUrl("");
      setPairs([]);
      setHash("");
      return;
    }

    const u = parseUrlLike(text);

    // hash
    setHash(u.hash || "");

    // baseURL（相対URLの場合は origin を除去）
    const isDummy = u.origin === "https://dummy.local";
    const base = (isDummy ? "" : u.origin) + u.pathname;
    setBaseUrl(base);

    // query -> 配列に展開（URLSearchParamsはデコード済みを返す）
    const next: KV[] = [];
    u.searchParams.forEach((v, k) => next.push({ key: k, value: v }));
    setPairs(next);
  };

  const encodedUrl = useMemo(() => {
    const sp = new URLSearchParams();
    for (const p of pairs) {
      const k = p.key.trim();
      if (!k) continue;
      sp.set(k, p.value); // URLSearchParamsがエンコード
    }
    const qs = sp.toString();
    return `${baseUrl}${qs ? `?${qs}` : ""}${hash || ""}`;
  }, [baseUrl, pairs, hash]);

  const decodedPreview = useMemo(() => {
    // 見た目用のデコード寄り表示（実URLは encodedUrl）
    const sp = new URLSearchParams();
    for (const p of pairs) {
      const k = p.key.trim();
      if (!k) continue;
      sp.set(safeDecode(k), safeDecode(p.value));
    }
    const qs = sp.toString();
    return `${baseUrl}${qs ? `?${safeDecode(qs)}` : ""}${hash || ""}`;
  }, [baseUrl, pairs, hash]);

  const updatePair = (idx: number, patch: Partial<KV>) => {
    setPairs((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, ...patch } : p))
    );
  };

  const addPair = () => setPairs((prev) => [...prev, { key: "", value: "" }]);
  const removePair = (idx: number) =>
    setPairs((prev) => prev.filter((_, i) => i !== idx));

  const clearAll = () => {
    setRaw("");
    setBaseUrl("");
    setPairs([]);
    setHash("");
  };

  return (
    <div className="mx-auto min-h-screen max-w-screen-lg bg-gray-50 px-4 py-8">
      {/* タイトルと使い方 */}
      <ToolHeader
        title="URLエンコード・デコードツール"
        description="URLのクエリ（パラメータ）を検出して、編集・追加・削除し、エンコード済みURLを生成します。"
        steps={
          <>
            <li>URL全体を入力欄に貼り付け、「クエリ検出」ボタンを押します。</li>
            <li>クエリ一覧が表示されるので、編集・追加・削除が可能です。</li>
            <li>
              「生成URL」欄にエンコード済みのURLが表示されます。必要に応じてコピーして利用してください。
            </li>
          </>
        }
      />

      <section className="w-full max-w-2xl border rounded-lg shadow-sm bg-white p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold">入力</h2>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-md border text-sm"
          >
            クリア
          </button>
        </div>

        <label className="block text-sm font-medium mb-1">URLを貼り付け</label>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className="w-full border rounded-md px-3 py-2 font-mono text-sm"
          placeholder="https://example.com/path?name=%E9%88%B4%E6%9C%A8&msg=hello%20world"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={detect}
            className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm"
          >
            クエリ検出
          </button>
        </div>

        <div className="mt-6 border-t pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">baseURL</label>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full border rounded-md px-3 py-2 font-mono text-sm"
              placeholder="https://example.com/path"
            />
            <p className="text-xs text-gray-500 mt-1">
              例: <span className="font-mono">https://example.com/path</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              hash（任意）
            </label>
            <input
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full border rounded-md px-3 py-2 font-mono text-sm"
              placeholder="#section"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">クエリ一覧（編集可）</span>
              <button
                onClick={addPair}
                className="px-3 py-1.5 rounded-md border text-sm"
              >
                + 追加
              </button>
            </div>

            <div className="space-y-2">
              {pairs.length === 0 && (
                <p className="text-sm text-gray-500">クエリがありません。</p>
              )}

              {pairs.map((p, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={p.key}
                    onChange={(e) => updatePair(idx, { key: e.target.value })}
                    className="w-1/3 border rounded-md px-2 py-1 font-mono text-sm"
                    placeholder="key"
                  />
                  <input
                    value={p.value}
                    onChange={(e) => updatePair(idx, { value: e.target.value })}
                    className="flex-1 border rounded-md px-2 py-1 font-mono text-sm"
                    placeholder="value (decoded)"
                  />
                  <button
                    onClick={() => removePair(idx)}
                    className="px-2 py-1 rounded-md border text-sm"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-1">
              生成URL（エンコード済み）
            </label>
            <textarea
              value={encodedUrl}
              readOnly
              rows={3}
              className="w-full border rounded-md px-3 py-2 font-mono text-sm bg-gray-50"
            />

            <label className="block text-sm font-medium mb-1 mt-4">
              表示用プレビュー（デコード寄り）
            </label>
            <textarea
              value={decodedPreview}
              readOnly
              rows={3}
              className="w-full border rounded-md px-3 py-2 font-mono text-sm bg-gray-50"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
