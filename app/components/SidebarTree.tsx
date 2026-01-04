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

// 行（Notion風）
const row =
  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm " +
  "text-zinc-100 hover:bg-white/[0.06] active:bg-white/10 transition-colors select-none";

// ✅ トグル+📁の2アイコン分を入れられるように幅を広げる（ここ重要）
const icon = "w-8 shrink-0 text-zinc-400 group-hover:text-zinc-200";

const sectionLabel =
  "px-2 mt-4 mb-2 text-[11px] font-semibold tracking-wider text-zinc-500";

// 大大項目（目立たせたい）
const topRow =
  "group flex items-center gap-2 rounded-md px-2 py-2 text-sm " +
  "text-zinc-100 hover:bg-white/[0.07] active:bg-white/10 transition-colors select-none";

const topIcon = "w-5 shrink-0 text-zinc-300 group-hover:text-zinc-100";

const topBadge =
  "ml-auto text-[10px] px-1.5 py-0.5 rounded-md border border-white/10 " +
  "bg-white/[0.02] text-zinc-500 group-hover:text-zinc-400";

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
  ariaExpanded,
}: {
  onClick: () => void;
  iconNode: React.ReactNode;
  label: string;
  title?: string;
  indent?: number;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? label}
      className={`${row} w-full text-left`}
      style={{ marginLeft: indent }}
      aria-expanded={ariaExpanded}
    >
      <span className={icon}>{iconNode}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

// ▾/▸ + 📁 を “確実にスペース確保” して表示する
const toggleFolderIcon = (open: boolean) => (
  <span className="inline-flex items-center gap-1">
    <span aria-hidden className="inline-flex w-3 justify-center">
      {open ? "▾" : "▸"}
    </span>
    <span aria-hidden className="inline-flex w-4 justify-center">
      📁
    </span>
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
  // カテゴリ：デフォルト開く（今まで通り）
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const node of categoryTree) initial[node.category.id] = true;
    return initial;
  });

  // 便利ツール：デフォルト閉じる（あなたの要件）
  const [toolOpen, setToolOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of toolGroups) initial[g.title] = false;
    return initial;
  });

  return (
    <div className="h-full px-3 py-4 text-zinc-100 flex flex-col bg-transparent">
      {/* タイトル */}
      <div className="px-2">
        <div className="text-sm font-semibold text-zinc-100 truncate">
          {title}
        </div>
        <div className="mt-5 border-t border-white/10" />
      </div>

      {/* 大大項目（Notionっぽく目立たせる） */}
      <div className="mt-3 space-y-1">
        <TopLink href={homeHref} iconNode="⌂" label="Home" hint="TOP" />
      </div>

      {/* 中央 */}
      <div className="mt-4 border-t border-white/10" />

      <div className="mt-2">
        {/* BLOG：カテゴリ → タグ */}
        <TopLink href={blogHref} iconNode="≡" label="ブログ" hint="BLOG" />

        <div className="space-y-1">
          {categoryTree.map(({ category, tags }) => {
            const isOpen = open[category.id] ?? false;

            return (
              <div key={category.id} className="space-y-1">
                {/* ✅ カテゴリは「リンクなし」1行トグルに統一 */}
                <RowButton
                  onClick={() =>
                    setOpen((p) => ({ ...p, [category.id]: !isOpen }))
                  }
                  iconNode={toggleFolderIcon(isOpen)}
                  label={category.name}
                  title={category.name}
                  ariaExpanded={isOpen}
                />

                {/* タグ（子）：リンクは残す（必要なら /blogs への絞り込みURLにも変更可） */}
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

        {/* 便利ツール：グループトグル */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <TopLink
            href="/useful_tools"
            iconNode="≡"
            label="便利ツール"
            hint="TOOLS"
          />

          <div className="space-y-2">
            {toolGroups.map((g) => {
              const isOpen = toolOpen[g.title] ?? false;

              return (
                <div key={g.title} className="space-y-1">
                  <RowButton
                    onClick={() =>
                      setToolOpen((p) => ({ ...p, [g.title]: !isOpen }))
                    }
                    iconNode={toggleFolderIcon(isOpen)}
                    label={g.title}
                    title={g.title}
                    ariaExpanded={isOpen}
                  />

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

      {/* 署名：ページ最下部に固定（サイドバー自体はスクロールしない前提） */}
      <div className="mt-auto pt-3 px-2 border-t border-white/5">
        <div className="text-xs text-zinc-500">@ {authorName}</div>
      </div>
    </div>
  );
}
