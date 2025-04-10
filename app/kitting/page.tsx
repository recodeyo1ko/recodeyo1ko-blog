"use client";

import { useState } from "react";

const KittingPage = () => {
  const [showDictionary, setShowDictionary] = useState(false);

  const toggleDictionary = () => {
    setShowDictionary((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">おすすめキッティング</h1>

      <div className="w-full max-w-4xl mt-8">
        {/* トグルボタン */}
        <button
          onClick={toggleDictionary}
          className="text-xl font-bold mb-4 flex items-center gap-2"
        >
          <span>{showDictionary ? "▲" : "▼"}</span>
          <span>単語登録</span>
        </button>

        {/* トグル中身 */}
        {showDictionary && (
          <div className="space-y-4">
            <div>単語登録画面</div>
            <img
              src="/img/keyboard_regisster_form.png"
              alt="単語登録画面"
              className="w-full max-w-md mx-auto"
              style={{ maxWidth: "100%" }}
            />
            <div>単語登録リスト</div>
            <img
              src="/img/kyyboard_register_list.png"
              alt="単語登録リスト"
              className="w-full max-w-md mx-auto"
              style={{ maxWidth: "100%" }}
            />
            <div>単語対応図</div>
            <img
              src="/img/keyboard_combined_z.png"
              alt="単語対応図"
              className="w-full max-w-md mx-auto"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KittingPage;
