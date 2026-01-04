import { getList } from "../libs/microcms";
import SidebarTree from "./SidebarTree";

import {
  TOOL_GROUPS as USEFUL_TOOL_GROUPS,
  type ToolGroup as UsefulToolGroup,
  type ToolItem as UsefulToolItem,
} from "./useful_tool/tools";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

type Blog = {
  id: string;
  category: Category;
  tags?: Tag[];
};

// SidebarTree が期待する形（label/href/icon）
type SidebarToolItem = { label: string; href: string; icon?: string };
type SidebarToolGroup = { title: string; items: SidebarToolItem[] };

function adaptToolGroups(groups: UsefulToolGroup[]): SidebarToolGroup[] {
  return groups.map((g) => ({
    title: g.title,
    items: g.items.map((item: UsefulToolItem) => ({
      label: item.title, // tools.tsx の title → Sidebar の label
      href: item.href,
      icon: "", // 必要になったら後で埋める
    })),
  }));
}

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

  const toolGroups = adaptToolGroups(USEFUL_TOOL_GROUPS);

  return (
    <SidebarTree
      title="仕事を頑張るために"
      homeHref="/"
      authorName="recodeyo1ko"
      categoryTree={categoryTree}
      toolGroups={toolGroups}
    />
  );
}
