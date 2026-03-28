import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, getArticleCategorySlug } from "@/lib/articles";

const LINE_API_URL = "https://api.line.me/v2/bot/message/broadcast";

interface FlexMessage {
  type: string;
  altText: string;
  contents: Record<string, unknown>;
}

function buildArticleMessage(article: {
  title: string;
  slug: string;
  description: string;
  category: string;
}): FlexMessage {
  return {
    type: "flex",
    altText: `📢 新着記事: ${article.title}`,
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
            text: article.title,
            weight: "bold",
            size: "md",
            wrap: true,
            color: "#3a3530",
          },
          {
            type: "text",
            text: article.description.slice(0, 100) + "...",
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
              uri: `https://morimotohamada.com/${getArticleCategorySlug(article.category)}/${article.slug}`,
            },
            style: "primary",
            color: "#c0764a",
          },
        ],
        paddingAll: "15px",
      },
    },
  };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.ADMIN_PASS;

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "LINE_CHANNEL_ACCESS_TOKEN is not set" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { slug } = body;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const message = buildArticleMessage(article);

  const response = await fetch(LINE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: [message] }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json(
      { error: "LINE API error", details: errorBody },
      { status: response.status }
    );
  }

  return NextResponse.json({ success: true, slug: article.slug });
}

// GET: 最新記事の一覧を返す（配信候補の確認用）
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.ADMIN_PASS;

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = getAllArticles().slice(0, 10);
  return NextResponse.json({ articles });
}
