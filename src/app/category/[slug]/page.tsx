import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";

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

  return (
    <div>
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">
          トップ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{category.label}</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        {category.label}の記事一覧
      </h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">この分野の記事はまだありません。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg"
            >
              <div className="bg-[var(--color-primary)] px-4 py-2">
                <span className="text-xs font-medium text-white/90">
                  {article.category}
                </span>
              </div>
              <div className="p-5">
                <time className="text-xs text-gray-400">{article.date}</time>
                <Link href={`/blog/${article.slug}`}>
                  <h4 className="mt-2 font-semibold leading-relaxed text-gray-900 transition group-hover:text-[var(--color-primary-light)]">
                    {article.title}
                  </h4>
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {article.description}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-[var(--color-primary-light)] transition hover:text-[var(--color-primary)]"
                >
                  続きを読む →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
