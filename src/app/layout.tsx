import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "森本濱田法律コラム",
    template: "%s | 森本濱田法律コラム",
  },
  description:
    "法律に関する基礎知識や最新の法改正情報をわかりやすく解説するメディアサイトです。",
  metadataBase: new URL("https://morimotohamada.com"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "森本濱田法律コラム",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <a href="/" className="text-xl font-bold text-gray-900">
              森本濱田法律コラム
            </a>
            <p className="mt-1 text-sm text-gray-500">
              法律の基礎知識をわかりやすく解説
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 森本濱田法律コラム
          </div>
        </footer>
      </body>
    </html>
  );
}
