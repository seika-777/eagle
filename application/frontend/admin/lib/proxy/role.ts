import type { ProxyContext } from "@/lib/proxy/guards/types";

// user_meta から role を取得。未取得時は "common" 扱い。
export async function fetchUserRole(ctx: ProxyContext): Promise<string> {
  if (!ctx.user) return "common";
  const { data } = await ctx.supabase
    .from("user_meta")
    .select("role")
    .eq("id", ctx.user.id)
    .single<{ role: string | null }>();
  return data?.role ?? "common";
}
