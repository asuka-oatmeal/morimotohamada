import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
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
                法律相談ナビ
              </h1>
              <p className="mt-1 text-sm tracking-widest text-[var(--color-accent)]">
                -やさしい解説-
              </p>
            </Link>
          </div>
          {/* Category Navigation */}
          <nav className="border-t border-white/10 bg-[var(--color-primary-light)]">
            <div className="mx-auto max-w-5xl overflow-x-auto px-4">
              <ul className="flex items-center justify-center gap-1 py-2 text-sm">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="rounded px-3 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
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
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-[var(--color-primary)] text-white/60">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="text-center">
              <p
                className="text-lg font-bold text-white/90"
                style={{ fontFamily: "var(--font-noto-serif-jp)" }}
              >
                法律相談ナビ
              </p>
              <p className="mt-1 text-xs tracking-widest text-[var(--color-accent)]">
                -やさしい解説-
              </p>
              <p className="mt-4 text-xs text-white/40">
                本サイトは法律に関する一般的な情報提供を目的としており、個別の法的助言を行うものではありません。具体的な問題については、弁護士等の専門家にご相談ください。
              </p>
              <p className="mt-3 text-xs">
                &copy; {new Date().getFullYear()} 法律相談ナビ All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
