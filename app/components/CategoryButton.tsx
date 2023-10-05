import Link from "next/link";
import React from "react";

function CategoryButton(props: { name: string }) {
  const { name } = props;
  return (
    <Link
      href={`/categories/${name}`}
      className="px-2 py-1 mr-2 text-sm font-medium text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {name}
    </Link>
  );
}

export default CategoryButton;
