import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="lg:col-span-2">
        <div className="bg-white/[0.02]">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="mb-12 pt-8">
              <h1 className="my-4 text-center text-2xl font-semibold text-zinc-100 md:mb-6 lg:text-3xl">
                仕事を頑張るために
              </h1>

              <p className="mx-auto max-w-screen-md text-center text-zinc-400 md:text-lg leading-relaxed">
                IT企業で頑張って生き抜くために、学んだことや情報整理を目的としています。
              </p>
            </div>

            <div className="grid py-6 md:grid-cols-1">
              <Link href="/blogs">
                <div
                  className="
                  flex justify-center items-center
                  px-4 py-2
                  rounded-md
                  text-sm font-medium
                  text-zinc-200
                  border border-white/10
                  hover:bg-white/5
                  hover:border-white/20
                  transition-colors
                "
                >
                  すべての記事を見る
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
