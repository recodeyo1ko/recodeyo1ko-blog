import ToolGroupList from "../components/useful_tool/ToolGroupList";
import { TOOL_GROUPS } from "../components/useful_tool/tools";

export default function UsefulToolsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-10">
      <header className="pt-6 pb-4">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          便利ツール
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-500">
          日々の作業や確認に使える、軽量なツールをまとめています。
        </p>

        <div className="mt-4 border-t border-white/10" />
      </header>

      {/* ツール一覧 */}
      <section className="mt-6">
        <ToolGroupList groups={TOOL_GROUPS} />
      </section>

      {/* 下余白 */}
      <div className="h-10" />
    </main>
  );
}
