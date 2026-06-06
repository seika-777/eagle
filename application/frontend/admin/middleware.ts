import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const publicPaths = ["/login", "/signin", "/reset-password", "/api/auth"];
  const isPublicPath = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isApiRoute = pathname.startsWith("/api/");

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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (isPublicPath) {
      return response;
    }
    if (isApiRoute) {
      return NextResponse.json({ error: "認証が必要です", code: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { data: userMeta } = await supabase
    .from("user_meta")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userMeta?.role ?? "common";

  if (role !== "admin") {
    if (isApiRoute) {
      return NextResponse.json({ error: "権限がありません", code: "FORBIDDEN" }, { status: 403 });
    }
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
