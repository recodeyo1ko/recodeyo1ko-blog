import Blog from "../../components/Blog";
import { getList } from "../../libs/microcms";

const fetchBlogsByCategory = async (categoryName: string) => {
  const { contents } = await getList();
  return contents.filter((blog: any) => blog.category?.name === categoryName);
};

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const decodedCategory = decodeURIComponent(params.categoryId);
  const blogs = await fetchBlogsByCategory(decodedCategory);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">カテゴリー: {decodedCategory}</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">該当する記事がありません</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b font-semibold text-gray-700 text-lg">
                <th className="text-left p-2 w-5/12">タイトル</th>
                <th className="text-right p-2 w-3/12">ジャンル</th>
                <th className="text-right p-2 w-4/12">技術タグ</th>
              </tr>
            </thead>

            <tbody>
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
  );
};

export default CategoryPage;
