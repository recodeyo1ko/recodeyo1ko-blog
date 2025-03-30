import Link from "next/link";

export const Header = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href={"/"}
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">ReCodeYoiko</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href={"/"}>
            <div className="mr-5 hover:text-white">ホーム</div>
          </Link>
          <div className="relative group inline-block">
            <button className="mr-5 hover:text-white">業務ツール</button>
            <div className="absolute hidden group-hover:block bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 mt-2 z-10">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <Link
                    href={"/workTimeConversion"}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    人時・日・月変換
                  </Link>
                  <Link
                    href={"/drinkPartyOrganizer"}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    飲み会幹事
                  </Link>
                  <Link
                    href={"/decimalConversion"}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    60進数⇔10進数変換
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link href={"/site_map"}>
            <div className="mr-5 hover:text-white">サイトマップ</div>
          </Link>
          <Link href={"/profile"}>
            <div className="mr-5 hover:text-white">プロフィール</div>
          </Link>
          <Link href={"/contact"}>
            <div className="mr-5 hover:text-white">問い合わせ</div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
