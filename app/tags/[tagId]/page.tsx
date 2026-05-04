import Blog from "../../components/blog/Blog";
import { getList, getTagList } from "../../libs/microcms";

const fetchTagIdByName = async (tagName: string) => {
  const { contents } = await getTagList({
    limit: 1,
    filters: `name[equals]${tagName}`,
  });
  return contents[0]?.id ?? null;
};

const fetchBlogsByTag = async (tagName: string) => {
  const tagId = await fetchTagIdByName(tagName);
  if (!tagId) return [];

  const { contents } = await getList({
    limit: 80,
    filters: `tags[contains]${tagId}`,
  });
  return contents;
};

const TagPage = async ({ params }: { params: { tagId: string } }) => {
  const decodedTag = decodeURIComponent(params.tagId);
  const blogs = await fetchBlogsByTag(decodedTag);

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          {decodedTag}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">タグ</p>
        <div className="mt-4 border-t border-white/10" />
      </header>

      {blogs.length === 0 ? (
        <div className="mt-8 text-center text-sm text-zinc-500">
          該当する記事がありません
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
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

      <div className="h-10" />
    </div>
  );
};

export default TagPage;
