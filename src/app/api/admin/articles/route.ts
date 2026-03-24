import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const keywordsPath = path.join(process.cwd(), "content/keywords.json");
const articlesDir = path.join(process.cwd(), "content/articles");

export async function GET() {
  // Read keywords.json as base
  const keywords = JSON.parse(fs.readFileSync(keywordsPath, "utf8"));

  // Enrich published articles with title/description from markdown
  const enriched = keywords.map(
    (entry: {
      slug: string;
      keyword: string;
      category: string;
      status: string;
      publishedDate?: string;
    }) => {
      const mdPath = path.join(articlesDir, `${entry.slug}.md`);
      if (fs.existsSync(mdPath)) {
        const { data } = matter(fs.readFileSync(mdPath, "utf8"));
        return {
          ...entry,
          title: data.title || "",
          description: data.description || "",
          publishedDate: entry.publishedDate || data.date || "",
        };
      }
      return entry;
    }
  );

  return NextResponse.json(enriched);
}
