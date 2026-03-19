import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_NAME = "森本濱田 Legal Column";
const SITE_DESCRIPTION =
  "暮らしに身近な法律の基礎知識や最新の法改正情報をわかりやすく解説するメディアです。";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://morimotohamada.com"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
  },
};

const CATEGORIES = [
  "離婚・家事",
  "相続・遺言",
  "交通事故",
  "労働問題",
  "債務整理",
  "不動産・賃貸",
  "刑事事件",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${notoSerifJP.variable} font-sans antialiased`}
      >
        {/* Header */}
        <header className="bg-[var(--color-primary)] text-white">
          <div className="mx-auto max-w-5xl px-4 py-8 text-center">
            <Link href="/" className="inline-block">
              <h1
                className="text-3xl font-bold tracking-wide"
                style={{ fontFamily: "var(--font-noto-serif-jp)" }}
              >
                森本濱田
              </h1>
              <p className="mt-1 text-sm tracking-widest text-white/70">
                LEGAL COLUMN
              </p>
            </Link>
          </div>
          {/* Category Navigation */}
          <nav className="border-t border-white/10 bg-[var(--color-primary-light)]">
            <div className="mx-auto max-w-5xl overflow-x-auto px-4">
              <ul className="flex items-center justify-center gap-1 py-2 text-sm">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/?category=${encodeURIComponent(cat)}`}
                      className="rounded px-3 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-[var(--color-primary)] text-white/60">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="text-center">
              <p
                className="text-lg font-bold text-white/90"
                style={{ fontFamily: "var(--font-noto-serif-jp)" }}
              >
                森本濱田
              </p>
              <p className="mt-1 text-xs tracking-widest">LEGAL COLUMN</p>
              <p className="mt-4 text-xs">
                &copy; {new Date().getFullYear()} Morimoto Hamada. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
