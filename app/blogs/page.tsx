import CategoryTagFilterClient from "../components/blog/CategoryTagFilterClient";
import Blog from "../components/blog/Blog";
import { getList } from "../libs/microcms";

type Mode = "or" | "and";

const parseListParam = (v?: string | string[]) => {
  if (!v) return [];
  const s = Array.isArray(v) ? v.join(",") : v;
  return decodeURIComponent(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

const parseSingleParam = (v?: string | string[]) => {
  if (!v) return "";
  const s = Array.isArray(v) ? v[0] : v;
  return decodeURIComponent(s).trim();
};

const parseModeParam = (v?: string | string[]): Mode => {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "and" ? "and" : "or";
};

const filterBlogs = (
  blogs: any[],
  selectedCategory: string,
  selectedTags: string[],
  mode: Mode
) => {
  return blogs.filter((blog) => {
    const catName = blog.category?.name ?? "";
    const tagNames = (blog.tags ?? []).map((t: any) => t?.name).filter(Boolean);

    if (selectedCategory && catName !== selectedCategory) return false;

    if (selectedTags.length === 0) return true;

    if (mode === "and") {
      return selectedTags.every((t) => tagNames.includes(t));
    }
    return selectedTags.some((t) => tagNames.includes(t));
  });
};

const extractCategories = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((b) => {
    const c = b.category;
    if (c?.name && !map.has(c.name)) map.set(c.name, c);
  });
  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja")
  );
};

const extractTags = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((b) => {
    b.tags?.forEach((t: any) => {
      const key = t?.id ?? t?.name;
      if (!key) return;
      if (!map.has(key)) map.set(key, t);
    });
  });
  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja")
  );
};

const makeCategoryCounts = (
  allBlogs: any[],
  categories: any[],
  selectedTags: string[],
  mode: Mode
) => {
  const base = filterBlogs(allBlogs, "", selectedTags, mode);

  return categories.reduce((acc: Record<string, number>, c: any) => {
    acc[c.name] = base.filter((b: any) => b.category?.name === c.name).length;
    return acc;
  }, {});
};

const makeTagCounts = (
  allBlogs: any[],
  tags: any[],
  selectedCategory: string,
  selectedTags: string[],
  mode: Mode
) => {
  return tags.reduce((acc: Record<string, number>, tag: any) => {
    const name = tag.name;

    const others = selectedTags.filter((t) => t !== name);
    const base = filterBlogs(allBlogs, selectedCategory, others, mode);

    acc[name] = base.filter((b: any) =>
      b.tags?.some((t: any) => t?.name === name)
    ).length;

    return acc;
  }, {});
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: {
    category?: string | string[];
    tags?: string | string[];
    mode?: string | string[];
  };
}) {
  const { contents } = await getList({ limit: 80 });
  const allBlogs = (contents ?? []) as any[];

  if (!allBlogs || allBlogs.length === 0) {
    return <div className="text-sm text-zinc-500">No contents</div>;
  }

  const selectedCategory = parseSingleParam(searchParams?.category);
  const selectedTags = parseListParam(searchParams?.tags);
  const mode = parseModeParam(searchParams?.mode);

  const categories = extractCategories(allBlogs);
  const tags = extractTags(allBlogs);

  const blogs = filterBlogs(allBlogs, selectedCategory, selectedTags, mode);

  const categoryCounts = makeCategoryCounts(
    allBlogs,
    categories,
    selectedTags,
    mode
  );
  const tagCounts = makeTagCounts(
    allBlogs,
    tags,
    selectedCategory,
    selectedTags,
    mode
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          記事一覧
        </h1>
        <div className="mt-4 border-t border-white/10" />
      </header>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="md:hidden px-3 py-3 border-b border-white/10">
          <CategoryTagFilterClient
            basePath="/blogs"
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            mode={mode}
            categoryCounts={categoryCounts}
            tagCounts={tagCounts}
            totalCount={allBlogs.length}
            filteredCount={blogs.length}
          />
        </div>

        <div className="hidden md:block px-3 sm:px-4 py-2 border-b border-white/10">
          <CategoryTagFilterClient
            basePath="/blogs"
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            mode={mode}
            categoryCounts={categoryCounts}
            tagCounts={tagCounts}
            totalCount={allBlogs.length}
            filteredCount={blogs.length}
          />
        </div>

        {/* 一覧 */}
        <div className="overflow-x-hidden">
          <table className="w-full border-collapse table-fixed">
            <thead>
              {/* スマホ：2列 */}
              <tr className="md:hidden border-b border-white/10 bg-white/[0.01]">
                <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-1/2">
                  タイトル
                </th>
                <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-1/2">
                  カテゴリ/タグ名
                </th>
              </tr>

              {/* md以上：3列 */}
              <tr className="hidden md:table-row border-b border-white/10 bg-white/[0.01]">
                <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-5/12">
                  タイトル
                </th>
                <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-3/12">
                  ジャンル
                </th>
                <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-4/12">
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
      </div>

      <div className="h-10" />
    </div>
  );
}
