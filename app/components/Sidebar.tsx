import SidebarCategory from "./SidebarCategory";
import SidebarTags from "./SidebarTags";

export const Sidebar = () => {
  return (
    <div className="mx-10 sm:pr-8 sm:py-8 m-auto">
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
        <div className="flex flex-col items-center text-center justify-center">
          <h2 className="font-medium title-font mt-4 text-white text-lg">
            Phoebe Caulfield
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
          <p className="text-base text-gray-400">
            Raclette knausgaard hella meggs normcore williamsburg enamel pin
            sartorial venmo tbh hot chicken gentrify portland.
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
