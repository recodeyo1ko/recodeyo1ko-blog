import Image from "next/image";
import Link from "next/link";
import FavoriteBlog from "./components/FavoriteBlog";

export default function Home() {
  return (
    <div>
      <div className="lg:col-span-2">
        <div className="bg-white">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="mb-10">
              <h1 className="my-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
                仕事を頑張るために
              </h1>

              <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
                IT企業で頑張って生き抜くために、学んだことや情報整理を目的としています。
              </p>
            </div>
            <div className="grid py-5 lg:grid-cols-2 md:grid-cols-1">
              <Link href="/blogs">
                <div className="flex justify-center lg:justify-center px-4 py-3 items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500">
                  すべての記事を見る
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
