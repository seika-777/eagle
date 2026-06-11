import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

type ErrorResponse = {
  error: string;
  code: string;
};

const errorResponse = (error: string, code: string, status: number) =>
  NextResponse.json<ErrorResponse>({ error, code }, { status });

async function getAuthenticatedUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userMeta } = await supabaseAdmin
    .from("user_meta")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userMeta?.role !== "admin") return null;
  return user;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { searchParams } = new URL(request.url);
  const belt = searchParams.get("belt");

  if (belt !== "B" && belt !== "C") {
    return errorResponse("beltパラメータが不正です", "BAD_REQUEST", 400);
  }

  const { data, error } = await supabaseAdmin
    .from("level_cap")
    .select("id, level")
    .eq("belt_type", belt)
    .order("sort_order", { ascending: true });

  if (error) return errorResponse("データ取得に失敗しました", "INTERNAL_ERROR", 500);

  return NextResponse.json(data as { id: number; level: string }[]);
}
