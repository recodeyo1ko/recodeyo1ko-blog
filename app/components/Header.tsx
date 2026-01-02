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
          <Link href="/useful_tools">
            <div className="mr-5 hover:text-white">業務効率化ツール一覧</div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
