import { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <div className="mb-6">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {article.category}
        </span>
        <time className="ml-3 text-sm text-gray-500">{article.date}</time>
      </div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        {article.title}
      </h1>
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
