import { NextResponse } from "next/server";
import type { Guard } from "@/lib/proxy/guards/types";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";
import { fetchUserRole } from "@/lib/proxy/role";

const LOGIN_PATH = "/login";

// allowlist（フェイルクローズ）でロールを検証。許可外は API 403 / それ以外 /login。
export const roleGuard =
  (allowedRoles: readonly UserRoleType[]): Guard =>
  async (ctx) => {
    const role = await fetchUserRole(ctx);
    const allowed =
      typeof role === "string" &&
      (allowedRoles as readonly string[]).includes(role);
    if (!allowed) {
      if (ctx.isApiRoute) {
        return NextResponse.json(
          { error: "権限がありません", code: "FORBIDDEN" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL(LOGIN_PATH, ctx.request.url));
    }
    return null;
  };
