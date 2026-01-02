import CommandGroupList from "@/app/components/useful_tool/CommandGroupList";
import { COMMAND_GROUPS } from "./commands";

export default function CommandHelpPanel() {
  return (
    <section className="mb-12 rounded-lg border border-white/10 bg-white/[0.02] p-6">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-zinc-100 leading-snug">
          大きなファイルや詳細情報のためのコマンド表（Windows / RHEL）
        </h2>

        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
          1GB
          を超えるファイルや、より詳細な情報が必要な場合は、以下のコマンドを端末上で実行してください。
          <code className="mx-1 rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-[1px] font-mono text-[12px] text-zinc-200">
            {"<FILENAME>"}
          </code>
          を実際のパスやファイル名に置き換えて使います。各行右側の「コピー」ボタンからコマンドをそのままコピーできます。
        </p>

        <div className="mt-4 border-t border-white/10" />
      </header>

      <CommandGroupList groups={COMMAND_GROUPS} />
    </section>
  );
}
