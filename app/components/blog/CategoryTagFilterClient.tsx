"use client";

import { useMemo, useState } from "react";
import Blog from "./Blog";

type Tag = { id: string; name: string };
type BlogType = {
  id: string;
  title: string;
  category?: { name?: string } | null;
  tags?: Tag[] | null;
};

export default function CategoryTagFilterClient({
  blogs,
}: {
  blogs: BlogType[];
}) {
  const [selectedTag, setSelectedTag] = useState<string>("");

  /** カテゴリ内に存在するタグ一覧 */
  const tags = useMemo(() => {
    const map = new Map<string, Tag>();
    blogs.forEach((b) =>
      b.tags?.forEach((t) => {
        if (!map.has(t.id)) map.set(t.id, t);
      })
    );
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ja")
    );
  }, [blogs]);

  /** タグで絞り込んだ Blog */
  const filteredBlogs = useMemo(() => {
    if (!selectedTag) return blogs;
    return blogs.filter((b) => b.tags?.some((t) => t.name === selectedTag));
  }, [blogs, selectedTag]);

  return (
    <div className="mt-4">
      {/* Notion風 フィルタツールバー */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
          <span className="text-xs text-zinc-500">絞り込み</span>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedTag("")}
              className={`
                h-7 px-2.5 rounded-md text-xs font-semibold
                border border-white/10
                ${selectedTag === "" ? "bg-white/[0.05]" : "bg-white/[0.02]"}
                hover:bg-white/[0.05]
                text-zinc-300 transition
              `}
            >
              すべて
            </button>

            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.name)}
                className={`
                  h-7 px-2.5 rounded-md text-xs font-semibold
                  border border-white/10
                  ${
                    selectedTag === tag.name
                      ? "bg-white/[0.05]"
                      : "bg-white/[0.02]"
                  }
                  hover:bg-white/[0.05]
                  text-zinc-300 transition
                `}
              >
                {tag.name}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs text-zinc-500">
            {selectedTag ? `選択：${selectedTag}` : "選択：すべて"}
          </div>
        </div>

        {/* Blog 行（テーブルヘッダなし） */}
        {filteredBlogs.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-500">
            該当する記事がありません
          </div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {filteredBlogs.map((blog) => (
                <Blog
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  category={blog.category}
                  tags={blog.tags}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
