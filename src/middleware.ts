import { NextResponse, NextRequest } from "next/server";

// Slug → category slug mapping for /blog/[slug] → /[category]/[slug] redirect
const ARTICLE_CATEGORY_MAP: Record<string, string> = {
  "child-support-calculation": "divorce",
  "custody-rights-father": "divorce",
  "debt-collection-methods": "debt-collection",
  "debt-settlement-credit-card": "debt",
  "divorce-consolation-money": "divorce",
  "divorce-form-how-to-write": "divorce",
  "divorce-mediation-process": "divorce",
  "divorce-pension-division": "divorce",
  "inheritance-division-agreement": "inheritance",
  "inheritance-renunciation-deadline": "inheritance",
  "joint-custody-2026-overview": "divorce",
  "moral-harassment-divorce": "divorce",
  "property-division-mortgage": "divorce",
  "security-deposit-refund": "real-estate",
  "separation-living-expenses": "divorce",
  "visitation-rights-refusal": "divorce",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin を本番環境でブロック
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  // /blog/[slug] → /[category]/[slug] 301リダイレクト
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const categorySlug = ARTICLE_CATEGORY_MAP[slug] || "divorce";
    const url = request.nextUrl.clone();
    url.pathname = `/${categorySlug}/${slug}`;
    return NextResponse.redirect(url, 301);
  }

  // /category/[slug] → /[slug] 301リダイレクト
  const categoryMatch = pathname.match(/^\/category\/([^/]+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/blog/:path*", "/category/:path*"],
};
