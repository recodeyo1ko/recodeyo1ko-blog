import React from "react";
import Image from "next/image";

type FavoriteBlogProps = {
  title: string;
  introduction: string;
};

function FavoriteBlog({ title, introduction }: FavoriteBlogProps) {
  return (
    <div className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
      <a
        href="#"
        className="group relative block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48"
      >
        <Image
          src="/img/rails.jpg"
          loading="lazy"
          alt="rails"
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
          width={500}
          height={500}
        />
      </a>

      <div className="flex flex-col gap-2 p-4 lg:p-6">
        <h2 className="text-xl font-bold text-gray-800">
          <a
            href="#"
            className="transition duration-100 hover:text-indigo-500 active:text-indigo-600"
          >
            {title}
          </a>
        </h2>

        <p className="text-gray-500">{introduction}</p>

        <div>
          <a
            href="#"
            className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
          >
            続きを読む
          </a>
        </div>
      </div>
    </div>
  );
}

export default FavoriteBlog;
