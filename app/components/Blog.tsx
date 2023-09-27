import Link from "next/link";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  Key,
} from "react";

const Blog = (props: {
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
          <h3>{category.name}</h3>
          <div>
            {tags.map((tag: string, index: Key | null | undefined) => (
              <button
                key={index}
                className="px-2 py-1 mr-2 text-sm font-medium text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Blog;
