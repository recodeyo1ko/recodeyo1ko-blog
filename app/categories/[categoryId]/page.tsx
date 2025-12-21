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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">カテゴリー: {decodedCategory}</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600">該当する記事がありません</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">タイトル</th>
              <th className="border border-gray-300 px-4 py-2">カテゴリ</th>
              <th className="border border-gray-300 px-4 py-2">タグ</th>
              <th className="border border-gray-300 px-4 py-2">アイキャッチ</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog: any) => (
              <Blog key={blog.id} {...blog} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryPage;
