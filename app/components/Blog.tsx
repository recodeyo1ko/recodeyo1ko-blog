import Link from "next/link";
import TagButton from "./TagButton";
import CategoryButton from "./CategoryButton";

const Blog = async (props: {
  id: any;
  title: any;
  eyecatch: any;
  category: any;
  tags: any;
}) => {
  const { id, title, eyecatch, category, tags } = props;
  return (
    <Link href={`/blogs/${id}`}>
      <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          {eyecatch ? ( // eyecatch データが存在するか確認
            <img
              src={eyecatch.url}
              alt="Eyecatch"
              width={eyecatch.width}
              height={eyecatch.height}
            />
          ) : (
            <p>No eyecatch available</p> // データが存在しない場合の代替メッセージ
          )}

          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            <div className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">
              {title}
            </div>
          </h2>
          <div className="mb-2">
            <div>カテゴリー</div>
            <CategoryButton name={category.name} />
          </div>
          <div>
            <div>タグ</div>
            {/* {tags.map((tag: any) => {
              return <TagButton id={tag.id} name={tag.name} />;
            })} */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Blog;
