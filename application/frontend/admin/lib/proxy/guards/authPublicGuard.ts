import { NextResponse } from "next/server";
import type { Guard } from "@/lib/proxy/guards/types";
import { isPublicPath } from "@/lib/proxy/publicPaths";

const LOGIN_PATH = "/login";
const HOME_PATH = "/";

// 未認証: 公開パスは許可、API は 401、それ以外は /login。
// 認証済み かつ 公開パス: "/" へリダイレクト。
export const authPublicGuard: Guard = (ctx) => {
  const isPublic = isPublicPath(ctx.pathname);
  if (!ctx.user) {
    if (isPublic) {
      return null;
    }
    if (ctx.isApiRoute) {
      return NextResponse.json(
        { error: "認証が必要です", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, ctx.request.url));
  }
  if (isPublic) {
    return NextResponse.redirect(new URL(HOME_PATH, ctx.request.url));
  }
  return null;
};
