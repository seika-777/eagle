import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseProxyClient } from "@/lib/proxy/supabaseProxyClient";
import type { ProxyContext } from "@/lib/proxy/guards/types";

// proxy の各ガードが参照する共通コンテキストを構築する。
export async function buildProxyContext(
  request: NextRequest
): Promise<ProxyContext> {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");
  const supabase = createSupabaseProxyClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { request, response, pathname, isApiRoute, supabase, user };
}
