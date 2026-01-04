"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import FilterSelectorMulti from "./FilterSelectorMulti";

type Mode = "or" | "and";

type Item = {
  id?: string;
  name: string;
};

export default function CategoryTagFilterClient({
  basePath, // "/blogs"
  categories,
  tags,
  selectedCategory, // "" or name
  selectedTags,
  mode,
  categoryCounts,
  tagCounts,
  totalCount,
  filteredCount,
}: {
  basePath: string;
  categories: Item[];
  tags: Item[];
  selectedCategory: string;
  selectedTags: string[];
  mode: Mode;
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}) {
  const router = useRouter();

  // ✅ UI用ローカル（このコンポーネント内で編集→適用でURLへ）
  const [localCategory, setLocalCategory] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);
  const [localMode, setLocalMode] = useState<Mode>(mode);

  // props更新に追従（戻る/進む、外部リンクなど）
  useMemo(() => {
    setLocalCategory(selectedCategory ? [selectedCategory] : []);
    setLocalTags(selectedTags);
    setLocalMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedTags.join(","), mode]);

  const buildUrl = useCallback(
    (category: string, tags: string[], m: Mode) => {
      const sp = new URLSearchParams();

      if (category) sp.set("category", category);
      if (tags.length > 0) sp.set("tags", tags.join(","));
      if (tags.length > 0) sp.set("mode", m); // tagsがある時だけ付与でOK

      const q = sp.toString();
      return q ? `${basePath}?${q}` : basePath;
    },
    [basePath]
  );

  const applyAll = () => {
    const cat = localCategory[0] ?? "";
    const url = buildUrl(cat, localTags, localMode);
    router.push(url);
  };

  const clearAll = () => {
    setLocalCategory([]);
    setLocalTags([]);
    setLocalMode("or");
    router.push(basePath);
  };

  const hasAny = selectedCategory !== "" || selectedTags.length > 0;

  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="text-[12px] text-zinc-500 mt-1">絞り込み</span>

      {/* ✅ カテゴリ：単一選択にしたいので selected は配列だが 0/1 で扱う */}
      <div className="w-full min-w-0 sm:w-auto">
        <FilterSelectorMulti
          label="カテゴリ"
          items={categories}
          selected={localCategory}
          counts={categoryCounts}
          totalCount={totalCount}
          mode={localMode}
          modeEnabled={false}
          onChangeSelected={(next) => {
            // カテゴリは単一選択（最後に押したものを採用）
            const one = next.length > 0 ? [next[next.length - 1]] : [];
            setLocalCategory(one);
          }}
          widthClass="w-full sm:w-[340px]"
        />
      </div>

      <div className="w-full min-w-0 sm:w-auto">
        <FilterSelectorMulti
          label="技術タグ"
          items={tags}
          selected={localTags}
          counts={tagCounts}
          totalCount={totalCount}
          mode={localMode}
          modeEnabled={true}
          onChangeSelected={(next) => setLocalTags(next)}
          onChangeMode={(m) => setLocalMode(m)}
          widthClass="w-full sm:w-[520px]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="text-[12px] text-zinc-500">
          表示：<span className="text-zinc-300">{filteredCount}</span> 件
        </div>

        {hasAny ? (
          <Link
            href={basePath}
            onClick={(e) => {
              e.preventDefault();
              clearAll();
            }}
            className="
              h-8 inline-flex items-center rounded-md px-2.5
              border border-white/10 bg-white/[0.02]
              text-[12px] font-semibold text-zinc-300
              hover:bg-white/[0.05] transition
            "
          >
            全解除
          </Link>
        ) : null}

        <button
          type="button"
          onClick={applyAll}
          className="
            h-8 inline-flex items-center rounded-md px-2.5
            border border-white/10 bg-white/[0.02]
            text-[12px] font-semibold text-zinc-100
            hover:bg-white/[0.05] transition
          "
        >
          適用
        </button>
      </div>
    </div>
  );
}
