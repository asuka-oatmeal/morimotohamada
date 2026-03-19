import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          暮らしに役立つ法律知識
        </h2>
        <p className="mt-3 text-gray-500">
          離婚・相続・交通事故・労働問題など、身近な法律の疑問をわかりやすく解説
        </p>
      </section>

      {/* Articles */}
      <section>
        <h3 className="mb-6 border-l-4 border-[var(--color-accent)] pl-3 text-lg font-bold text-gray-900">
          最新の記事
        </h3>
        {articles.length === 0 ? (
          <p className="text-gray-500">記事はまだありません。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {/* Category Bar */}
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
      </section>
    </div>
  );
}
