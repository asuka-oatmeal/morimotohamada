import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, getCategoryByLabel } from "@/lib/categories";
import ArticleEyecatch from "@/app/components/ArticleEyecatch";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Hero */}
        <section className="mb-8 rounded-lg bg-white p-5 shadow-sm sm:p-8">
          <h2
            className="text-lg font-bold text-[var(--color-primary)] sm:text-2xl"

          >
            暮らしに役立つ法律知識を
            <br className="sm:hidden" />
            わかりやすく解説
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:mt-3 sm:text-base">
            離婚・相続・交通事故・労働問題など、日常生活で直面しうる法律の疑問について、専門的な内容を一般の方にもわかりやすく解説しています。
          </p>
          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1 text-xs font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white sm:text-sm"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--color-primary)] sm:mb-6 sm:text-lg">
            <span className="inline-block h-5 w-1 rounded bg-[var(--color-primary)]" />
            新着記事
          </h3>
          {articles.length === 0 ? (
            <p className="text-gray-500">記事はまだありません。</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => {
                const catInfo = getCategoryByLabel(article.category);
                return (
                  <article
                    key={article.slug}
                    className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md"
                  >
                    <div className="flex">
                      {/* Thumbnail */}
                      <ArticleEyecatch
                        categorySlug={catInfo?.slug || "divorce"}
                        categoryLabel={article.category}
                        size="small"
                      />
                      <div className="flex-1 p-3 sm:p-5">
                        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                          <Link
                            href={`/category/${catInfo?.slug || ""}`}
                            className="rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 sm:text-xs"
                          >
                            {article.category}
                          </Link>
                          <time className="text-[11px] text-gray-400 sm:text-xs">
                            {article.date}
                          </time>
                        </div>
                        <Link href={`/blog/${article.slug}`}>
                          <h4 className="text-sm font-bold leading-relaxed text-gray-800 transition group-hover:text-[var(--color-primary)] sm:text-base">
                            {article.title}
                          </h4>
                        </Link>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2 sm:mt-1.5 sm:text-sm">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Sidebar */}
      <aside className="w-full shrink-0 space-y-5 lg:w-72">
        {/* CTA */}
        <div className="cta-banner">
          <h3>法律の悩みを解決したい方へ</h3>
          <p>
            お近くの弁護士に無料で相談できる窓口をご案内しています。
          </p>
          <span className="cta-button">弁護士に相談する</span>
        </div>

        {/* Categories */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">お悩み別カテゴリ</div>
          <div className="sidebar-section-body">
            <ul className="space-y-0">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between border-b border-gray-100 py-2 text-sm text-gray-700 transition hover:text-[var(--color-primary)]"
                  >
                    <span>{cat.label}</span>
                    <span className="text-gray-300">&rsaquo;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular articles */}
        {articles.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">人気の記事</div>
            <div className="sidebar-section-body">
              <ul className="space-y-0">
                {articles.slice(0, 5).map((article, i) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="flex gap-2 border-b border-gray-100 py-2.5 text-sm text-gray-700 transition hover:text-[var(--color-primary)]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
