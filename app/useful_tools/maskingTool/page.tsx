"use client";

import { useRef, useState } from "react";

type MaskRule = {
  id: number;
  pattern: string;      // マスク対象文字列（元の値）
  replacement: string;  // 置き換え文字列（マスク値）
  auto: boolean;        // 自動検出かどうか
  enabled: boolean;
};

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// マスクを適用
function applyMasking(text: string, rules: MaskRule[]): string {
  let result = text;
  const activeRules = rules.filter((r) => r.enabled && r.pattern.trim() !== "");

  // 部分一致の食い合いを避けるため、長いパターンから置換
  activeRules
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .forEach((rule) => {
      const escaped = escapeRegExp(rule.pattern);
      const regex = new RegExp(escaped, "g");
      result = result.replace(regex, rule.replacement);
    });

  return result;
}

// 自動検出（ざっくり版）: メール / IPv4 / ホスト名 / 長い英数字トークン
function detectCandidates(text: string): string[] {
  const candidates = new Set<string>();

  const emailRe =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const ipv4Re =
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const hostRe =
    /\b[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+\b/g; // example.com, host.local など
  const tokenRe =
    /\b[a-zA-Z0-9]{12,}\b/g; // 長い英数字（アクセストークン／パスワードっぽい）

  const patterns = [emailRe, ipv4Re, hostRe, tokenRe];

  for (const re of patterns) {
    const matchText = text.match(re);
    if (matchText) {
      matchText.forEach((m) => candidates.add(m));
    }
  }

  return Array.from(candidates);
}

// ▼ 色付き input プレビュー（元テキストの pattern をハイライト）
function renderInputPreview(text: string, rules: MaskRule[]) {
  const activeRules = rules.filter(
    (r) => r.enabled && r.pattern.trim() !== ""
  );
  if (activeRules.length === 0 || text === "") return text;

  const pattern = activeRules
    .map((r) => escapeRegExp(r.pattern))
    .join("|");

  const re = new RegExp(pattern, "g");
  const parts: (string | JSX.Element)[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const matchText = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    // 元の値をオレンジ系でハイライト
    parts.push(
      <span
        key={parts.length}
        className="bg-orange-200 text-gray-900 px-0.5 rounded"
      >
        {matchText}
      </span>
    );

    lastIndex = start + matchText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// ▼ 色付き output プレビュー（マスク済みテキストの replacement をハイライト）
function renderMaskedPreview(text: string, rules: MaskRule[]) {
  const activeRules = rules.filter(
    (r) => r.enabled && r.replacement.trim() !== ""
  );
  if (activeRules.length === 0 || text === "") return text;

  const pattern = activeRules
    .map((r) => escapeRegExp(r.replacement))
    .join("|");

  const re = new RegExp(pattern, "g");
  const parts: (string | JSX.Element)[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const matchText = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    // マスク後の値を黄色でハイライト
    parts.push(
      <span
        key={parts.length}
        className="bg-yellow-200 text-gray-900 px-0.5 rounded"
      >
        {matchText}
      </span>
    );

    lastIndex = start + matchText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function MaskingToolPage() {
  const [inputText, setInputText] = useState("");
  const [rules, setRules] = useState<MaskRule[]>([]);
  const [outputText, setOutputText] = useState("");
  const [nextId, setNextId] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 共通：ルールが変わったら出力を更新
  const updateOutput = (text: string, rules: MaskRule[]) => {
    setOutputText(applyMasking(text, rules));
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    updateOutput(value, rules);
  };

  // 現在の選択範囲をルールとして追加
  const handleAddSelectionRule = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start === end) {
      alert("マスクしたい文字列を入力欄で選択してください。");
      return;
    }

    const selected = inputText.slice(start, end);
    const pattern = selected.trim();
    if (!pattern) {
      alert("選択範囲が空白のみです。");
      return;
    }

    // 同じパターンが既にあれば何もしない
    if (rules.some((r) => r.pattern === pattern)) {
      alert("同じマスクパターンが既に登録されています。");
      return;
    }

    const newRule: MaskRule = {
      id: nextId,
      pattern,
      replacement: `__MASK_${nextId}__`,
      auto: false,
      enabled: true,
    };

    const newRules = [...rules, newRule];
    setRules(newRules);
    setNextId(nextId + 1);
    updateOutput(inputText, newRules);
  };

  // 自動検出でルール追加
  const handleAutoDetect = () => {
    const cands = detectCandidates(inputText);
    if (cands.length === 0) {
      alert("自動検出できる候補がありませんでした。");
      return;
    }

    let added = 0;
    let currentId = nextId;
    const newRules = [...rules];

    for (const value of cands) {
      if (newRules.some((r) => r.pattern === value)) continue;

      newRules.push({
        id: currentId,
        pattern: value,
        replacement: `__MASK_${currentId}__`,
        auto: true,
        enabled: true,
      });
      currentId++;
      added++;
    }

    if (added === 0) {
      alert("新しく追加できる候補はありませんでした。");
      return;
    }

    setRules(newRules);
    setNextId(currentId);
    updateOutput(inputText, newRules);
  };

  const handleUpdateRule = (id: number, partial: Partial<MaskRule>) => {
    const newRules = rules.map((r) =>
      r.id === id ? { ...r, ...partial } : r
    );
    setRules(newRules);
    updateOutput(inputText, newRules);
  };

  const handleDeleteRule = (id: number) => {
    const newRules = rules.filter((r) => r.id !== id);
    setRules(newRules);
    updateOutput(inputText, newRules);
  };

  const handleClearAll = () => {
    setInputText("");
    setRules([]);
    setOutputText("");
    setNextId(1);
  };

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        マスキングツール (/useful_tools/maskingTool)
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        個別情報などをマスクして、生成AIなどに安全に貼り付けるためのツールです。
        左のテキストから固有値を選択してマスクパターンを登録するか、「自動検出」を使って候補を追加してください。
      </p>

      {/* 入力＆出力 */}
      <section className="grid md:grid-cols-2 gap-6 mb-6">
        {/* 入力欄 */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            入力テキスト（マスク前）
          </h2>
          <textarea
            ref={textareaRef}
            className="h-64 w-full border rounded-md p-3 text-sm font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="ここに社内ログや設定ファイルなどを貼り付けます"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={handleAddSelectionRule}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.98]"
            >
              選択範囲をマスク対象に追加
            </button>
            <button
              type="button"
              onClick={handleAutoDetect}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98]"
            >
              自動検出して候補を追加
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98]"
            >
              すべてクリア
            </button>
          </div>
        </div>

        {/* 出力欄 */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">
            出力テキスト（マスク済み）※コピペ用
          </h2>
          <textarea
            className="h-64 w-full border rounded-md p-3 text-sm font-mono bg-gray-50"
            readOnly
            value={outputText}
            placeholder="ここにマスク済みテキストが表示されます"
            onFocus={(e) => e.target.select()}
          />
          <p className="mt-2 text-xs text-gray-500">
            ※ フォーカスすると全選択されるので、そのままコピーして生成AIなどに貼り付けできます。
          </p>
        </div>
      </section>

      {/* マスクルール一覧 */}
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">
          マスク対象一覧
        </h2>
        {rules.length === 0 ? (
          <p className="text-sm text-gray-500">
            まだマスク対象が登録されていません。
            左の入力欄で文字列を選択して「選択範囲をマスク対象に追加」を押すか、
            「自動検出して候補を追加」を使ってください。
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    有効
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    元の文字列
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    置き換え後
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    種類
                  </th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-t border-gray-100">
                    <td className="px-3 py-1.5 align-top">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) =>
                          handleUpdateRule(rule.id, {
                            enabled: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-1.5 align-top max-w-xs">
                      <div className="break-words font-mono text-[11px] text-gray-800">
                        {rule.pattern}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      <input
                        type="text"
                        className="w-40 rounded border border-gray-300 px-2 py-1 text-[11px] font-mono"
                        value={rule.replacement}
                        onChange={(e) =>
                          handleUpdateRule(rule.id, {
                            replacement: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-1.5 align-top text-gray-500">
                      {rule.auto ? "自動検出" : "手動"}
                    </td>
                    <td className="px-3 py-1.5 align-top text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ▼ 下に、色付き input / output プレビュー */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          色付きプレビュー
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 色付き input */}
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-700">
              色付き Input（マスク対象候補をハイライト）
            </h3>
            <div className="rounded-md border border-gray-200 bg-white p-3 text-sm font-mono whitespace-pre-wrap break-all">
              {renderInputPreview(inputText, rules)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              ルールに登録されている元の値（pattern）がオレンジ色で表示されます。
            </p>
          </div>

          {/* 色付き output */}
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gray-700">
              色付き Output（マスク済み部分をハイライト）
            </h3>
            <div className="rounded-md border border-gray-200 bg-white p-3 text-sm font-mono whitespace-pre-wrap break-all">
              {renderMaskedPreview(outputText, rules)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              ルールの置き換え後文字列（replacement）が黄色で表示されます。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
