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

      {/* ジャンル列（右寄せ） */}
      <div className="col-span-4 flex flex-wrap justify-end gap-2">
        <CategoryButton name={category.name} />
      </div>

      {/* 技術タグ列（右寄せ） */}
      <div className="col-span-3 flex justify-end">
        {tags.map((tag: any) => (
          <TagButton key={tag.id} id={tag.id} name={tag.name} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
