import { getList } from "../libs/microcms";
import SidebarTree from "./SidebarTree";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

type Blog = {
  id: string;
  category: Category;
  tags?: Tag[];
};

type ToolItem = { label: string; href: string; icon?: string };
type ToolGroup = { title: string; items: ToolItem[] };

const TOOL_GROUPS: ToolGroup[] = [
  {
    title: "単位変換系",
    items: [
      {
        label: "人時・人日・人月 変換",
        href: "/useful_tools/workTimeConversion",
        icon: "",
      },
      {
        label: "60進数⇔10進数変換",
        href: "/useful_tools/convertBase60To10",
        icon: "",
      },
      {
        label: "Byte 単位変換",
        href: "/useful_tools/byteConversion",
        icon: "",
      },
    ],
  },
  {
    title: "ファイル系",
    items: [
      {
        label: "簡易ハッシュ差分チェッカー",
        href: "/useful_tools/compressionTool",
        icon: "",
      },
    ],
  },
  {
    title: "テキスト処理系",
    items: [
      {
        label: "差分チェッカー",
        href: "/useful_tools/diffChecker",
        icon: "",
      },
      { label: "文章マスキング", href: "/useful_tools/maskingTool", icon: "" },
      { label: "半角⇔全角", href: "/useful_tools/hankakuZenkaku", icon: "" },
      {
        label: "改行コード判定・変換",
        href: "/useful_tools/newLine",
        icon: "",
      },
      {
        label: "URLエンコード・デコード",
        href: "/useful_tools/urlEncodeDecode",
        icon: "",
      },
    ],
  },
  {
    title: "その他便利ツール",
    items: [
      {
        label: "会費計算機",
        href: "/useful_tools/drinkPartyOrganizer",
        icon: "",
      },
      { label: "くじ引き", href: "/useful_tools/lottery", icon: "" },
    ],
  },
];

export default async function Sidebar() {
  const { contents } = await getList();
  const blogs = contents as Blog[];

  // categoryName -> { category, tagsMap }
  const map = new Map<string, { category: Category; tags: Map<string, Tag> }>();

  for (const blog of blogs) {
    const cat = blog.category;
    const tags = blog.tags ?? [];

    if (!map.has(cat.name)) {
      map.set(cat.name, { category: cat, tags: new Map() });
    }
    const bucket = map.get(cat.name)!;
    for (const tag of tags) bucket.tags.set(tag.name, tag);
  }

  const categoryTree = Array.from(map.values())
    .map((v) => ({
      category: v.category,
      tags: Array.from(v.tags.values()).sort((a, b) =>
        a.name.localeCompare(b.name, "ja")
      ),
    }))
    .sort((a, b) => a.category.name.localeCompare(b.category.name, "ja"));

  return (
    <SidebarTree
      title="仕事を頑張るために"
      homeHref="/"
      authorName="recodeyo1ko"
      categoryTree={categoryTree}
      toolGroups={TOOL_GROUPS}
    />
  );
}
