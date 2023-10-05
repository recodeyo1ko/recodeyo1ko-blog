import SidebarCategory from "./SidebarCategory";
import SidebarTags from "./SidebarTags";

export const Sidebar = () => {
  return (
    <div className="mx-2 m-auto overflow-hidden rounded-lg border p-10">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-800 text-gray-600">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10"
            viewBox="0 0 24 24"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-medium title-font mt-4 text-gray-700 text-lg　text-center">
            ReCodeYoiko
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
          <p className="text-base text-gray-400 text-left">
            自身のアウトプットのために作成したブログです。
            <br />
            主にWebアプリ開発に関する情報を発信しています。
            <br />
            他にも、プログラミングや技術に関する情報など幅広くを発信することを目的としています。
          </p>
        </div>
      </div>
      <div className="my-10">
        <div className="py-2">カテゴリー</div>
        <SidebarCategory />
      </div>
      <div className="my-10">
        <div className="py-2">タグ</div>
        <SidebarTags />
      </div>
    </div>
  );
};

export default Sidebar;
