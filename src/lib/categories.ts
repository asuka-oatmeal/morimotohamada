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
  { slug: "real-estate", label: "不動産・賃貸" },
  { slug: "criminal", label: "刑事事件" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByLabel(label: string): Category | undefined {
  return CATEGORIES.find((c) => c.label === label);
}
