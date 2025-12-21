import Link from "next/link";
import TagButton from "./TagButton";
import CategoryButton from "./CategoryButton";

const Blog = async (props: {
  id: any;
  title: any;
  eyecatch: any;
  category: any;
  tags: any;
}) => {
  const { id, title, eyecatch, category, tags } = props;
  return (
    <tr className="border-b">
      <td className="p-2">
        <Link href={`/blogs/${id}`} className="hover:underline">
          {title}
        </Link>
      </td>
      <td className="p-2">
        <CategoryButton name={category.name} />
      </td>
      <td className="p-2">
        {tags && tags.length > 0 ? (
          tags.map((tag: any) => (
            <Link key={tag.id} href={`/tags/${tag.name}`}>
              <TagButton id={tag.id} name={tag.name} />
            </Link>
          ))
        ) : (
          <span>-</span>
        )}
      </td>
      <td className="p-2">
        {eyecatch ? (
          <img
            src={eyecatch.url}
            alt="Eyecatch"
            width={40}
            height={40}
            className="object-cover rounded"
          />
        ) : (
          <span>-</span>
        )}
      </td>
    </tr>
  );
};

export default Blog;
