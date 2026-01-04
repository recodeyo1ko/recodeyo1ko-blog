import Link from "next/link";

type Item = { id: string; name: string };

type Props = {
  fetcher: () => Promise<{ contents: Item[] }>;
  hrefPrefix: string; // "tags" / "categories"
  variant: "tag" | "category";
  emptyText?: string;
};

const iconByVariant: Record<Props["variant"], string> = {
  category: "📁",
  tag: "#",
};

export default async function SidebarItemList({
  fetcher,
  hrefPrefix,
  variant,
  emptyText = "No contents",
}: Props) {
  const { contents } = await fetcher();

  if (!contents || contents.length === 0) {
    return <p className="px-2 py-1 text-xs text-zinc-500">{emptyText}</p>;
  }

  return (
    <div className="space-y-1">
      {contents.map((item) => (
        <Link
          key={item.id}
          href={`/${hrefPrefix}/${encodeURIComponent(item.name)}`}
          title={item.name}
          className={[
            "group flex items-center gap-2",
            "rounded-md px-2 py-1.5",
            "text-sm text-zinc-100",
            "hover:bg-white/[0.06] active:bg-white/10",
            "transition-colors select-none",
          ].join(" ")}
        >
          <span className="w-5 shrink-0 text-zinc-400 group-hover:text-zinc-200">
            {iconByVariant[variant]}
          </span>

          <span className="min-w-0 flex-1 truncate">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
