import type { Guard } from "@/lib/proxy/guards/types";
import { authPublicGuard } from "@/lib/proxy/guards/authPublicGuard";
import { adminRoleGuard } from "@/lib/proxy/guards/adminRoleGuard";

// admin は全パスを matcher 対象とするため、共通のガード列を返す。
// 公開パス判定は各ガード内で行う。
export function resolveGuards(_pathname: string): Guard[] {
  return [authPublicGuard, adminRoleGuard];
}
