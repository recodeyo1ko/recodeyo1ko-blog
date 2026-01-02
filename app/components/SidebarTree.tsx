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
  authorName: string;
  categoryTree: { category: Category; tags: Tag[] }[];
  toolGroups: ToolGroup[];
};

const row =
  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm " +
  " text-zinc-100 hover:bg-white/[0.06] active:bg-white/10 transition-colors select-none";

const icon = "w-5 shrink-0 text-zinc-400 group-hover:text-zinc-200";

const sectionLabel =
  "px-2 mt-4 mb-2 text-[11px] font-semibold tracking-wider text-zinc-500";

function RowLink({
  href,
  iconText,
  label,
  title,
  indent = 0,
}: {
  href: string;
  iconText: string;
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
      <span className={icon}>{iconText}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </Link>
  );
}

function RowButton({
  onClick,
  iconText,
  label,
  title,
  indent = 0,
}: {
  onClick: () => void;
  iconText: string;
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
      <span className={icon}>{iconText}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

export default function SidebarTree({
  title,
  homeHref,
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
    for (const g of toolGroups) initial[g.title] = true;
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

      {/* Home */}
      <div className="mt-3">
        <RowLink href={homeHref} iconText="⌂" label="Home" />
      </div>

      {/* 中央：スクロール */}
      <div className="flex-1 overflow-y-auto pr-1 mt-2">
        {/* CATEGORIES */}
        <div className={sectionLabel}>CATEGORIES</div>

        <div className="space-y-1">
          {categoryTree.map(({ category, tags }) => {
            const isOpen = open[category.id] ?? false;

            return (
              <div key={category.id} className="space-y-1">
                {/* カテゴリ行：トグル + リンクも同じ見た目で統一 */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setOpen((p) => ({ ...p, [category.id]: !isOpen }))
                    }
                    className={row}
                    title={isOpen ? "閉じる" : "開く"}
                    aria-label="toggle category"
                    style={{ paddingLeft: 8, paddingRight: 8 }}
                  >
                    <span className={icon}>{isOpen ? "▾" : "▸"}</span>
                  </button>

                  <div className="flex-1">
                    <RowLink
                      href={`/categories/${encodeURIComponent(category.name)}`}
                      iconText="📁"
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
                          iconText="#"
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

        {/* USEFUL TOOLS */}
        <div className="mt-6 border-t border-white/5 pt-4">
          {/* 見出しリンクも RowLink に統一 */}
          <RowLink
            href="/useful_tools"
            iconText="≡"
            label="USEFUL TOOLS"
            title="便利ツール一覧"
          />

          <div className="mt-2 space-y-2">
            {toolGroups.map((g) => {
              const isOpen = toolOpen[g.title] ?? true;

              return (
                <div key={g.title} className="space-y-1">
                  {/* ツールグループ：トグルも RowButton で統一 */}
                  <RowButton
                    onClick={() =>
                      setToolOpen((p) => ({ ...p, [g.title]: !isOpen }))
                    }
                    iconText={isOpen ? "▾" : "▸"}
                    label={g.title}
                    title={g.title}
                  />

                  {/* グループ内ツール（子） */}
                  {isOpen && (
                    <div className="space-y-1 ml-6">
                      {g.items.map((t) => (
                        <RowLink
                          key={t.href}
                          href={t.href}
                          iconText="#"
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

      {/* 署名：区切り線を統一（border-white/5） */}
      <div className="mt-4 pt-3 px-2 border-t border-white/5">
        <div className="text-xs text-zinc-500">@ {authorName}</div>
      </div>
    </div>
  );
}
