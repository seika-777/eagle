import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

// マイページ機能の認可は user_meta.role の allowlist（フェイルクローズ）で行う。
// general / admin に厳密一致した場合のみ許可し、それ以外（common / null / 未知 / 取得失敗 / 例外）は全拒否する。
const ALLOWED_ROLES: readonly UserRoleType[] = ["general", "admin"];

// オープンリダイレクト予防のため、遷移先は内部固定パスのリテラルのみを使用する。
const LOGIN_PATH = "/login";
const MYPAGE_PATH = "/mypage";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");
  const isLoginPath = pathname === LOGIN_PATH;

  // Edge Runtime: anon key 経由でセッション・role を検証する。Service Role Key は使用しない。
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未認証
  if (!user) {
    if (isLoginPath) {
      return response;
    }
    if (isApiRoute) {
      return NextResponse.json(
        { error: "認証が必要です", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // セッションあり → user_meta から role を取得（anon key・本人 RLS）。
  // 取得失敗・例外も含めフェイルクローズで評価するため、role を文字列または null に正規化する。
  let role: string | null = null;
  try {
    const { data: userMeta } = await supabase
      .from("user_meta")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string | null }>();
    role = userMeta?.role ?? null;
  } catch {
    role = null;
  }

  const allowed =
    typeof role === "string" &&
    (ALLOWED_ROLES as readonly string[]).includes(role);

  // /login にセッションあり かつ 許可ロール → /mypage へ
  if (isLoginPath) {
    if (allowed) {
      return NextResponse.redirect(new URL(MYPAGE_PATH, request.url));
    }
    return response;
  }

  // 保護対象（/mypage・client API）でロール許可外 → フェイルクローズ拒否
  if (!allowed) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "権限がありません", code: "FORBIDDEN" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/mypage/:path*",
    "/api/mypage/:path*",
    "/api/yutosheet/:path*",
    "/login",
  ],
};
