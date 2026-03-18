import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const articleEntries = articles.map((article) => ({
    url: `https://morimotohamada.com/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://morimotohamada.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articleEntries,
  ];
}
