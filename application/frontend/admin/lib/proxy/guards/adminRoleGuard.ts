import { NextResponse } from "next/server";
import type { Guard } from "@/lib/proxy/guards/types";
import { fetchUserRole } from "@/lib/proxy/role";

const HOME_PATH = "/";

// authPublicGuard 通過後（認証済み かつ 非公開パス）のみ実質評価。
// admin 以外: API は 403、それ以外は "/"（ただし既に "/" なら許可）。
export const adminRoleGuard: Guard = async (ctx) => {
  if (!ctx.user) {
    return null; // 未認証は authPublicGuard が処理済み（公開パスのみ到達）
  }
  const role = await fetchUserRole(ctx);
  if (role !== "admin") {
    if (ctx.isApiRoute) {
      return NextResponse.json(
        { error: "権限がありません", code: "FORBIDDEN" },
        { status: 403 }
      );
    }
    if (ctx.pathname !== HOME_PATH) {
      return NextResponse.redirect(new URL(HOME_PATH, ctx.request.url));
    }
  }
  return null;
};
