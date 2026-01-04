import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import ResponsiveSidebar from "@/app/components/ResponsiveSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "仕事を頑張るために",
  description: "Studying to work hard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${inter.className} bg-app-bg text-zinc-200 antialiased`}
      >
        <div className="min-h-screen">
          {/* ✅ md未満は縦（上にメニューバー）、md以上は横並び */}
          <div className="flex flex-col md:flex-row min-h-screen">
            <ResponsiveSidebar>
              <Sidebar />
            </ResponsiveSidebar>

            <main
              className="
                flex-1
                mx-auto w-full
                max-w-5xl
                xl:max-w-6xl
                2xl:max-w-7xl
                px-4 sm:px-8 md:px-8
                py-6 sm:py-10
              "
            >
              <div className="rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="p-6 sm:p-8">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
