export type CommandItem = {
  label: string;
  command: string;
};

export type CommandGroup = {
  title: string;
  description: string;
  items: CommandItem[];
};

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    title: "Windows（PowerShell）",
    description:
      "ハッシュ値（SHA-256）やファイルサイズを確認するための PowerShell コマンドです。",
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
        command:
          "Get-Item .\\<FILENAME> | Select-Object Name,@{Name='Size';Expression={ '{0:N0} B' -f $_.Length }}",
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
    description:
      "RHEL / 他の多くの Linux ディストリビューションで利用できるハッシュ計算コマンドです。",
    items: [
      { label: "SHA-256 ハッシュを計算", command: "sha256sum <FILENAME>" },
      {
        label: "MD5 ハッシュを計算（必要な場合のみ）",
        command: "md5sum <FILENAME>",
      },
    ],
  },
  {
    title: "RHEL（サイズ & 圧縮）",
    description:
      "ファイルサイズや gzip 圧縮後のサイズ・圧縮率を確認するための例です。",
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
