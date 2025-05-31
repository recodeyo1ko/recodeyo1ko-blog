import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

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
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="grid lg:grid-cols-12 md:grid-cols-1 mx-10 py-6 sm:py-8">
          <div className="col-span-8 gap-4 overflow-hidden rounded-lg border ">
            {children}
          </div>
          <div className="col-span-4">
            <Sidebar />
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
