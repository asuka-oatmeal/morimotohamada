import { ImageResponse } from "next/og";
import { getArticleBySlug, getAllArticles, getArticleCategorySlug } from "@/lib/articles";
import { getCategoryByArticleCategory } from "@/lib/categories";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    category: getArticleCategorySlug(article.category),
    slug: article.slug,
  }));
}

const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  divorce: { bg: "#5c4a3a", accent: "#c0764a" },
  inheritance: { bg: "#4a5c3a", accent: "#c0764a" },
  "traffic-accident": { bg: "#5c3a3a", accent: "#c0764a" },
  labor: { bg: "#3a4a5c", accent: "#c0764a" },
  debt: { bg: "#3a5c5c", accent: "#c0764a" },
  "debt-collection": { bg: "#3a5c4a", accent: "#c0764a" },
  "real-estate": { bg: "#4a5c4a", accent: "#c0764a" },
  "net-trouble": { bg: "#5c5c3a", accent: "#c0764a" },
  criminal: { bg: "#4a3a3a", accent: "#c0764a" },
};

export default async function OGImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#5c4a3a", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 48 }}>
        暮らしの法律ガイド
      </div>,
      { ...size }
    );
  }

  const catInfo = getCategoryByArticleCategory(article.category);
  const colors = CATEGORY_COLORS[catInfo?.slug || "divorce"] || CATEGORY_COLORS.divorce;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 50%, ${colors.bg}bb 100%)`,
          position: "relative",
        }}
      >
        {/* Gold accent line at top */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}88, ${colors.accent})`,
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: colors.accent,
                color: "#fff",
                fontSize: "22px",
                fontWeight: 700,
                padding: "8px 24px",
                borderRadius: "6px",
                display: "flex",
              }}
            >
              {article.category}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: article.title.length > 30 ? "44px" : "52px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.4,
              display: "flex",
              maxWidth: "1000px",
            }}
          >
            {article.title}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 80px",
            borderTop: `2px solid ${colors.accent}44`,
          }}
        >
          {/* Site name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              ⚖
            </div>
            <div style={{ color: "#e8e0d4", fontSize: "24px", fontWeight: 700, display: "flex" }}>
              暮らしの法律ガイド
            </div>
            <div style={{ color: "#d9cfbf88", fontSize: "18px", display: "flex", marginLeft: "4px" }}>
              やさしい解説
            </div>
          </div>

          {/* Date */}
          <div style={{ color: "#ffffff88", fontSize: "20px", display: "flex" }}>
            {article.date}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
