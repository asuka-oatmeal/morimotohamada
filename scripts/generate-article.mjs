import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 法律系SEOキーワードカテゴリ（英語スラッグ付き）
const TOPICS = [
  {
    category: "離婚・家事",
    keywords: [
      { ja: "離婚 慰謝料 相場", slug: "divorce-consolation-money" },
      { ja: "養育費 計算方法", slug: "child-support-calculation" },
      { ja: "離婚調停 流れ", slug: "divorce-mediation-process" },
      { ja: "財産分与 住宅ローン", slug: "property-division-mortgage" },
      { ja: "親権 父親", slug: "custody-rights-father" },
      { ja: "面会交流 拒否", slug: "visitation-rights-refusal" },
      { ja: "離婚 年金分割", slug: "divorce-pension-division" },
      { ja: "モラハラ 離婚", slug: "moral-harassment-divorce" },
      { ja: "別居 生活費 請求", slug: "separation-living-expenses" },
      { ja: "離婚届 書き方", slug: "divorce-form-how-to-write" },
    ],
  },
  {
    category: "相続・遺言",
    keywords: [
      { ja: "遺産分割協議書 書き方", slug: "inheritance-division-agreement" },
      { ja: "相続放棄 期限", slug: "inheritance-renunciation-deadline" },
      { ja: "遺留分 請求", slug: "legally-reserved-portion-claim" },
      { ja: "公正証書遺言 費用", slug: "notarized-will-cost" },
      { ja: "相続税 基礎控除", slug: "inheritance-tax-deduction" },
      { ja: "法定相続人 範囲", slug: "legal-heirs-scope" },
      { ja: "相続 借金", slug: "inheriting-debt" },
      { ja: "遺言書 検認", slug: "will-probate-verification" },
      { ja: "相続登記 義務化", slug: "inheritance-registration-mandatory" },
      { ja: "生前贈与 相続", slug: "lifetime-gift-inheritance" },
    ],
  },
  {
    category: "交通事故",
    keywords: [
      { ja: "交通事故 慰謝料 計算", slug: "traffic-accident-compensation" },
      { ja: "後遺障害 等級認定", slug: "disability-grade-certification" },
      { ja: "過失割合 納得いかない", slug: "fault-ratio-dispute" },
      { ja: "交通事故 示談 流れ", slug: "traffic-accident-settlement" },
      { ja: "むちうち 慰謝料", slug: "whiplash-compensation" },
      { ja: "交通事故 弁護士費用特約", slug: "lawyer-cost-special-clause" },
      { ja: "休業損害 計算", slug: "lost-income-calculation" },
      { ja: "死亡事故 賠償金", slug: "fatal-accident-damages" },
      { ja: "自転車事故 賠償", slug: "bicycle-accident-liability" },
      { ja: "交通事故 時効", slug: "traffic-accident-statute-of-limitations" },
    ],
  },
  {
    category: "労働問題",
    keywords: [
      { ja: "不当解雇 対処法", slug: "unfair-dismissal-remedies" },
      { ja: "残業代 請求", slug: "overtime-pay-claim" },
      { ja: "パワハラ 相談", slug: "power-harassment-consultation" },
      { ja: "退職勧奨 対応", slug: "voluntary-resignation-pressure" },
      { ja: "労災 認定基準", slug: "workers-comp-criteria" },
      { ja: "有給休暇 拒否", slug: "paid-leave-refusal" },
      { ja: "雇い止め 違法", slug: "illegal-contract-termination" },
      { ja: "セクハラ 慰謝料", slug: "sexual-harassment-compensation" },
      { ja: "未払い賃金 時効", slug: "unpaid-wages-statute-of-limitations" },
      { ja: "労働審判 費用", slug: "labor-tribunal-cost" },
    ],
  },
  {
    category: "債務整理",
    keywords: [
      { ja: "自己破産 条件", slug: "bankruptcy-requirements" },
      { ja: "任意整理 デメリット", slug: "voluntary-debt-settlement-disadvantages" },
      { ja: "個人再生 住宅ローン", slug: "personal-rehabilitation-mortgage" },
      { ja: "過払い金 請求", slug: "overpayment-refund-claim" },
      { ja: "借金 時効", slug: "debt-statute-of-limitations" },
      { ja: "債務整理 クレジットカード", slug: "debt-settlement-credit-card" },
      { ja: "自己破産 費用", slug: "bankruptcy-cost" },
      { ja: "闇金 対処法", slug: "illegal-lending-countermeasures" },
      { ja: "連帯保証人 責任", slug: "joint-guarantor-liability" },
      { ja: "差し押さえ 回避", slug: "asset-seizure-avoidance" },
    ],
  },
  {
    category: "不動産・賃貸",
    keywords: [
      { ja: "立ち退き 拒否", slug: "eviction-refusal" },
      { ja: "敷金 返還 請求", slug: "security-deposit-refund" },
      { ja: "騒音トラブル 法的措置", slug: "noise-complaint-legal-action" },
      { ja: "家賃滞納 強制退去", slug: "rent-arrears-forced-eviction" },
      { ja: "境界トラブル 解決", slug: "property-boundary-dispute" },
      { ja: "欠陥住宅 損害賠償", slug: "defective-housing-damages" },
      { ja: "原状回復 ガイドライン", slug: "restoration-guidelines" },
      { ja: "賃貸 更新料 拒否", slug: "lease-renewal-fee-refusal" },
      { ja: "不動産売買 契約解除", slug: "real-estate-contract-cancellation" },
      { ja: "マンション 管理組合 トラブル", slug: "condo-association-dispute" },
    ],
  },
  {
    category: "刑事事件",
    keywords: [
      { ja: "逮捕 流れ", slug: "arrest-process-explained" },
      { ja: "示談 やり方", slug: "settlement-negotiation-guide" },
      { ja: "前科 就職", slug: "criminal-record-employment" },
      { ja: "痴漢 冤罪", slug: "false-accusation-groping" },
      { ja: "窃盗 初犯 量刑", slug: "theft-first-offense-sentencing" },
      { ja: "飲酒運転 罰則", slug: "drunk-driving-penalties" },
      { ja: "傷害罪 慰謝料", slug: "assault-compensation" },
      { ja: "名誉毀損 告訴", slug: "defamation-prosecution" },
      { ja: "詐欺 被害届", slug: "fraud-police-report" },
      { ja: "少年事件 弁護士", slug: "juvenile-case-lawyer" },
    ],
  },
];

function getRandomTopic() {
  const category = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const keyword =
    category.keywords[Math.floor(Math.random() * category.keywords.length)];
  return { category: category.category, keyword: keyword.ja, slug: keyword.slug };
}

async function generateArticle() {
  const { category, keyword, slug } = getRandomTopic();

  // Check if article with this slug already exists
  const filePath = path.join(process.cwd(), "content", "articles", `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.log(`Article already exists: ${slug}, skipping...`);
    return null;
  }

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

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
category: "${category}"
---

${body}`;

  fs.writeFileSync(filePath, frontmatter);
  console.log(`Article saved: ${filePath}`);
  return slug;
}

// Generate 1 article (can be adjusted)
const count = parseInt(process.env.ARTICLE_COUNT || "1", 10);
for (let i = 0; i < count; i++) {
  await generateArticle();
}
