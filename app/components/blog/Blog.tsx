import Link from "next/link";

type BlogProps = {
  id: string;
  title: string;
  category?: { name?: string } | null;
  tags?: { id: string; name: string }[] | null;
};

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center gap-1
        rounded-md px-2 py-0.5
        text-xs text-zinc-200
        border border-white/10 bg-white/[0.03]
        hover:bg-white/[0.06] hover:border-white/20
        transition-colors
        whitespace-nowrap
      "
    >
      {children}
    </Link>
  );
}

const Blog = ({ id, title, category, tags }: BlogProps) => {
  const categoryName = category?.name ?? "";
  const hasTags = !!tags && tags.length > 0;

  return (
    <tr className="border-b border-white/10 hover:bg-white/[0.03] transition-colors">
      {/* ===================== */}
      {/* Mobile: 2列（タイトル / カテゴリ&タグ） */}
      {/* ===================== */}
      <td className="px-4 py-3 align-top md:hidden">
        <Link
          href={`/blogs/${id}`}
          className="block font-medium text-zinc-100 hover:underline leading-snug line-clamp-2"
        >
          {title}
        </Link>
      </td>

      <td className="px-4 py-3 align-top md:hidden text-left">
        {/* 上：📁カテゴリ（左寄せ） */}
        <div className="flex justify-start">
          {categoryName ? (
            <Pill href={`/categories/${encodeURIComponent(categoryName)}`}>
              <span aria-hidden>📁</span>
              <span>{categoryName}</span>
            </Pill>
          ) : (
            <span className="text-xs text-zinc-500">-</span>
          )}
        </div>

        {/* 下：#タグ（左寄せ・折り返し） */}
        <div className="mt-1 flex flex-wrap justify-start gap-1">
          {hasTags ? (
            tags!.map((tag) => (
              <Pill key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <span className="text-zinc-400">#</span>
                <span>{tag.name}</span>
              </Pill>
            ))
          ) : (
            <span className="text-xs text-zinc-500">-</span>
          )}
        </div>
      </td>

      {/* ===================== */}
      {/* md以上: 3列（タイトル / ジャンル / 技術タグ） */}
      {/* ===================== */}
      <td className="hidden md:table-cell px-4 py-3 text-left align-top">
        <Link
          href={`/blogs/${id}`}
          className="block font-medium text-zinc-100 hover:underline leading-snug line-clamp-2"
        >
          {title}
        </Link>
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-right align-top">
        {categoryName ? (
          <Pill href={`/categories/${encodeURIComponent(categoryName)}`}>
            <span aria-hidden>📁</span>
            <span>{categoryName}</span>
          </Pill>
        ) : (
          <span className="text-zinc-500">-</span>
        )}
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-right align-top">
        {hasTags ? (
          <div className="flex flex-wrap justify-end gap-1">
            {tags!.map((tag) => (
              <Pill key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <span className="text-zinc-400">#</span>
                <span>{tag.name}</span>
              </Pill>
            ))}
          </div>
        ) : (
          <span className="text-zinc-500">-</span>
        )}
      </td>
    </tr>
  );
};

export default Blog;
