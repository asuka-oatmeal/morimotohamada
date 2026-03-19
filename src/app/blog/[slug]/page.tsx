import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";

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

  return (
    <article className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">
          トップ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{article.category}</span>
      </nav>

      {/* Meta */}
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-white">
          {article.category}
        </span>
        <time className="text-sm text-gray-400">{article.date}</time>
      </div>

      {/* Title */}
      <h1
        className="mb-8 text-3xl font-bold leading-snug text-gray-900"
        style={{ fontFamily: "var(--font-noto-serif-jp)" }}
      >
        {article.title}
      </h1>

      {/* Divider */}
      <div className="mb-8 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-transparent" />

      {/* Content */}
      <div
        className="prose prose-gray prose-lg max-w-none prose-headings:text-[var(--color-primary)] prose-a:text-[var(--color-primary-light)]"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Back Link */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </article>
  );
}
