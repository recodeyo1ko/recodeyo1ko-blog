import { getList } from "../libs/microcms";
import Blog from "../components/blog/Blog";

export default async function BlogPage() {
  const { contents } = await getList();

  if (!contents || contents.length === 0) {
    return <div className="text-sm text-zinc-500">No contents</div>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          記事一覧
        </h1>
        <div className="mt-4 border-t border-white/10" />
      </header>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead>
            {/* スマホ：2列 */}
            <tr className="md:hidden border-b border-white/10 bg-white/[0.01]">
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-[58%]">
                タイトル
              </th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-[42%]">
                カテゴリ/タグ名
              </th>
            </tr>

            {/* md以上：3列 */}
            <tr className="hidden md:table-row border-b border-white/10 bg-white/[0.01]">
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-zinc-500 w-[48%]">
                タイトル
              </th>
              <th className="px-4 py-2 text-right text-[12px] font-semibold text-zinc-500 w-[18%]">
                ジャンル
              </th>
              <th className="px-4 py-2 text-right text-[12px] font-semibold text-zinc-500 w-[34%]">
                技術タグ
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {contents.map((blog: any) => (
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

      <div className="h-10" />
    </div>
  );
}
