import { getList } from "../libs/microcms";
import Blog from "../components/Blog";
import Sidebar from "../components/Sidebar";

export default async function BlogPage() {
  const { contents } = await getList();

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-5">
        <div className="lg:col-span-2">
          <div className="mb-5 md:mb-7">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl mt-10">
              Blog
            </h2>
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              This is a section of some simple filler text, also known as
              placeholder text. It shares some characteristics of a real written
              text but is random or otherwise generated.
            </p>
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
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
