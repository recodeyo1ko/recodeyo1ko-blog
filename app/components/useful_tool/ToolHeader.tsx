import React from "react";

type Props = {
  title: string;
  description?: string;
  steps?: React.ReactNode; // <li>...</li> を渡す
  stepsTitle?: string; // 例: "使い方"
  stepsVariant?: "ordered" | "unordered"; // 番号 or 箇条書き
  align?: "left" | "center"; // header で中央寄せしたい
  size?: "default" | "hero"; // 大きめタイトル用
  className?: string;
};

export default function ToolHeader({
  title,
  description,
  steps,
  stepsTitle = "使い方",
  stepsVariant = "ordered",
  align = "center",
  size = "hero",
  className = "",
}: Props) {
  const isCenter = align === "center";

  const titleClass =
    size === "hero"
      ? "text-3xl sm:text-4xl font-semibold text-zinc-100"
      : "text-2xl font-semibold text-zinc-100";

  const descClass =
    size === "hero"
      ? "text-base sm:text-lg text-zinc-400"
      : "text-sm text-zinc-400";

  const wrap = isCenter ? "text-center" : "text-left";
  const stepsWrap = isCenter ? "mx-auto" : "";

  const ListTag = stepsVariant === "ordered" ? "ol" : "ul";
  const listClass =
    stepsVariant === "ordered"
      ? "list-decimal list-inside space-y-1"
      : "list-disc list-inside pl-5 space-y-1";

  return (
    <header className={`${wrap} ${className}`}>
      <h1 className={`${titleClass} mb-4`}>{title}</h1>

      {description && <p className={`${descClass} mb-6`}>{description}</p>}

      {steps && (
        <div className={`text-sm text-zinc-500 ${stepsWrap}`}>
          {stepsTitle ? (
            <div className="mb-2 font-semibold text-zinc-400">{stepsTitle}</div>
          ) : null}

          <ListTag className={listClass}>{steps}</ListTag>
        </div>
      )}
    </header>
  );
}
