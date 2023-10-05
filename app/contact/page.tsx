import React from "react";

function ContactPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <div className="mb-10">
        <h2 className="my-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
          問い合わせ
        </h2>

        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
          ご連絡がある際にはこちらからお願いします。
        </p>
        <div className="grid lg:grid-cols-2 md:grid-cols-1">
          <div className="pt-5">
            <label
              htmlFor="name"
              className="leading-7 pr-5 text-sm text-gray-400"
            >
              名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="コード良子"
              className="w-3/4 bg-gray-400 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            ></input>
          </div>
          <div className="pt-5">
            <label
              htmlFor="email"
              className="leading-7 pr-5 text-sm text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="code@code.com"
              className="w-3/4 bg-gray-400 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            ></input>
          </div>
        </div>
      </div>
      <div className="p-2 w-full">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-400">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full bg-gray-400 bg-opacity-40 rounded border border-gray-700 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
          ></textarea>
        </div>
      </div>
      <div className="p-2 w-full">
        <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
          送信する
        </button>
      </div>
      <div className="p-2 w-full pt-8 mt-8 border-t border-gray-800 text-center">
        <p className="leading-normal my-5">ReCodeYoiko</p>
        <span className="inline-flex">
          <a className="ml-4 text-gray-500">
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a className="ml-4 text-gray-500">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
        </span>
      </div>
    </div>
  );
}

export default ContactPage;
