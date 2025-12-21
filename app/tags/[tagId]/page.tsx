import Blog from "../../components/Blog";
import { getList } from "../../libs/microcms";

const fetchBlogsByTag = async (tagId: string) => {
  const { contents } = await getList();

  const filteredBlogs = contents.filter((blog: any) =>
    blog.tags?.some((tag: any) => tag.name === tagId)
  );

  return filteredBlogs;
};

const TagPage = async ({ params }: { params: { tagId: string } }) => {
  const { tagId } = params;
  const blogs = await fetchBlogsByTag(tagId); // blogs は常に配列になる

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">タグ: {tagId}</h1>

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

export default TagPage;
