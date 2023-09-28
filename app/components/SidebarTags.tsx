import React from "react";
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
          <button
            key={tag.id}
            className="px-2 py-1 mr-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
