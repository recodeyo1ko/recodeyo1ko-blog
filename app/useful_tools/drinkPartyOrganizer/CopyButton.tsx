// app/drinkPartyOrganizer/CopyButton.tsx
"use client";

interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("コピーしました！");
    } catch (err) {
      alert("コピーに失敗しました。");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
    >
      コピー
    </button>
  );
};

export default CopyButton;
