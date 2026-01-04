"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FilterSelectorMulti from "./FilterSelectorMulti";

type Mode = "or" | "and";
type Item = { id?: string; name: string };

export default function CategoryTagFilterClient({
  basePath,
  categories,
  tags,
  selectedCategory,
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

  const [localCategory, setLocalCategory] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);
  const [localMode, setLocalMode] = useState<Mode>(mode);

  // props更新に追従（戻る/進む、直リンク）
  useEffect(() => {
    setLocalCategory(selectedCategory ? [selectedCategory] : []);
  }, [selectedCategory]);

  useEffect(() => {
    setLocalTags(selectedTags);
  }, [selectedTags.join(",")]);

  useEffect(() => {
    setLocalMode(mode);
  }, [mode]);

  const buildUrl = useCallback(
    (category: string, tgs: string[], m: Mode) => {
      const sp = new URLSearchParams();
      if (category) sp.set("category", category);
      if (tgs.length > 0) sp.set("tags", tgs.join(","));
      if (tgs.length > 0) sp.set("mode", m);
      const q = sp.toString();
      return q ? `${basePath}?${q}` : basePath;
    },
    [basePath]
  );

  const applyAll = () => {
    const cat = localCategory[0] ?? "";
    router.push(buildUrl(cat, localTags, localMode));
  };

  const clearAll = () => {
    setLocalCategory([]);
    setLocalTags([]);
    setLocalMode("or");
    router.push(basePath);
  };

  const hasAny = selectedCategory !== "" || selectedTags.length > 0;

  return (
    <div className="relative z-30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
        <div className="text-[12px] text-zinc-500 mt-1 shrink-0">絞り込み</div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2 min-w-0 flex-1">
          <div className="min-w-0">
            <FilterSelectorMulti
              label="カテゴリ"
              items={categories}
              selected={localCategory}
              counts={categoryCounts}
              totalCount={totalCount}
              mode={localMode}
              modeEnabled={false}
              onChangeSelected={(next) => {
                const one = next.length > 0 ? [next[next.length - 1]] : [];
                setLocalCategory(one);
              }}
              widthClass="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[560px]"
            />
          </div>

          <div className="min-w-0">
            <FilterSelectorMulti
              label="技術タグ"
              items={tags}
              selected={localTags}
              counts={tagCounts}
              totalCount={totalCount}
              mode={localMode}
              modeEnabled={true}
              onChangeSelected={setLocalTags}
              onChangeMode={setLocalMode}
              widthClass="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[560px]"
            />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="text-[12px] text-zinc-500">
            表示：<span className="text-zinc-300">{filteredCount}</span> 件
          </div>

          {hasAny ? (
            <button
              type="button"
              onClick={clearAll}
              className="
                h-8 inline-flex items-center rounded-md px-2.5
                border border-white/10 bg-white/[0.02]
                text-[12px] font-semibold text-zinc-300
                hover:bg-white/[0.05] transition
              "
            >
              全解除
            </button>
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

      <div className="mt-2 flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between">
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
              className="text-[12px] text-zinc-300 hover:text-zinc-100"
            >
              全解除
            </Link>
          ) : (
            <span />
          )}
        </div>

        <button
          type="button"
          onClick={applyAll}
          className="
            h-9 w-full rounded-md
            border border-white/10 bg-white/[0.02]
            text-[13px] font-semibold text-zinc-100
            hover:bg-white/[0.05] transition
          "
        >
          適用
        </button>
      </div>
    </div>
  );
}
