"use client";

import { useState, useEffect } from "react";

interface ArticleEntry {
  slug: string;
  keyword: string;
  category: string;
  status: "published" | "pending" | "draft";
  publishedDate?: string;
  title?: string;
  description?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "離婚・家事": "#5c4a3a",
  "相続・遺言": "#4a5c3a",
  "交通事故": "#5c3a3a",
  "労働問題": "#3a4a5c",
  "債務整理": "#3a5c5c",
  "不動産・賃貸": "#5a5c3a",
  "刑事事件": "#4a3a4a",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: "公開中", color: "#4a7c3a" },
  pending: { label: "予定", color: "#9a8e80" },
  draft: { label: "下書き", color: "#c0764a" },
};

export default function AdminPage() {
  const [articles, setArticles] = useState<ArticleEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(articles.map((a) => a.category))].sort();

  const filtered = articles.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    return true;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    pending: articles.filter((a) => a.status === "pending").length,
    draft: articles.filter((a) => a.status === "draft").length,
  };

  const categoryStats = categories.map((cat) => ({
    name: cat,
    total: articles.filter((a) => a.category === cat).length,
    published: articles.filter((a) => a.category === cat && a.status === "published").length,
    pending: articles.filter((a) => a.category === cat && a.status === "pending").length,
  }));

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#9a8e80" }}>
        読み込み中...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#3a3530", marginBottom: 8 }}>
        記事データベース管理
      </h1>
      <p style={{ color: "#9a8e80", fontSize: 14, marginBottom: 32 }}>
        暮らしの法律ガイド — コンテンツ管理
      </p>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "全記事", value: stats.total, color: "#5c4a3a" },
          { label: "公開中", value: stats.published, color: "#4a7c3a" },
          { label: "投稿予定", value: stats.pending, color: "#9a8e80" },
          { label: "下書き", value: stats.draft, color: "#c0764a" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              border: "1px solid #d9cfbf",
              borderRadius: 8,
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#9a8e80", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category Distribution */}
      <div style={{ background: "white", border: "1px solid #d9cfbf", borderRadius: 8, padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#5c4a3a", marginBottom: 16 }}>
          カテゴリ別進捗
        </h2>
        <div style={{ display: "grid", gap: 10 }}>
          {categoryStats.map((cat) => (
            <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 120, fontSize: 13, fontWeight: 600, color: "#3a3530" }}>
                {cat.name}
              </div>
              <div style={{ flex: 1, height: 24, background: "#f5f1eb", borderRadius: 6, overflow: "hidden", display: "flex" }}>
                <div
                  style={{
                    width: `${(cat.published / cat.total) * 100}%`,
                    background: "#4a7c3a",
                    borderRadius: "6px 0 0 6px",
                    transition: "width 0.3s",
                  }}
                />
                <div
                  style={{
                    width: `${(cat.pending / cat.total) * 100}%`,
                    background: "#d9cfbf",
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: "#9a8e80", width: 60, textAlign: "right" }}>
                {cat.published}/{cat.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "全て" },
          { key: "published", label: "公開中" },
          { key: "pending", label: "予定" },
          { key: "draft", label: "下書き" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: filter === f.key ? "2px solid #5c4a3a" : "1px solid #d9cfbf",
              background: filter === f.key ? "#5c4a3a" : "white",
              color: filter === f.key ? "white" : "#5c4a3a",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #d9cfbf",
            fontSize: 13,
            color: "#5c4a3a",
            background: "white",
            marginLeft: "auto",
          }}
        >
          <option value="all">全カテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Article List */}
      <div style={{ background: "white", border: "1px solid #d9cfbf", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5f1eb" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#5c4a3a", fontWeight: 700 }}>ステータス</th>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#5c4a3a", fontWeight: 700 }}>カテゴリ</th>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#5c4a3a", fontWeight: 700 }}>キーワード / タイトル</th>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#5c4a3a", fontWeight: 700 }}>slug</th>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#5c4a3a", fontWeight: 700 }}>公開日</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const statusInfo = STATUS_LABELS[a.status];
              const catColor = CATEGORY_COLORS[a.category] || "#5c4a3a";
              return (
                <tr key={a.slug} style={{ borderTop: "1px solid #e8e0d4" }}>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        color: "white",
                        background: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "white",
                        background: catColor,
                      }}
                    >
                      {a.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#3a3530" }}>
                    {a.title || a.keyword}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#9a8e80", fontFamily: "monospace", fontSize: 12 }}>
                    {a.slug}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#9a8e80" }}>
                    {a.publishedDate || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: "#9a8e80", textAlign: "center" }}>
        {filtered.length} 件表示 / 全 {articles.length} 件
      </p>
    </div>
  );
}
