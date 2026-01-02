import CommandGroupList from "../../components/CommandGroupList";
import { COMMAND_GROUPS } from "./commands";

export default function CommandHelpPanel() {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        大きなファイルや詳細情報のためのコマンド表（Windows / RHEL）
      </h2>
      <p className="mb-4 text-xs text-gray-600">
        1GB
        を超えるファイルや、より詳細な情報が必要な場合は、以下のコマンドを端末上で実行してください。
        <code className="rounded bg-gray-100 px-1 py-[1px]">
          {"<FILENAME>"}
        </code>
        を実際のパスやファイル名に置き換えて使います。各行右側の「コピー」ボタンからコマンドをそのままコピーできます。
      </p>

      <CommandGroupList groups={COMMAND_GROUPS} />
    </section>
  );
}
