import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllArticles, getArticleCategorySlug } from "@/lib/articles";
import { CATEGORIES, getCategoryByArticleCategory } from "@/lib/categories";
import TableOfContents from "@/app/components/TableOfContents";
import ArticleEyecatch from "@/app/components/ArticleEyecatch";

type Params = { category: string; slug: string };

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    category: getArticleCategorySlug(article.category),
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const categoryInfo = getCategoryByArticleCategory(article.category);

  // Verify the category in URL matches the article's actual category
  if (categoryInfo && categoryInfo.slug !== category) {
    notFound();
  }

  // Related articles (same parent category, exclude self)
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => {
      const aCat = getCategoryByArticleCategory(a.category);
      return aCat?.slug === categoryInfo?.slug && a.slug !== slug;
    })
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Eyecatch */}
          {categoryInfo && (
            <ArticleEyecatch
              categorySlug={categoryInfo.slug}
              categoryLabel={article.category}
              title={article.title}
              size="large"
            />
          )}

          {/* Category header bar */}
          <div className="bg-[var(--color-primary)] px-4 py-2.5 sm:px-6 sm:py-3">
            <nav className="text-xs text-[var(--color-accent-bg)]/70 sm:text-sm">
              <Link href="/" className="hover:text-white">
                ホーム
              </Link>
              <span className="mx-1.5">&gt;</span>
              {categoryInfo ? (
                <Link
                  href={`/${categoryInfo.slug}`}
                  className="hover:text-white"
                >
                  {article.category}
                </Link>
              ) : (
                <span>{article.category}</span>
              )}
              <span className="mx-1.5">&gt;</span>
              <span className="text-[var(--color-accent-bg)]">この記事</span>
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Meta */}
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Link
                href={categoryInfo ? `/${categoryInfo.slug}` : "/"}
                className="rounded-full bg-[var(--color-primary)]/10 px-3 py-0.5 text-[11px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 sm:text-xs"
              >
                {article.category}
              </Link>
              <time className="text-xs text-[var(--color-meta)] sm:text-sm">
                {article.date}
              </time>
            </div>

            {/* Title */}
            <h1
              className="mb-4 text-xl font-bold leading-snug text-[var(--color-foreground)] sm:mb-6 sm:text-2xl lg:text-3xl"

            >
              {article.title}
            </h1>

            {/* Divider */}
            <div className="mb-4 h-px bg-[var(--color-sub)] sm:mb-6" />

            {/* TOC */}
            <TableOfContents />

            {/* Content */}
            <div
              className="prose prose-gray max-w-none prose-a:text-[var(--color-primary-light)] sm:prose-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* CTA inline */}
            <div className="mt-8 rounded-lg border-2 border-[var(--color-accent)]/30 bg-[var(--color-accent-bg)]/50 p-4 text-center sm:mt-10 sm:p-6">
              <p className="text-sm font-bold text-[var(--color-foreground)] sm:text-base">
                暮らしの法律ガイドをLINEでお届け
              </p>
              <p className="mt-1 text-xs text-[var(--color-meta)] sm:text-sm">
                最新の法改正情報や知っておくべき法律知識を、LINEで定期的にお届けします。友だち追加で今すぐ受け取れます。
              </p>
              <a href="https://lin.ee/6cJgVjJ" target="_blank" rel="noopener noreferrer" className="cta-button mt-3 inline-block">
                LINEで友だち追加する
              </a>
            </div>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-6 sm:mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
          >
            &larr; 記事一覧に戻る
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full shrink-0 space-y-5 lg:w-72">
        {/* CTA */}
        <div className="cta-banner">
          <h3>暮らしの法律ガイドをLINEでお届け</h3>
          <p>最新の法改正情報や知っておくべき法律知識を、LINEで定期的にお届けします。友だち追加で今すぐ受け取れます。</p>
          <a href="https://lin.ee/6cJgVjJ" target="_blank" rel="noopener noreferrer" className="cta-button">LINEで友だち追加する</a>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">関連記事</div>
            <div className="sidebar-section-body">
              <ul className="space-y-0">
                {relatedArticles.map((a) => {
                  const aCatSlug = getArticleCategorySlug(a.category);
                  return (
                    <li key={a.slug}>
                      <Link
                        href={`/${aCatSlug}/${a.slug}`}
                        className="block border-b border-[var(--color-sub)]/50 py-2.5 text-xs leading-relaxed text-[var(--color-foreground)] transition hover:text-[var(--color-primary)] sm:text-sm"
                      >
                        {a.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

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
      </aside>
    </div>
  );
}
