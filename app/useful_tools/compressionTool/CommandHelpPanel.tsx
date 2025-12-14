// app/useful_tools/compressionTool/CommandHelpPanel.tsx
"use client";

import { useState } from "react";

type CommandItem = {
  label: string;
  command: string;
};

type CommandGroup = {
  title: string;
  description: string;
  items: CommandItem[];
};

const COMMAND_GROUPS: CommandGroup[] = [
  {
    title: "Windows（PowerShell）",
    description: "ハッシュ値（SHA-256）やファイルサイズを確認するための PowerShell コマンドです。",
    items: [
      {
        label: "SHA-256 ハッシュを計算",
        command: "Get-FileHash -Algorithm SHA256 .\\<FILENAME>",
      },
      {
        label: "ファイルサイズ（バイト）を取得",
        command: "(Get-Item .\\<FILENAME>).Length",
      },
      {
        label: "人間に読みやすい形式でサイズを表示",
        command: "Get-Item .\\<FILENAME> | Select-Object Name,@{Name='Size';Expression={ '{0:N0} B' -f $_.Length }}",
      },
    ],
  },
  {
    title: "Windows（コマンドプロンプト）",
    description: "従来の cmd.exe で利用できる基本的なコマンドです。",
    items: [
      {
        label: "SHA-256 ハッシュを計算",
        command: "certutil -hashfile <FILENAME> SHA256",
      },
      {
        label: "ファイルサイズを確認（dir コマンド）",
        command: "dir <FILENAME>",
      },
    ],
  },
  {
    title: "RHEL（ハッシュ）",
    description: "RHEL / 他の多くの Linux ディストリビューションで利用できるハッシュ計算コマンドです。",
    items: [
      {
        label: "SHA-256 ハッシュを計算",
        command: "sha256sum <FILENAME>",
      },
      {
        label: "MD5 ハッシュを計算（必要な場合のみ）",
        command: "md5sum <FILENAME>",
      },
    ],
  },
  {
    title: "RHEL（サイズ & 圧縮）",
    description: "ファイルサイズや gzip 圧縮後のサイズ・圧縮率を確認するための例です。",
    items: [
      {
        label: "人間に読みやすい形式でサイズ表示",
        command: "ls -lh <FILENAME>",
      },
      {
        label: "バイト単位のファイルサイズを表示",
        command: "stat -c%s <FILENAME>",
      },
      {
        label: "gzip で圧縮（元ファイルを残す）",
        command: "gzip -k <FILENAME>",
      },
      {
        label: "元ファイルと .gz のサイズを比較表示",
        command: "ls -lh <FILENAME> <FILENAME>.gz",
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.97]"
    >
      {copied ? "コピー済み" : "コピー"}
    </button>
  );
}

export default function CommandHelpPanel() {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        大きなファイルや詳細情報のためのコマンド表（Windows / RHEL）
      </h2>
      <p className="mb-4 text-xs text-gray-600">
        1GB を超えるファイルや、より詳細な情報が必要な場合は、以下のコマンドを端末上で実行してください。
        <code className="rounded bg-gray-100 px-1 py-[1px]">
          {"<FILENAME>"}
        </code>
        を実際のパスやファイル名に置き換えて使います。
        各行右側の「コピー」ボタンからコマンドをそのままコピーできます。
      </p>

      <div className="space-y-4">
        {COMMAND_GROUPS.map((group, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-800">
              {group.title}
            </h3>
            <p className="mt-1 mb-3 text-xs text-gray-500">
              {group.description}
            </p>
            <div className="space-y-2">
              {group.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 rounded-md border border-gray-100 bg-gray-50 p-2 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-700">
                      {item.label}
                    </span>
                    <CopyButton text={item.command} />
                  </div>
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-gray-800">
                    {item.command}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
