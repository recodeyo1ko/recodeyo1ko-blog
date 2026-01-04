// app/useful_tools/diffTool/_components/diffUtils.ts

export type InlinePart = {
  text: string;
  kind: "equal" | "insert" | "delete";
};

export type CharDiffResult = {
  beforeParts: InlinePart[];
  afterParts: InlinePart[];
};

export type TextStats = {
  charCount: number; // 文字数（空白・改行除く）
  spaceCount: number; // 空白数
  charCountWithSpaces: number; // 空白込み文字数（改行除く）
  newlineCount: number; // 改行数
  charCountWithSpacesAndNewlines: number; // 改行込み文字数
  wordCount: number; // 単語数（空白区切り）
};

export function calcTextStats(text: string): TextStats {
  let spaceCount = 0;
  let newlineCount = 0;

  for (const ch of text) {
    if (ch === "\n") newlineCount++;
    else if (ch === " " || ch === "　" || ch === "\t") spaceCount++;
  }

  const totalLength = text.length;
  const charCountWithSpaces = totalLength - newlineCount;
  const charCount = charCountWithSpaces - spaceCount;
  const charCountWithSpacesAndNewlines = totalLength;

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length || 0;

  return {
    charCount,
    spaceCount,
    charCountWithSpaces,
    newlineCount,
    charCountWithSpacesAndNewlines,
    wordCount,
  };
}

/**
 * 全文を「文字単位」で比較して差分を返す（LCS）
 * - beforeParts: delete を赤ハイライト
 * - afterParts : insert を緑ハイライト
 */
export function diffChars(
  beforeText: string,
  afterText: string
): CharDiffResult {
  const a = Array.from(beforeText.replace(/\r\n/g, "\n"));
  const b = Array.from(afterText.replace(/\r\n/g, "\n"));

  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  type Op = { kind: "equal" | "insert" | "delete"; ch: string };
  const ops: Op[] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.push({ kind: "equal", ch: a[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      ops.push({ kind: "delete", ch: a[i - 1] });
      i--;
    } else {
      ops.push({ kind: "insert", ch: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    ops.push({ kind: "delete", ch: a[i - 1] });
    i--;
  }
  while (j > 0) {
    ops.push({ kind: "insert", ch: b[j - 1] });
    j--;
  }
  ops.reverse();

  const beforeParts: InlinePart[] = [];
  const afterParts: InlinePart[] = [];

  const push = (arr: InlinePart[], kind: InlinePart["kind"], text: string) => {
    if (!text) return;
    const last = arr[arr.length - 1];
    if (last && last.kind === kind) last.text += text;
    else arr.push({ kind, text });
  };

  for (const op of ops) {
    if (op.kind === "equal") {
      push(beforeParts, "equal", op.ch);
      push(afterParts, "equal", op.ch);
    } else if (op.kind === "delete") {
      push(beforeParts, "delete", op.ch);
    } else {
      push(afterParts, "insert", op.ch);
    }
  }

  return { beforeParts, afterParts };
}
