import { NextResponse } from "next/server";

export function middleware() {
  // 本番環境では /admin を完全ブロック（404を返す）
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  // ローカル開発環境ではそのまま通す
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
