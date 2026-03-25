import type { Metadata } from "next";
import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";
import { CATEGORIES } from "@/lib/categories";
import "./globals.css";

const logoFont = Zen_Maru_Gothic({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "暮らしの法律ガイド";
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
        <header className="border-b border-[var(--color-sub)] bg-[var(--color-background)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:py-5">
            <Link href="/" className={`${logoFont.className} inline-flex items-baseline`}>
              <span className="text-[16px] font-normal tracking-wide text-[var(--color-foreground)] sm:text-[20px]">
                くらしの
              </span>
              <span className="text-[26px] font-black tracking-tight text-[var(--color-foreground)] sm:text-[34px]">
                法律
              </span>
              <span className="text-[16px] font-bold tracking-wide text-[var(--color-foreground)] sm:text-[20px]">
                ガイド
              </span>
            </Link>
            <p className="hidden text-xs text-[var(--color-meta)] sm:block">
              暮らしに身近な法律の基礎知識をわかりやすく解説
            </p>
          </div>

          {/* Category Navigation */}
          <nav className="border-t border-[var(--color-sub)] bg-white">
            <div className="mx-auto max-w-6xl overflow-x-auto px-2 sm:px-4">
              <ul className="flex items-center gap-0 py-0 text-xs sm:text-sm">
                <li className="shrink-0">
                  <Link
                    href="/"
                    className="inline-block px-3 py-2.5 text-[var(--color-primary)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] sm:px-4 sm:py-3"
                  >
                    ホーム
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug} className="shrink-0">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-block px-3 py-2.5 text-[var(--color-primary)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] sm:px-4 sm:py-3"
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
        <footer className="border-t border-[var(--color-sub)] bg-[var(--color-primary)]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
            <div className="grid grid-cols-2 gap-6 text-xs sm:grid-cols-4 sm:text-sm">
              <div>
                <p className="mb-2 font-bold text-[var(--color-accent-bg)]">カテゴリ</p>
                <ul className="space-y-1.5 text-white/60">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition hover:text-white/90"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-bold text-[var(--color-accent-bg)]">&nbsp;</p>
                <ul className="space-y-1.5 text-white/60">
                  {CATEGORIES.slice(4).map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="transition hover:text-white/90"
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <p className="mb-2 font-bold text-[var(--color-accent-bg)]">
                  暮らしの法律ガイドについて
                </p>
                <p className="text-[11px] leading-relaxed text-white/40 sm:text-xs">
                  本サイトは法律に関する一般的な情報提供を目的としており、個別の法的助言を行うものではありません。具体的な問題については、弁護士等の専門家にご相談ください。
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-center text-[11px] text-white/30 sm:text-xs">
              &copy; {new Date().getFullYear()} 暮らしの法律ガイド All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
