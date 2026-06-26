import { NextResponse } from "next/server";
import type { Guard } from "@/lib/proxy/guards/types";

const LOGIN_PATH = "/login";

// 未認証なら API は 401、それ以外は /login へリダイレクト。
export const authGuard: Guard = (ctx) => {
  if (!ctx.user) {
    if (ctx.isApiRoute) {
      return NextResponse.json(
        { error: "認証が必要です", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, ctx.request.url));
  }
  return null;
};
