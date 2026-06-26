import type { ProxyContext } from "@/lib/proxy/guards/types";

// user_meta から role を取得（anon key・本人 RLS）。
// 取得失敗・例外も含めフェイルクローズで評価するため、文字列または null に正規化する。
export async function fetchUserRole(ctx: ProxyContext): Promise<string | null> {
  if (!ctx.user) return null;
  try {
    const { data } = await ctx.supabase
      .from("user_meta")
      .select("role")
      .eq("id", ctx.user.id)
      .single<{ role: string | null }>();
    return data?.role ?? null;
  } catch {
    return null;
  }
}
