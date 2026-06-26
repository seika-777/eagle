// 認証不要の公開パス。
const PUBLIC_PATHS = ["/login", "/signin", "/reset-password", "/api/auth"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}
