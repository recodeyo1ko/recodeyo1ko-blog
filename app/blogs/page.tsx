import { getList } from "../libs/microcms";
import Blog from "../components/Blog";

export default async function BlogPage() {
  const { contents } = await getList();

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>;
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <h2 className="text-center text-2xl font-bold text-gray-800 mt-10 mb-6">
        記事一覧
      </h2>

      {/* 表のヘッダー部分 */}
      <div className="grid grid-cols-12 border-b pb-3 font-semibold text-gray-700 text-lg">
        <div className="col-span-5">タイトル</div>
        <div className="col-span-4 text-right">技術タグ</div>
        <div className="col-span-3 text-right">ジャンル</div>
      </div>

      {/* 各記事 */}
      <div className="divide-y">
        {contents.map((blog) => (
          <Blog
            key={blog.id}
            id={blog.id}
            title={blog.title}
            category={blog.category ?? {}}
            tags={blog.tags ?? []}
          />
        ))}
      </div>
    </div>
  );
}
