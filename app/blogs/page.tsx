import { getList } from "../libs/microcms";
import Blog from "../components/Blog";

export default async function BlogPage() {
  const { contents } = await getList();

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>;
  }

  return (
    <div>
      <div className="lg:col-span-2">
        <div className="mb-5 md:mb-7">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl mt-10">
            記事一覧
          </h2>
        </div>
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <div className="grid gap-4 grid-cols-2">
              {contents.map((blog) => {
                return (
                  <div key={blog.id}>
                    {" "}
                    <Blog
                      id={blog.id}
                      title={blog.title}
                      eyecatch={blog.eyecatch}
                      category={blog.category}
                      tags={blog.tags}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
