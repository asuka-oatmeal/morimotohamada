export interface Category {
  slug: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { slug: "divorce", label: "離婚・家事" },
  { slug: "inheritance", label: "相続・遺言" },
  { slug: "traffic-accident", label: "交通事故" },
  { slug: "labor", label: "労働問題" },
  { slug: "debt", label: "債務整理" },
  { slug: "debt-collection", label: "債権回収" },
  { slug: "real-estate", label: "不動産・賃貸" },
  { slug: "net-trouble", label: "ネットトラブル" },
  { slug: "criminal", label: "刑事事件" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}

export function getCategoryByArticleCategory(articleCategory: string): Category | undefined {
  // まず完全一致を試す
  const exact = CATEGORIES.find(c => c.label === articleCategory);
  if (exact) return exact;
  // "債権回収・総論" → "債権回収" のように親カテゴリで探す
  const parent = articleCategory.split("・")[0];
  return CATEGORIES.find(c => c.label === parent);
}
