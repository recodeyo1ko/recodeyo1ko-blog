"use client";

import Link from "next/link";
import { useState } from "react";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

type ToolItem = { label: string; href: string; icon?: string };
type ToolGroup = { title: string; items: ToolItem[] };

type Props = {
  title: string;
  homeHref: string;
  blogHref: string;
  authorName: string;
  categoryTree: { category: Category; tags: Tag[] }[];
  toolGroups: ToolGroup[];
};

const topRow =
  "group flex items-center gap-2 rounded-md px-2 py-2 text-sm " +
  "text-zinc-100 hover:bg-white/[0.07] active:bg-white/10 transition-colors select-none";

const topIcon = "w-5 shrink-0 text-zinc-300 group-hover:text-zinc-100";

const topBadge =
  "ml-auto text-[10px] px-1.5 py-0.5 rounded-md border border-white/10 " +
  "bg-white/[0.02] text-zinc-500 group-hover:text-zinc-400";

const row =
  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm " +
  "text-zinc-100 hover:bg-white/[0.06] active:bg-white/10 transition-colors select-none";

const icon = "w-8 shrink-0 text-zinc-400 group-hover:text-zinc-200";

const sectionLabel =
  "px-2 mt-4 mb-2 text-[11px] font-semibold tracking-wider text-zinc-500";

function TopLink({
  href,
  iconNode,
  label,
  hint,
  title,
}: {
  href: string;
  iconNode: React.ReactNode;
  label: string;
  hint?: string;
  title?: string;
}) {
  return (
    <Link href={href} title={title ?? label} className={topRow}>
      <span className={topIcon}>{iconNode}</span>
      <span className="min-w-0 flex-1 truncate font-semibold">{label}</span>
      {hint ? <span className={topBadge}>{hint}</span> : null}
    </Link>
  );
}

function RowLink({
  href,
  iconNode,
  label,
  title,
  indent = 0,
}: {
  href: string;
  iconNode: React.ReactNode;
  label: string;
  title?: string;
  indent?: number;
}) {
  return (
    <Link
      href={href}
      title={title ?? label}
      className={row}
      style={{ marginLeft: indent }}
    >
      <span className={icon}>{iconNode}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </Link>
  );
}

function RowButton({
  onClick,
  iconNode,
  label,
  title,
  indent = 0,
}: {
  onClick: () => void;
  iconNode: React.ReactNode;
  label: string;
  title?: string;
  indent?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? label}
      className={`${row} w-full text-left`}
      style={{ marginLeft: indent }}
    >
      <span className={icon}>{iconNode}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

// ▾/▸ の幅を固定して “文字かぶり” を防ぐ
const chevron = (open: boolean) => (
  <span aria-hidden className="w-3 text-center">
    {open ? "▾" : "▸"}
  </span>
);

export default function SidebarTree({
  title,
  homeHref,
  blogHref,
  authorName,
  categoryTree,
  toolGroups,
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const node of categoryTree) initial[node.category.id] = true;
    return initial;
  });

  const [toolOpen, setToolOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of toolGroups) initial[g.title] = false;
    return initial;
  });

  return (
    <div className="px-3 py-4 text-zinc-100 flex flex-col bg-transparent">
      {/* タイトル */}
      <div className="px-2">
        <div className="text-sm font-semibold text-zinc-100 truncate">
          {title}
        </div>
        <div className="mt-5 border-t border-white/10" />
      </div>

      {/* Home */}
      <div className="mt-3">
        <TopLink href={homeHref} iconNode="⌂" label="Home" hint="TOP" />
      </div>
      {/* 中央：スクロール */}
      <div className="pr-1 mt-2 border-t border-white/5">
        {/* BLOG（大大項目） */}
        <TopLink href={blogHref} iconNode="≡" label="ブログ" hint="BLOG" />

        <div className="space-y-1">
          {categoryTree.map(({ category, tags }) => {
            const isOpen = open[category.id] ?? false;

            return (
              <div key={category.id} className="space-y-1">
                {/*  1行の中で “トグル + 📁 + カテゴリ名” を揃える */}
                <div className="flex items-center gap-1">
                  {/* トグル（幅固定・Rowと同じ見た目） */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpen((p) => ({ ...p, [category.id]: !isOpen }))
                    }
                    className={`${row} px-2`}
                    title={isOpen ? "閉じる" : "開く"}
                    aria-label="toggle category"
                  >
                    <span className={icon}>{chevron(isOpen)}</span>
                  </button>

                  {/* カテゴリリンク（RowLink） */}
                  <div className="min-w-0 flex-1">
                    <RowLink
                      href={`/categories/${encodeURIComponent(category.name)}`}
                      iconNode="📁"
                      label={category.name}
                      title={category.name}
                    />
                  </div>
                </div>

                {/* タグ（子） */}
                {isOpen && (
                  <div className="space-y-1 ml-6">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <RowLink
                          key={tag.id}
                          href={`/tags/${encodeURIComponent(tag.name)}`}
                          iconNode="#"
                          label={tag.name}
                          title={tag.name}
                        />
                      ))
                    ) : (
                      <div className="px-2 py-1 text-xs text-zinc-500">
                        No tags
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 便利ツール */}
        <div className="mt-6 border-t border-white/5 pt-4">
          {/*  大大項目：ブログと共通アイコン */}
          <TopLink
            href="/useful_tools"
            iconNode="≡"
            label="便利ツール"
            hint="TOOLS"
          />

          <div className="mt-2 space-y-2">
            {toolGroups.map((g) => {
              const isOpen = toolOpen[g.title] ?? false;

              return (
                <div key={g.title} className="space-y-1">
                  {/* ✅ ひとまとまり：見出し行クリックで開閉 */}
                  <RowButton
                    onClick={() =>
                      setToolOpen((p) => ({ ...p, [g.title]: !isOpen }))
                    }
                    iconNode={
                      <span className="inline-flex items-center gap-1">
                        {/* トグル：幅固定 */}
                        <span
                          aria-hidden
                          className="inline-flex w-3 justify-center text-zinc-400"
                        >
                          {isOpen ? "▾" : "▸"}
                        </span>

                        {/* フォルダ：幅固定 */}
                        <span
                          aria-hidden
                          className="inline-flex w-4 justify-center text-zinc-400"
                        >
                          📁
                        </span>
                      </span>
                    }
                    label={g.title}
                    title={g.title}
                  />

                  {/* ✅ 子要素（ツール） */}
                  {isOpen && (
                    <div className="space-y-1 ml-6">
                      {g.items.map((t) => (
                        <RowLink
                          key={t.href}
                          href={t.href}
                          iconNode="#"
                          label={t.label}
                          title={t.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 署名 */}
      <div className="mt-auto pt-3 px-2 border-t border-white/5">
        <div className="text-xs text-zinc-500">@ {authorName}</div>
      </div>
    </div>
  );
}
