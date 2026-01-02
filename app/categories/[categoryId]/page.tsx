import Blog from "../../components/blog/Blog";
import { getList } from "../../libs/microcms";

const fetchBlogsByCategory = async (categoryName: string) => {
  const { contents } = await getList();
  return contents.filter((blog: any) => blog.category?.name === categoryName);
};

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const decodedCategory = decodeURIComponent(params.categoryId);
  const blogs = await fetchBlogsByCategory(decodedCategory);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          {decodedCategory}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">カテゴリー</p>
        <div className="mt-4 border-t border-white/10" />
      </header>

      {blogs.length === 0 ? (
        <div className="mt-8 text-center text-sm text-zinc-500">
          該当する記事がありません
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[12px] text-zinc-500">
                  <th className="text-left font-medium px-4 py-3 w-5/12">
                    タイトル
                  </th>
                  <th className="text-right font-medium px-4 py-3 w-3/12">
                    ジャンル
                  </th>
                  <th className="text-right font-medium px-4 py-3 w-4/12">
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
      )}

      <div className="h-10" />
    </div>
  );
};

export default CategoryPage;
