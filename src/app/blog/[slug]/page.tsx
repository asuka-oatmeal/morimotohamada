import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllSlugs, getAllArticles } from "@/lib/articles";
import { CATEGORIES, getCategoryByLabel } from "@/lib/categories";
import TableOfContents from "@/app/components/TableOfContents";

type Params = { slug: string };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
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
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const categoryInfo = getCategoryByLabel(article.category);

  // Related articles (same category, exclude self)
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.slug !== slug)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Category header bar */}
          <div className="bg-[var(--color-primary)] px-4 py-2.5 sm:px-6 sm:py-3">
            <nav className="text-xs text-white/70 sm:text-sm">
              <Link href="/" className="hover:text-white">
                ホーム
              </Link>
              <span className="mx-1.5">&gt;</span>
              {categoryInfo ? (
                <Link
                  href={`/category/${categoryInfo.slug}`}
                  className="hover:text-white"
                >
                  {article.category}
                </Link>
              ) : (
                <span>{article.category}</span>
              )}
              <span className="mx-1.5">&gt;</span>
              <span className="text-white/90">この記事</span>
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Meta */}
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <Link
                href={categoryInfo ? `/category/${categoryInfo.slug}` : "/"}
                className="rounded-full bg-[var(--color-primary)]/10 px-3 py-0.5 text-[11px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 sm:text-xs"
              >
                {article.category}
              </Link>
              <time className="text-xs text-gray-400 sm:text-sm">
                {article.date}
              </time>
            </div>

            {/* Title */}
            <h1
              className="mb-4 text-xl font-bold leading-snug text-gray-900 sm:mb-6 sm:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-noto-serif-jp)" }}
            >
              {article.title}
            </h1>

            {/* Divider */}
            <div className="mb-4 h-px bg-gray-200 sm:mb-6" />

            {/* TOC */}
            <TableOfContents />

            {/* Content */}
            <div
              className="prose prose-gray max-w-none prose-headings:text-[var(--color-primary)] prose-a:text-[var(--color-primary-light)] sm:prose-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* CTA inline */}
            <div className="mt-8 rounded-lg border-2 border-[var(--color-cta)]/30 bg-orange-50 p-4 text-center sm:mt-10 sm:p-6">
              <p className="text-sm font-bold text-gray-800 sm:text-base">
                この記事の内容でお困りの方へ
              </p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                弁護士への無料相談で、あなたのケースに合った解決策が見つかります。
              </p>
              <span className="cta-button mt-3 inline-block">
                弁護士に無料相談する
              </span>
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
          <h3>法律の悩みを解決したい方へ</h3>
          <p>お近くの弁護士に無料で相談できる窓口をご案内しています。</p>
          <span className="cta-button">弁護士に相談する</span>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">関連記事</div>
            <div className="sidebar-section-body">
              <ul className="space-y-0">
                {relatedArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="block border-b border-gray-100 py-2.5 text-xs leading-relaxed text-gray-700 transition hover:text-[var(--color-primary)] sm:text-sm"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
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
      </aside>
    </div>
  );
}
