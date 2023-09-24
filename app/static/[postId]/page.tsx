import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getDetail, getList } from "../../libs/microcms";

export async function generateStaticParams() {
  const { contents } = await getList();

  const paths = contents.map((post) => {
    return {
      postId: post.id,
    };
  });

  return [...paths];
}

export default async function StaticDetailPage({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const post = await getDetail(postId);

  // ページの生成された時間を取得
  const time = new Date().toLocaleString();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-md px-4 md:px-8">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
            {post.title}
          </h1>
          <div className="flex justify-end">
            <div>投稿日時：{time}</div>
          </div>

          <div>{parse(post.content)}</div>
        </div>
      </div>
    </div>
  );
}
