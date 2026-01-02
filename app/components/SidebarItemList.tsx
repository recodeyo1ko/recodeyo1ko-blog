import React from "react";
import LinkButton from "../components/LinkButton";

type Item = { id: string; name: string };

type Props = {
  title: string;
  fetcher: () => Promise<{ contents: Item[] }>;
  hrefPrefix: string; // "tags" / "categories"
  variant: "tag" | "category";
};

export default async function SidebarItemList({
  title,
  fetcher,
  hrefPrefix,
  variant,
}: Props) {
  const { contents } = await fetcher();

  return (
    <div className="my-10">
      <div className="py-2">{title}</div>

      {!contents || contents.length === 0 ? (
        <p className="text-sm text-gray-400">No contents</p>
      ) : (
        <div className="flex flex-wrap">
          {contents.map((item) => (
            <LinkButton
              key={item.id}
              href={`/${hrefPrefix}/${item.name}`}
              variant={variant}
            >
              {item.name}
            </LinkButton>
          ))}
        </div>
      )}
    </div>
  );
}
