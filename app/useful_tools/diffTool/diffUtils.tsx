// app/useful_tools/diffTool/diffUtils.ts

export type DiffType = "equal" | "insert" | "delete";

export type DiffLine = {
  type: DiffType;
  before: string;
  after: string;
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
    if (ch === "\n") {
      newlineCount++;
    } else if (ch === " " || ch === "　" || ch === "\t") {
      spaceCount++;
    }
  }

  const totalLength = text.length; // 全体長（空白＋改行含む）
  const charCountWithSpaces = totalLength - newlineCount; // 改行除く
  const charCount = charCountWithSpaces - spaceCount; // 空白・改行除く
  const charCountWithSpacesAndNewlines = charCountWithSpaces + newlineCount; // = totalLength

  const wordCount =
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length || 0;

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
 * 行単位の差分（LCS）
 */
export function diffLines(aText: string, bText: string): DiffLine[] {
  const a = aText.replace(/\r\n/g, "\n").split("\n");
  const b = bText.replace(/\r\n/g, "\n").split("\n");

  const m = a.length;
  const n = b.length;

  const lcs: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push({ type: "equal", before: a[i - 1], after: b[j - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      result.push({ type: "delete", before: a[i - 1], after: "" });
      i--;
    } else {
      result.push({ type: "insert", before: "", after: b[j - 1] });
      j--;
    }
  }

  while (i > 0) {
    result.push({ type: "delete", before: a[i - 1], after: "" });
    i--;
  }
  while (j > 0) {
    result.push({ type: "insert", before: "", after: b[j - 1] });
    j--;
  }

  return result.reverse();
}
