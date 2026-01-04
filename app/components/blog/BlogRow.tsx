import Link from "next/link";

type Props = {
  id: string;
  title: string;
  category?: { name: string } | null;
  tags?: { id?: string; name: string }[];
};

export default function BlogRow({ id, title, category, tags = [] }: Props) {
  return (
    <Link
      href={`/blog/${id}`}
      className="
        group flex items-center gap-3 px-3 sm:px-4 py-2.5
        hover:bg-white/[0.05] transition
      "
    >
      {/* 左：タイトル */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-zinc-100">
          {title}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-zinc-500">
          <span className="truncate">{category?.name ?? "未分類"}</span>
          {tags.length > 0 && <span className="text-zinc-600">•</span>}
          {tags.length > 0 && (
            <span className="truncate">
              {tags.map((t) => t.name).join(" / ")}
            </span>
          )}
        </div>
      </div>

      {/* 右：矢印（控えめ） */}
      <div className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition">
        →
      </div>
    </Link>
  );
}
