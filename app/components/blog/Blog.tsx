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
        inline-flex items-center
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
  return (
    <tr className="border-b border-white/10 hover:bg-white/[0.03] transition-colors">
      {/* タイトル */}
      <td className="px-4 py-3 text-left">
        <Link
          href={`/blogs/${id}`}
          className="font-medium text-zinc-100 hover:underline"
        >
          {title}
        </Link>
      </td>

      {/* ジャンル（カテゴリ） */}
      <td className="px-4 py-3 text-right">
        {category?.name ? (
          <Pill href={`/categories/${encodeURIComponent(category.name)}`}>
            {category.name}
          </Pill>
        ) : (
          <span className="text-zinc-500">-</span>
        )}
      </td>

      {/* 技術タグ */}
      <td className="px-4 py-3 text-right">
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1">
            {tags.map((tag) => (
              <Pill key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                {tag.name}
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
