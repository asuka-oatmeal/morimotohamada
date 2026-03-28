import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LINE_API_URL = "https://api.line.me/v2/bot/message/broadcast";
const SENT_LOG_PATH = path.join(process.cwd(), "content", ".line-sent.json");

function getSentSlugs(): string[] {
  try {
    if (fs.existsSync(SENT_LOG_PATH)) {
      return JSON.parse(fs.readFileSync(SENT_LOG_PATH, "utf8"));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveSentSlugs(slugs: string[]) {
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(slugs, null, 2));
}

interface KeywordEntry {
  slug: string;
  keyword: string;
  category: string;
  status: string;
  publishedDate?: string;
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ sent: 0, message: "LINE token not configured" });
  }

  // Read keywords.json for recently published articles
  const keywordsPath = path.join(process.cwd(), "content", "keywords.json");
  const keywords: KeywordEntry[] = JSON.parse(
    fs.readFileSync(keywordsPath, "utf8")
  );

  const today = new Date().toISOString().split("T")[0];
  const sentSlugs = getSentSlugs();

  // Find articles published today that haven't been sent yet
  const newArticles = keywords.filter(
    (kw) =>
      kw.status === "published" &&
      kw.publishedDate === today &&
      !sentSlugs.includes(kw.slug)
  );

  if (newArticles.length === 0) {
    return NextResponse.json({ sent: 0, message: "No new articles today" });
  }

  // Read article content for descriptions
  const articlesDir = path.join(process.cwd(), "content", "articles");
  const results = [];

  for (const article of newArticles) {
    const mdPath = path.join(articlesDir, `${article.slug}.md`);
    if (!fs.existsSync(mdPath)) continue;

    const content = fs.readFileSync(mdPath, "utf8");
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    const descMatch = content.match(/description:\s*>?\s*\n?\s*(.+)/);
    const title = titleMatch?.[1]?.replace(/['"]/g, "") || article.keyword;
    const description = descMatch?.[1] || "";

    const message = {
      type: "flex",
      altText: `📢 新着記事: ${title}`,
      contents: {
        type: "bubble",
        size: "mega",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📢 新着記事のお知らせ",
              color: "#faf8f5",
              size: "sm",
              weight: "bold",
            },
          ],
          backgroundColor: "#5c4a3a",
          paddingAll: "15px",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: title,
              weight: "bold",
              size: "md",
              wrap: true,
              color: "#3a3530",
            },
            {
              type: "text",
              text: description.slice(0, 100) + (description.length > 100 ? "..." : ""),
              size: "sm",
              color: "#9a8e80",
              wrap: true,
              margin: "md",
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: article.category,
                  size: "xs",
                  color: "#c0764a",
                  weight: "bold",
                },
              ],
              margin: "md",
            },
          ],
          paddingAll: "20px",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "記事を読む",
                uri: `https://morimotohamada.com/blog/${article.slug}`,
              },
              style: "primary",
              color: "#c0764a",
            },
          ],
          paddingAll: "15px",
        },
      },
    };

    const response = await fetch(LINE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages: [message] }),
    });

    if (response.ok) {
      sentSlugs.push(article.slug);
      results.push({ slug: article.slug, status: "sent" });
    } else {
      const errorBody = await response.text();
      results.push({ slug: article.slug, status: "error", error: errorBody });
    }
  }

  saveSentSlugs(sentSlugs);

  return NextResponse.json({ sent: results.filter((r) => r.status === "sent").length, results });
}
