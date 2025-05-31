import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getDetail, getList } from "../../libs/microcms";
import markdownHtml from "zenn-markdown-html";
import { load } from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";
import CategoryButton from "../../components/CategoryButton";

export async function generateStaticParams() {
  const { contents } = await getList();

  const paths = contents.map((blog: { id: any }) => {
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

  if (!blog) {
    notFound();
  }

  let html = markdownHtml(blog.content);

  const $ = load(html);

  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });
  html = $.html();
  console.log(html);

  return (
    <div>
      <div className="lg:col-span-2 pl-10">
        <h1 className="my-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
          {blog.title}
        </h1>
        <div className="flex justify-end">
          <div>投稿日時：{time}</div>
        </div>
        <div className="flex justify-end">
          <div>カテゴリー</div>
          {blog.category?.name ? (
            <CategoryButton name={blog.category.name} />
          ) : (
            <div className="ml-2 text-gray-500">未分類</div>
          )}
        </div>

        <div className="flex justify-end">
          <div>タグ</div>
          {/* {blog.tags.map((tag: any) => {
              return <TagButton id={tag.id} name={tag.name} />;
            })} */}
        </div>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  );
}
