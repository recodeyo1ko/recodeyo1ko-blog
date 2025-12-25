"use client";
import { useState } from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="text-gray-400 bg-gray-900 body-font absolute w-full">
      <div className="container px-5 py-6 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
            <img
              src="/img/pixel_laptop.png"
              alt="laptop"
              className="w-10 h-10"
              style={{ maxWidth: "100%" }}
            />
            <span className="ml-3 text-xl">仕事を頑張るために</span>
          </a>
          <p className="mt-2 text-sm text-gray-500">
            自身のアウトプットのために作成したブログです。
          </p>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              整備中
            </h2>
            <nav className="list-none mb-10">
              <li>
                <a className="text-gray-400 hover:text-white">整備中</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white">整備中</a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              整備中
            </h2>
            <nav className="list-none mb-10">
              <li>
                <a className="text-gray-400 hover:text-white">整備中</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white">整備中</a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              業務効率化ツール
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link
                  href="/useful_tools/workTimeConversion"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  人時・日・月変換
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
                <Link
                  href="/useful_tools/compressionTool"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  クイック圧縮率チェッカー
                </Link>
                <Link
                  href="/useful_tools/diffTool"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  差分チェッカー
                </Link>
                <Link
                  href="/useful_tools/maskingTool"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  文章マスキング
                </Link>
                <Link
                  href="/useful_tools/hankakuZenkaku"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  半角・全角変換ツール
                </Link>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              その他
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link
                  href="/useful_tools/drinkPartyOrganizer"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  飲み会幹事
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 bg-opacity-75">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © 2025 ReCodeYoiko —
            <a
              href="https://twitter.com/knyttneve"
              rel="noopener noreferrer"
              className="text-gray-500 ml-1"
              target="_blank"
            >
              @ReCodeYoiko
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
