import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const keywordsPath = path.join(process.cwd(), "content", "keywords.json");
const articlesDir = path.join(process.cwd(), "content", "articles");

function loadKeywords() {
  return JSON.parse(fs.readFileSync(keywordsPath, "utf8"));
}

function saveKeywords(keywords) {
  fs.writeFileSync(keywordsPath, JSON.stringify(keywords, null, 2) + "\n");
}

function getNextPendingKeyword(keywords) {
  return keywords.find((kw) => kw.status === "pending") || null;
}

async function generateArticle(entry) {
  const { slug, keyword, category } = entry;
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.log(`Article already exists: ${slug}, skipping...`);
    return false;
  }

  console.log(`Generating: [${category}] ${keyword} → ${slug}`);

  const prompt = `あなたは日本の法律に詳しいSEOライターです。以下のキーワードで、検索上位を狙えるSEO記事を書いてください。

キーワード: 「${keyword}」
カテゴリ: ${category}

【要件】
- タイトルはキーワードを含み、クリックしたくなるもの（30〜40文字程度）
- meta descriptionを120文字程度で作成
- 見出し(h2, h3)を適切に使い、構造化された記事にする
- 本文は2000〜3000文字程度
- 一般の方が理解できるよう平易な言葉で解説
- 具体的な数字や事例を含める
- 最後に「まとめ」セクションを入れる
- マークダウン形式で出力する
- 重要なポイントは箇条書きや表を使って整理する

【出力形式】
以下の形式で出力してください（frontmatterなし、本文のみ）:

TITLE: (記事タイトル)
DESCRIPTION: (meta description)

(本文をマークダウンで)`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  const titleMatch = response.match(/TITLE:\s*(.+)/);
  const descMatch = response.match(/DESCRIPTION:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : keyword;
  const description = descMatch ? descMatch[1].trim() : "";

  const bodyStart = response.indexOf("\n", response.indexOf("DESCRIPTION:"));
  const body = response.substring(bodyStart).trim();

  const date = new Date().toISOString().split("T")[0];

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
category: "${category}"
---

${body}`;

  fs.writeFileSync(filePath, frontmatter);
  console.log(`Saved: ${filePath}`);
  return true;
}

// Main
const count = parseInt(process.env.ARTICLE_COUNT || "1", 10);
const keywords = loadKeywords();

let generated = 0;
for (const entry of keywords) {
  if (generated >= count) break;
  if (entry.status !== "pending") continue;

  const success = await generateArticle(entry);
  if (success) {
    entry.status = "published";
    entry.publishedDate = new Date().toISOString().split("T")[0];
    generated++;
  }
}

saveKeywords(keywords);

// Summary
const total = keywords.length;
const published = keywords.filter((k) => k.status === "published").length;
const pending = keywords.filter((k) => k.status === "pending").length;
console.log(`\n--- Summary ---`);
console.log(`Total: ${total} | Published: ${published} | Pending: ${pending}`);
console.log(`Generated ${generated} article(s) this run.`);
