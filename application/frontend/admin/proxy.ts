import type { NextRequest } from "next/server";
import { buildProxyContext } from "@/lib/proxy/context";
import { resolveGuards } from "@/lib/proxy/routeGuards";

export async function proxy(request: NextRequest) {
  const ctx = await buildProxyContext(request);
  for (const guard of resolveGuards(ctx.pathname)) {
    const result = await guard(ctx);
    if (result) {
      return result;
    }
  }
  return ctx.response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
