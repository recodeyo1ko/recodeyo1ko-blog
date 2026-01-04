import Pixelizer from "./_components/pixelizer";

export default function Page() {
  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
        <div className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              画像のピクセル化
            </h1>
            <p className="text-sm text-zinc-400">
              画像を取り込み、解像度を落としてピクセルっぽく変換します。
            </p>
          </header>

          <Pixelizer />
        </div>
      </div>
    </main>
  );
}
