import React from "react";
import Link from "next/link";
import { getTagList } from "../libs/microcms";

export default async function SidebarTags() {
  const { contents } = await getTagList();

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>;
  }
  return (
    <div>
      {contents.map((tag) => {
        return (
          <Link key={tag.id} href={`/tags/${tag.name}`}>
            <button className="px-2 py-1 m-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              {tag.name}
            </button>
          </Link>
        );
      })}
    </div>
  );
}
