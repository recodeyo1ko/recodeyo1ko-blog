import { notFound } from "next/navigation";
import { getDetail, getList } from "../../libs/microcms";
import markdownHtml from "zenn-markdown-html";
import { load } from "cheerio";
import hljs from "highlight.js";
import Link from "next/link";

export async function generateStaticParams() {
  const { contents } = await getList({ limit: 80 });
  return contents.map((blog: { id: string }) => ({ blogId: blog.id }));
}

function PillLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center
        rounded-md px-2 py-0.5
        text-xs text-zinc-200
        border border-white/10 bg-white/[0.03]
        hover:bg-white/[0.06] hover:border-white/20
        transition-colors
      "
    >
      {children}
    </Link>
  );
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);
  if (!blog) notFound();

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
    <article className="mx-auto w-full max-w-3xl">
      <header className="pt-2">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          {blog.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-zinc-500">
          <div className="inline-flex items-center gap-1">
            <span className="text-zinc-600">🕒</span>
            <span>{time ?? "-"}</span>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <div className="inline-flex items-center gap-2">
            <span className="text-zinc-600">📁</span>
            {blog.category?.name ? (
              <PillLink
                href={`/categories/${encodeURIComponent(blog.category.name)}`}
              >
                {blog.category.name}
              </PillLink>
            ) : (
              <span className="text-zinc-500">未分類</span>
            )}
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <div className="inline-flex items-center gap-2">
            <span className="text-zinc-600">#</span>
            {blog.tags && blog.tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1">
                {blog.tags.map((tag: { id: string; name: string }) => (
                  <PillLink
                    key={tag.id}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                  >
                    {tag.name}
                  </PillLink>
                ))}
              </div>
            ) : (
              <span className="text-zinc-500">-</span>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10" />
      </header>

      <div
        className="markdown mt-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
