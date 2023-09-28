import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getDetail, getList } from "../../libs/microcms";
import TagButton from "@/app/components/TagButton";
import CategoryButton from "@/app/components/CategoryButton";
import cheerio from "cheerio";
import hljs from "highlight.js";

export async function generateStaticParams() {
  const { contents } = await getList();

  const paths = contents.map((blog) => {
    return {
      blogId: blog.id,
    };
  });

  return [...paths];
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);

  // ページの生成された時間を取得
  const time = new Date().toLocaleString();

  const content = cheerio.load(blog.content); // data.bodyはmicroCMSから返されるリッチエディタ部分
  content("pre code").each((_, elm) => {
    const result = hljs.highlightAuto(content(elm).text());
    content(elm).html(result.value);
    content(elm).addClass("hljs");
  });

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-md px-4 md:px-8">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
            {blog.title}
          </h1>
          <div className="flex justify-end">
            <div>投稿日時：{time}</div>
          </div>
          <div>
            <div>カテゴリー</div>
            <CategoryButton name={blog.category.name} />
          </div>
          <div>
            <div>タグ</div>
            {/* {blog.tags.map((tag: any) => {
              return <TagButton id={tag.id} name={tag.name} />;
            })} */}
          </div>
          <div className="p-4 markdown">
            <div dangerouslySetInnerHTML={{ __html: content.html() }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
