import { NextResponse } from "next/server";
import type { Guard } from "@/lib/proxy/guards/types";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";
import { fetchUserRole } from "@/lib/proxy/role";

const MYPAGE_PATH = "/mypage";
const ALLOWED_ROLES: readonly UserRoleType[] = ["general", "admin"];

// /login にセッションあり かつ 許可ロール → /mypage。未認証・許可外はそのまま表示。
export const loginRedirectGuard: Guard = async (ctx) => {
  if (!ctx.user) return null;
  const role = await fetchUserRole(ctx);
  const allowed =
    typeof role === "string" &&
    (ALLOWED_ROLES as readonly string[]).includes(role);
  if (allowed) {
    return NextResponse.redirect(new URL(MYPAGE_PATH, ctx.request.url));
  }
  return null;
};
