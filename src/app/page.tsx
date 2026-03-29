import Link from "next/link";
import { getAllArticles, getArticleCategorySlug } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
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
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-meta)] sm:mt-3 sm:text-base">
            離婚・相続・交通事故・労働問題など、日常生活で直面しうる法律の疑問について、専門的な内容を一般の方にもわかりやすく解説しています。
          </p>
          {/* Category chips */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
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
            <p className="text-[var(--color-meta)]">記事はまだありません。</p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => {
                const catSlug = getArticleCategorySlug(article.category);
                return (
                  <article
                    key={article.slug}
                    className="group overflow-hidden rounded-lg border border-[var(--color-sub)] bg-white transition hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Thumbnail */}
                      <ArticleEyecatch
                        categorySlug={catSlug}
                        categoryLabel={article.category}
                        size="small"
                      />
                      <div className="flex-1 p-3 sm:p-5">
                        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                          <Link
                            href={`/${catSlug}`}
                            className="rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 sm:text-xs"
                          >
                            {article.category}
                          </Link>
                          <time className="text-[11px] text-[var(--color-meta)] sm:text-xs">
                            {article.date}
                          </time>
                        </div>
                        <Link href={`/${catSlug}/${article.slug}`}>
                          <h4 className="text-sm font-bold leading-relaxed text-[var(--color-foreground)] transition group-hover:text-[var(--color-primary)] sm:text-base">
                            {article.title}
                          </h4>
                        </Link>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--color-meta)] line-clamp-2 sm:mt-1.5 sm:text-sm">
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
          <div className="cta-banner-icon">💬</div>
          <h3>法律の最新情報をLINEでお届け</h3>
          <div className="cta-banner-features">
            <span>✓ 最新の法改正ニュース</span>
            <span>✓ 知っておくべき法律知識</span>
            <span>✓ 無料で登録・いつでも解除OK</span>
          </div>
          <a href="https://lin.ee/6cJgVjJ" target="_blank" rel="noopener noreferrer" className="cta-button">LINEで友だち追加する</a>
        </div>

        {/* Categories */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">お悩み別カテゴリ</div>
          <div className="sidebar-section-body">
            <ul className="space-y-0">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="flex items-center justify-between border-b border-[var(--color-sub)]/50 py-2 text-sm text-[var(--color-foreground)] transition hover:text-[var(--color-primary)]"
                  >
                    <span>{cat.label}</span>
                    <span className="text-[var(--color-sub)]">&rsaquo;</span>
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
                {articles.slice(0, 5).map((article, i) => {
                  const aCatSlug = getArticleCategorySlug(article.category);
                  return (
                    <li key={article.slug}>
                      <Link
                        href={`/${aCatSlug}/${article.slug}`}
                        className="flex gap-2 border-b border-[var(--color-sub)]/50 py-2.5 text-sm text-[var(--color-foreground)] transition hover:text-[var(--color-primary)]"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                          {article.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
