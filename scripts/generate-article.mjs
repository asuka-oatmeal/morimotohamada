import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 法律系SEOキーワードカテゴリ
const TOPICS = [
  {
    category: "離婚・家事",
    keywords: [
      "離婚 慰謝料 相場",
      "養育費 計算方法",
      "離婚調停 流れ",
      "財産分与 住宅ローン",
      "親権 父親",
      "面会交流 拒否",
      "離婚 年金分割",
      "モラハラ 離婚",
      "別居 生活費 請求",
      "離婚届 書き方",
    ],
  },
  {
    category: "相続・遺言",
    keywords: [
      "遺産分割協議書 書き方",
      "相続放棄 期限",
      "遺留分 請求",
      "公正証書遺言 費用",
      "相続税 基礎控除",
      "法定相続人 範囲",
      "相続 借金",
      "遺言書 検認",
      "相続登記 義務化",
      "生前贈与 相続",
    ],
  },
  {
    category: "交通事故",
    keywords: [
      "交通事故 慰謝料 計算",
      "後遺障害 等級認定",
      "過失割合 納得いかない",
      "交通事故 示談 流れ",
      "むちうち 慰謝料",
      "交通事故 弁護士費用特約",
      "休業損害 計算",
      "死亡事故 賠償金",
      "自転車事故 賠償",
      "交通事故 時効",
    ],
  },
  {
    category: "労働問題",
    keywords: [
      "不当解雇 対処法",
      "残業代 請求",
      "パワハラ 相談",
      "退職勧奨 対応",
      "労災 認定基準",
      "有給休暇 拒否",
      "雇い止め 違法",
      "セクハラ 慰謝料",
      "未払い賃金 時効",
      "労働審判 費用",
    ],
  },
  {
    category: "債務整理",
    keywords: [
      "自己破産 条件",
      "任意整理 デメリット",
      "個人再生 住宅ローン",
      "過払い金 請求",
      "借金 時効",
      "債務整理 クレジットカード",
      "自己破産 費用",
      "闇金 対処法",
      "連帯保証人 責任",
      "差し押さえ 回避",
    ],
  },
  {
    category: "不動産・賃貸",
    keywords: [
      "立ち退き 拒否",
      "敷金 返還 請求",
      "騒音トラブル 法的措置",
      "家賃滞納 強制退去",
      "境界トラブル 解決",
      "欠陥住宅 損害賠償",
      "原状回復 ガイドライン",
      "賃貸 更新料 拒否",
      "不動産売買 契約解除",
      "マンション 管理組合 トラブル",
    ],
  },
  {
    category: "刑事事件",
    keywords: [
      "逮捕 流れ",
      "示談 やり方",
      "前科 就職",
      "痴漢 冤罪",
      "窃盗 初犯 量刑",
      "飲酒運転 罰則",
      "傷害罪 慰謝料",
      "名誉毀損 告訴",
      "詐欺 被害届",
      "少年事件 弁護士",
    ],
  },
];

function getRandomTopic() {
  const category = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const keyword =
    category.keywords[Math.floor(Math.random() * category.keywords.length)];
  return { category: category.category, keyword };
}

function generateSlug() {
  const date = new Date().toISOString().split("T")[0];
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${date}-${suffix}`;
}

async function generateArticle() {
  const { category, keyword } = getRandomTopic();
  console.log(`Generating article for: [${category}] ${keyword}`);

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

【出力形式】
以下の形式で出力してください（frontmatterなし、本文のみ）:

TITLE: (記事タイトル)
DESCRIPTION: (meta description)

(本文をマークダウンで)`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse title and description
  const titleMatch = response.match(/TITLE:\s*(.+)/);
  const descMatch = response.match(/DESCRIPTION:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim() : keyword;
  const description = descMatch ? descMatch[1].trim() : "";

  // Extract body (everything after DESCRIPTION line)
  const bodyStart = response.indexOf("\n", response.indexOf("DESCRIPTION:"));
  const body = response.substring(bodyStart).trim();

  const date = new Date().toISOString().split("T")[0];
  const slug = generateSlug();

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
category: "${category}"
---

${body}`;

  const filePath = path.join(
    process.cwd(),
    "content",
    "articles",
    `${slug}.md`
  );
  fs.writeFileSync(filePath, frontmatter);
  console.log(`Article saved: ${filePath}`);
  return slug;
}

// Generate 1 article (can be adjusted)
const count = parseInt(process.env.ARTICLE_COUNT || "1", 10);
for (let i = 0; i < count; i++) {
  await generateArticle();
}
