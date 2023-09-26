import Link from "next/link";

const Blog = (props: { id: any; title: any; eyecatch: any; category: any }) => {
  const { id, title, eyecatch, category } = props;

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
        </div>
      </div>
    </Link>
  );
};

export default Blog;