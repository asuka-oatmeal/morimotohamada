import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, getCategoryBySlug, getCategoryByLabel } from "@/lib/categories";
import ArticleEyecatch from "@/app/components/ArticleEyecatch";

type Params = { slug: string };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.label}の記事一覧`,
    description: `${category.label}に関する法律コラムの記事一覧です。`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getAllArticles().filter(
    (a) => a.category === category.label
  );
  const allArticles = getAllArticles();

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-[var(--color-meta)] sm:mb-6 sm:text-sm">
          <Link href="/" className="hover:text-[var(--color-foreground)]">
            ホーム
          </Link>
          <span className="mx-1.5">&gt;</span>
          <span className="text-[var(--color-foreground)]">{category.label}</span>
        </nav>

        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <h1 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary)] sm:text-2xl">
            <span className="inline-block h-6 w-1 rounded bg-[var(--color-primary)]" />
            {category.label}の記事一覧
          </h1>
          <p className="mt-2 text-xs text-[var(--color-meta)] sm:text-sm">
            {category.label}に関する法律の基礎知識をわかりやすく解説した記事の一覧です。
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-[var(--color-meta)]">この分野の記事はまだありません。</p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => {
              const catInfo = getCategoryByLabel(article.category);
              return (
                <article
                  key={article.slug}
                  className="group overflow-hidden rounded-lg border border-[var(--color-sub)] bg-white transition hover:shadow-md"
                >
                  <div className="flex">
                    <ArticleEyecatch
                      categorySlug={catInfo?.slug || slug}
                      categoryLabel={article.category}
                      size="small"
                    />
                    <div className="flex-1 p-3 sm:p-5">
                      <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                        <span className="rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)] sm:text-xs">
                          {article.category}
                        </span>
                        <time className="text-[11px] text-[var(--color-meta)] sm:text-xs">
                          {article.date}
                        </time>
                      </div>
                      <Link href={`/blog/${article.slug}`}>
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
      </div>

      {/* Sidebar */}
      <aside className="w-full shrink-0 space-y-5 lg:w-72">
        <div className="cta-banner">
          <h3>暮らしの法律ガイドをLINEでお届け</h3>
          <p>最新の法改正情報や知っておくべき法律知識を、LINEで定期的にお届けします。友だち追加で今すぐ受け取れます。</p>
          <a href="https://lin.ee/6cJgVjJ" target="_blank" rel="noopener noreferrer" className="cta-button">LINEで友だち追加する</a>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">お悩み別カテゴリ</div>
          <div className="sidebar-section-body">
            <ul className="space-y-0">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center justify-between border-b border-[var(--color-sub)]/50 py-2 text-sm transition hover:text-[var(--color-primary)] ${
                      cat.slug === slug
                        ? "font-bold text-[var(--color-primary)]"
                        : "text-[var(--color-foreground)]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[var(--color-sub)]">&rsaquo;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {allArticles.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">人気の記事</div>
            <div className="sidebar-section-body">
              <ul className="space-y-0">
                {allArticles.slice(0, 5).map((a, i) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="flex gap-2 border-b border-[var(--color-sub)]/50 py-2.5 text-sm text-[var(--color-foreground)] transition hover:text-[var(--color-primary)]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                        {a.title}
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
