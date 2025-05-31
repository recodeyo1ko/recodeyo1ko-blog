import Link from "next/link";
import TagButton from "./TagButton";
import CategoryButton from "./CategoryButton";

const Blog = async (props: {
  id: any;
  title: any;
  category: any;
  tags: any;
}) => {
  const { id, title, category, tags } = props;

  return (
    <div className="grid grid-cols-12 items-center border-b py-4 text-base">
      {/* タイトル列 */}
      <div className="col-span-5">
        <Link
          href={`/blogs/${id}`}
          className="text-indigo-600 hover:underline text-lg font-medium"
        >
          {title}
        </Link>
      </div>

      {/* カテゴリ列（右寄せ） */}
      <div className="col-span-4 flex flex-wrap justify-end gap-2">
        {category?.name && <CategoryButton name={category.name} />}
      </div>

      {/* 技術タグ列（右寄せ） */}
      <div className="col-span-3 flex justify-end flex-wrap gap-2">
        {Array.isArray(tags) && tags.length > 0 ? (
          tags.map((tag: any) => (
            <TagButton key={tag.id} id={tag.id} name={tag.name} />
          ))
        ) : (
          <div className="text-gray-400">タグなし</div>
        )}
      </div>
    </div>
  );
};

export default Blog;
