// app/useful_tools/tools.ts
export type ToolItem = {
  title: string;
  description: string;
  href: string;
};

export type ToolGroup = {
  title: string;
  description?: string;
  items: ToolItem[];
};

export const TOOL_GROUPS: ToolGroup[] = [
  {
    title: "変換ツール",
    description: "単位や形式を相互に変換するツール群",
    items: [
      {
        title: "人時・人日・人月 変換",
        description: "工数（人時・人日・人月）を相互に変換します",
        href: "/useful_tools/workTimeConversion",
      },
      {
        title: "60進数⇔10進数変換",
        description: "時間・分・秒などの60進数と10進数を相互に変換します",
        href: "/useful_tools/convertBase60To10",
      },
      {
        title: "Byte 単位変換",
        description: "GB / GiB などの違いを含めて変換します",
        href: "/useful_tools/byteConversion",
      },
    ],
  },
  {
    title: "ファイル系",
    items: [
      {
        title: "簡易ハッシュ差分チェッカー",
        description: "gzip 圧縮率・SHA-256 を即座に計測",
        href: "/useful_tools/compressionTool",
      },
    ],
  },
  {
    title: "テキスト処理",
    items: [
      {
        title: "差分チェッカー",
        description: "2つのテキストの差分を比較表示",
        href: "/useful_tools/diffChecker",
      },
      {
        title: "文章マスキング",
        description: "指定したキーワードを一括マスキング",
        href: "/useful_tools/maskingTool",
      },
      {
        title: "半角⇔全角 変換",
        description: "半角と全角の文字を相互に変換します",
        href: "/useful_tools/hankakuZenkaku",
      },
    ],
  },
  {
    title: "その他便利ツール",
    items: [
      {
        title: "会費計算機",
        description: "会費を割り勘する計算機",
        href: "/useful_tools/drinkPartyOrganizer",
      },
    ],
  },
];
