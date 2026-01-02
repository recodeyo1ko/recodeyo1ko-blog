import ToolGroupList from "./ToolGroupList";
import { TOOL_GROUPS } from "./tools";

export default function UsefulToolsPage() {
  return (
    <main className="mx-auto max-w-screen-lg px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">便利ツール一覧</h1>

      <p className="mb-8 text-sm text-gray-600">
        日々の作業や確認に使える、軽量なツールをまとめています。
      </p>

      <ToolGroupList groups={TOOL_GROUPS} />
    </main>
  );
}
