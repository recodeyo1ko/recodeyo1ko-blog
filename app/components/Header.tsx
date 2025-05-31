"use client";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href={"/"}
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
        >
          <img
            src="/img/pixel_laptop.png"
            alt="laptop"
            className="w-10 h-10"
            style={{ maxWidth: "100%" }}
          />
          <span className="ml-3 text-xl">仕事を頑張るために</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href={"/"}>
            <div className="mr-5 hover:text-white">ホーム</div>
          </Link>
          <Link href="/blogs">
            <div className="mr-5 hover:text-white">記事一覧</div>
          </Link>
          <div className="relative inline-block">
            <button
              className="mr-5 hover:text-white flex items-center gap-1"
              onClick={toggleDropdown}
            >
              業務ツール
              <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 mt-2 z-10">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/useful_tools/workTimeConversion"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      人時・日・月変換
                    </Link>
                    <Link
                      href="/useful_tools/drinkPartyOrganizer"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      飲み会幹事
                    </Link>
                    <Link
                      href="/useful_tools/decimalConversion"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      60進数⇔10進数変換
                    </Link>

                    <Link
                      href="/useful_tools/byteConversion"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Byte単位変換
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
