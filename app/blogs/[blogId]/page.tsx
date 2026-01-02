import { notFound } from "next/navigation";
import { getDetail, getList } from "../../libs/microcms";
import markdownHtml from "zenn-markdown-html";
import { load } from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";
import LinkButton from "../../components/LinkButton";

export async function generateStaticParams() {
  const { contents } = await getList();

  return contents.map((blog: { id: string }) => ({
    blogId: blog.id,
  }));
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);

  if (!blog) notFound();

  // ✅ 投稿日時はCMSの日時を使う（なければ表示しない/代替）
  const published =
    blog.publishedAt ?? blog.createdAt ?? blog.updatedAt ?? null;

  const time = published
    ? new Date(published).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    : null;

  let html = markdownHtml(blog.content);

  const $ = load(html);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });
  html = $.html();

  return (
    <div>
      <div className="lg:col-span-2 pl-10">
        <h1 className="my-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
          {blog.title}
        </h1>

        {/* 投稿日時 */}
        <div className="flex justify-end text-sm text-gray-500">
          {time ? <div>投稿日時：{time}</div> : <div>投稿日時：-</div>}
        </div>

        {/* カテゴリー */}
        <div className="mt-2 flex justify-end items-center gap-2">
          <div className="text-sm text-gray-500">ジャンル：</div>
          {blog.category?.name ? (
            <LinkButton
              href={`/categories/${blog.category.name}`}
              variant="category"
            >
              {blog.category.name}
            </LinkButton>
          ) : (
            <div className="text-sm text-gray-500">未分類</div>
          )}
        </div>

        {/* タグ */}
        <div className="mt-2 flex justify-end items-start gap-2">
          <div className="text-sm text-gray-500 mt-1">技術タグ：</div>
          {blog.tags && blog.tags.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1">
              {blog.tags.map((tag: { id: string; name: string }) => (
                <LinkButton
                  key={tag.id}
                  href={`/tags/${tag.name}`}
                  variant="tag"
                >
                  {tag.name}
                </LinkButton>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">-</div>
          )}
        </div>

        {/* 本文 */}
        <div
          className="markdown mt-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
