import Link from "next/link";
import LinkButton from "../components/LinkButton";

type BlogProps = {
  id: string;
  title: string;
  category?: { name?: string } | null;
  tags?: { id: string; name: string }[] | null;
};

const Blog = async ({ id, title, category, tags }: BlogProps) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      {/* タイトル */}
      <td className="p-2 text-left">
        <Link href={`/blogs/${id}`} className="font-medium hover:underline">
          {title}
        </Link>
      </td>

      {/* ジャンル（カテゴリ） */}
      <td className="p-2 text-right">
        {category?.name ? (
          <LinkButton href={`/categories/${category.name}`} variant="category">
            {category.name}
          </LinkButton>
        ) : (
          <span>-</span>
        )}
      </td>

      {/* 技術タグ */}
      <td className="p-2 text-right">
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1">
            {tags.map((tag) => (
              <LinkButton key={tag.id} href={`/tags/${tag.name}`} variant="tag">
                {tag.name}
              </LinkButton>
            ))}
          </div>
        ) : (
          <span>-</span>
        )}
      </td>
    </tr>
  );
};

export default Blog;
