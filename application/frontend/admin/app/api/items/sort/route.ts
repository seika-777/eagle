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

const SORTABLE_TABLE_MAP: Record<string, string> = {
  "house-rule": "house_rule_items",
};

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const body = await request.json();
  const { type, orderedIds } = body;

  if (typeof type !== "string" || !SORTABLE_TABLE_MAP[type]) {
    return errorResponse("typeパラメータが不正です", "BAD_REQUEST", 400);
  }

  if (
    !Array.isArray(orderedIds) ||
    orderedIds.length === 0 ||
    orderedIds.some((id) => typeof id !== "number" || !Number.isInteger(id))
  ) {
    return errorResponse("orderedIdsパラメータが不正です", "BAD_REQUEST", 400);
  }

  const table = SORTABLE_TABLE_MAP[type];
  const results = await Promise.all(
    orderedIds.map((id: number, index: number) =>
      supabaseAdmin.from(table).update({ sort_order: index + 1 }).eq("id", id)
    )
  );

  if (results.some((result) => result.error)) {
    return errorResponse("並び替えの保存に失敗しました", "INTERNAL_ERROR", 500);
  }

  return NextResponse.json({ success: true });
}
