import React from "react";
import { getCategoryList } from "../libs/microcms";

export default async function SidebarCategory() {
  const { contents } = await getCategoryList();

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>;
  }
  return (
    <div>
      <div className="py-2">カテゴリー</div>
      {contents.map((category) => {
        return (
          <button
            key={category.id}
            className="px-2 py-1 mr-2 font-medium text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
