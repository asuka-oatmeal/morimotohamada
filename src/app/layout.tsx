import type { Metadata } from "next";
import Link from "next/link";
import { Shippori_Mincho_B1 } from "next/font/google";
import { CATEGORIES } from "@/lib/categories";
import "./globals.css";

const logoFont = Shippori_Mincho_B1({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "法律相談ナビ -やさしい解説-";
const SITE_DESCRIPTION =
  "離婚・相続・交通事故・労働問題など、暮らしに身近な法律の基礎知識をやさしく解説。法律相談の前に知っておきたい情報をお届けします。";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
            <Link href="/" className="inline-flex items-baseline gap-0.5">
              <span
                className={`${logoFont.className} text-[22px] tracking-tight text-[var(--color-primary)] sm:text-[28px]`}
              >
                法律相談
              </span>
              <span
                className={`${logoFont.className} text-[22px] tracking-tight text-[var(--color-accent)] sm:text-[28px]`}
              >
                ナビ
              </span>
            </Link>
            <p className="hidden text-xs text-gray-400 sm:block">
              暮らしに身近な法律の基礎知識をわかりやすく解説
            </p>
          </div>

          {/* Category Navigation */}
          <nav className="bg-[var(--color-primary)]">
            <div className="mx-auto max-w-6xl overflow-x-auto px-2 sm:px-4">
              <ul className="flex items-center gap-0 py-0 text-xs sm:text-sm">
                <li className="shrink-0">
                  <Link
                    href="/"
                    className="inline-block border-r border-white/10 px-3 py-2.5 text-white/90 transition hover:bg-white/10 hover:text-white sm:px-4 sm:py-3"
                  >
                    ホーム
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug} className="shrink-0">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-block border-r border-white/10 px-3 py-2.5 text-white/90 transition hover:bg-white/10 hover:text-white sm:px-4 sm:py-3"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-300 bg-[var(--color-primary)] text-white/70">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
            {/* Footer nav */}
            <div className="grid grid-cols-2 gap-6 text-xs sm:grid-cols-4 sm:text-sm">
              <div>
                <p className="mb-2 font-bold text-white/90">カテゴリ</p>
                <ul className="space-y-1.5">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition hover:text-white"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-bold text-white/90">&nbsp;</p>
                <ul className="space-y-1.5">
                  {CATEGORIES.slice(4).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition hover:text-white"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <p className="mb-2 font-bold text-white/90">
                  法律相談ナビについて
                </p>
                <p className="text-[11px] leading-relaxed text-white/50 sm:text-xs">
                  本サイトは法律に関する一般的な情報提供を目的としており、個別の法的助言を行うものではありません。具体的な問題については、弁護士等の専門家にご相談ください。
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-center text-[11px] text-white/40 sm:text-xs">
              &copy; {new Date().getFullYear()} 法律相談ナビ All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
