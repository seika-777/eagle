import type { Guard } from "@/lib/proxy/guards/types";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";
import { authGuard } from "@/lib/proxy/guards/authGuard";
import { roleGuard } from "@/lib/proxy/guards/roleGuard";
import { loginRedirectGuard } from "@/lib/proxy/guards/loginRedirectGuard";

const LOGIN_PATH = "/login";
// マイページ機能の認可は user_meta.role の allowlist（フェイルクローズ）。
const MYPAGE_ALLOWED_ROLES: readonly UserRoleType[] = ["general", "admin"];

// パスに応じて適用するガード列を返す。config.matcher と対応させること。
export function resolveGuards(pathname: string): Guard[] {
  if (pathname === LOGIN_PATH) {
    return [loginRedirectGuard];
  }
  return [authGuard, roleGuard(MYPAGE_ALLOWED_ROLES)];
}
