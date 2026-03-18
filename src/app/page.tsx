import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">最新の記事</h1>
      {articles.length === 0 ? (
        <p className="text-gray-500">記事はまだありません。</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="rounded-lg border border-gray-200 p-6 transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  {article.category}
                </span>
                <time className="text-sm text-gray-500">{article.date}</time>
              </div>
              <Link href={`/blog/${article.slug}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {article.title}
                </h2>
              </Link>
              <p className="mt-2 text-sm text-gray-600">
                {article.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
