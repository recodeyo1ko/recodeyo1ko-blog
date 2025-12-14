import SidebarCategory from "./SidebarCategory";
import SidebarTags from "./SidebarTags";

export const Sidebar = () => {
  return (
    <div className="mx-2 m-auto overflow-hidden rounded-lg border p-10">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-800 text-gray-600">
          <img
            src="/img/pixel_man.png"
            alt="man"
            className="w-20 h-20 rounded-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-medium title-font mt-4 text-gray-700 text-lg text-center">
            ReCodeYoiko
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
          <p className="text-base text-gray-400 text-left">
            自身のアウトプットのために作成したブログです。
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
