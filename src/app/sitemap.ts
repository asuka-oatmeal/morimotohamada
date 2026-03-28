import { MetadataRoute } from "next";
import { getAllArticles, getArticleCategorySlug } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const articleEntries = articles.map((article) => ({
    url: `https://morimotohamada.com/${getArticleCategorySlug(article.category)}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryEntries = CATEGORIES.map((cat) => ({
    url: `https://morimotohamada.com/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://morimotohamada.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
