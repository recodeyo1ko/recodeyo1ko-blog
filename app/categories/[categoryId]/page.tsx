import Link from "next/link";
import Blog from "../../components/blog/Blog";
import TagFilterSelectorMulti from "../../components/blog/TagFilterSelectorMulti";
import { getList } from "../../libs/microcms";

type Mode = "or" | "and";

const fetchBlogsByCategory = async (categoryName: string) => {
  const { contents } = await getList();
  return contents.filter((blog: any) => blog.category?.name === categoryName);
};

const extractTagsFromBlogs = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((blog) => {
    blog.tags?.forEach((tag: any) => {
      const key = tag?.id ?? tag?.name;
      if (!key) return;
      if (!map.has(key)) map.set(key, tag);
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja")
  );
};

const parseSelectedTags = (searchParams?: { tags?: string | string[] }) => {
  const raw = searchParams?.tags;
  if (!raw) return [];
  const s = Array.isArray(raw) ? raw.join(",") : raw;
  return decodeURIComponent(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

const parseMode = (searchParams?: { mode?: string | string[] }): Mode => {
  const raw = searchParams?.mode;
  const s = Array.isArray(raw) ? raw[0] : raw;
  return s === "and" ? "and" : "or";
};

// mode に応じて OR / AND で絞り込み
const filterBlogsByTags = (
  blogs: any[],
  selectedTags: string[],
  mode: "or" | "and"
) => {
  if (selectedTags.length === 0) return blogs;

  if (mode === "and") {
    // AND：すべて含む
    return blogs.filter((blog) => {
      const names = (blog.tags ?? []).map((t: any) => t?.name);
      return selectedTags.every((tag) => names.includes(tag));
    });
  }

  // OR：どれか含む
  return blogs.filter((blog) =>
    blog.tags?.some((t: any) => selectedTags.includes(t?.name))
  );
};

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: { categoryId: string };
  searchParams?: { tags?: string | string[]; mode?: string | string[] };
}) => {
  const decodedCategory = decodeURIComponent(params.categoryId);
  const allBlogs = await fetchBlogsByCategory(decodedCategory);

  const tags = extractTagsFromBlogs(allBlogs);
  const selectedTags = parseSelectedTags(searchParams);
  const mode = parseMode(searchParams);

  const blogs = filterBlogsByTags(allBlogs, selectedTags, mode);

  const counts = tags.reduce((acc: Record<string, number>, tag: any) => {
    acc[tag.name] = allBlogs.filter((b: any) =>
      b.tags?.some((t: any) => t?.name === tag.name)
    ).length;
    return acc;
  }, {});

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          {decodedCategory}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">カテゴリー</p>

        {/* ✅ スマホ用：タイトル直下に「ジャンル + 技術タグ」 */}
        <div className="mt-4 md:hidden">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[12px] text-zinc-500">
                ジャンル：
                <span className="text-zinc-200">{decodedCategory}</span>
              </div>
              <div className="text-[12px] text-zinc-500">
                表示：<span className="text-zinc-300">{blogs.length}</span> 件
              </div>
            </div>

            <div className="mt-2">
              <TagFilterSelectorMulti
                basePath={`/categories/${encodeURIComponent(decodedCategory)}`}
                selectedTags={selectedTags}
                mode={mode}
                tags={tags}
                counts={counts}
                totalCount={allBlogs.length}
              />
            </div>

            {selectedTags.length > 0 && (
              <div className="mt-2 flex justify-end">
                <Link
                  href={`/categories/${encodeURIComponent(decodedCategory)}`}
                  className="
                  h-8 inline-flex items-center rounded-md px-2.5
                  border border-white/10 bg-white/[0.02]
                  text-[12px] font-semibold text-zinc-300
                  hover:bg-white/[0.05] transition
                "
                >
                  解除
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-white/10" />
      </header>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02]">
        {/* ✅ md以上だけ：従来のツールバー */}
        <div className="hidden md:flex relative z-30 flex-wrap items-start gap-2 px-3 sm:px-4 py-2 border-b border-white/10">
          <span className="text-[12px] text-zinc-500 mt-1">絞り込み</span>

          <div className="w-full min-w-0 sm:w-auto">
            <TagFilterSelectorMulti
              basePath={`/categories/${encodeURIComponent(decodedCategory)}`}
              selectedTags={selectedTags}
              mode={mode}
              tags={tags}
              counts={counts}
              totalCount={allBlogs.length}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-[12px] text-zinc-500">
              表示：<span className="text-zinc-300">{blogs.length}</span> 件
            </div>

            {selectedTags.length > 0 && (
              <Link
                href={`/categories/${encodeURIComponent(decodedCategory)}`}
                className="
                h-8 inline-flex items-center rounded-md px-2.5
                border border-white/10 bg-white/[0.02]
                text-[12px] font-semibold text-zinc-300
                hover:bg-white/[0.05] transition
              "
              >
                解除
              </Link>
            )}
          </div>
        </div>

        {/* 一覧 */}
        {blogs.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-500">
            該当する記事がありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {/* スマホ：2列 */}
                <tr className="md:hidden border-b border-white/10 bg-white/[0.01]">
                  <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500">
                    タイトル
                  </th>
                  <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500">
                    カテゴリ/タグ名
                  </th>
                </tr>

                {/* md以上：3列 */}
                <tr className="hidden md:table-row border-b border-white/10 bg-white/[0.01]">
                  <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500">
                    タイトル
                  </th>
                  <th className="px-4 py-2 text-right text-[12px] font-semibold text-zinc-500">
                    ジャンル
                  </th>
                  <th className="px-4 py-2 text-right text-[12px] font-semibold text-zinc-500">
                    技術タグ
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {blogs.map((blog: any) => (
                  <Blog
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    category={blog.category ?? null}
                    tags={blog.tags ?? []}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  );
};

export default CategoryPage;
