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

const OPTION_KEYS = [
  "site_name",
  "top_about_text",
  "top_regulation_text",
  "top_contact_text",
  "top_contact_x_url",
  "level_cap_guide",
  "level_cap_gm_reward_description",
  "level_cap_process_footnote",
] as const;

const JSON_ARRAY_KEYS = ["level_cap_guide"] as const;

function isJsonArray(value: string): boolean {
  try {
    return Array.isArray(JSON.parse(value));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { data, error } = await supabaseAdmin
    .from("options")
    .select("key, value")
    .in("key", [...OPTION_KEYS]);

  if (error) {
    return errorResponse("データ取得に失敗しました", "INTERNAL_ERROR", 500);
  }

  const options: Record<string, string> = {};
  for (const row of data ?? []) {
    options[row.key] = row.value;
  }

  return NextResponse.json(options);
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return errorResponse("リクエストボディが不正です", "BAD_REQUEST", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse("リクエストボディが不正です", "BAD_REQUEST", 400);
  }

  for (const [key, value] of Object.entries(body)) {
    if (!(OPTION_KEYS as readonly string[]).includes(key)) {
      return errorResponse(`不正なキーです: ${key}`, "BAD_REQUEST", 400);
    }
    if (typeof value !== "string") {
      return errorResponse(`値が文字列ではありません: ${key}`, "BAD_REQUEST", 400);
    }
    if ((JSON_ARRAY_KEYS as readonly string[]).includes(key) && !isJsonArray(value)) {
      return errorResponse(`JSON配列として不正です: ${key}`, "BAD_REQUEST", 400);
    }
  }

  const { error } = await supabaseAdmin
    .from("options")
    .upsert(Object.entries(body).map(([key, value]) => ({ key, value })));

  if (error) {
    return errorResponse("更新に失敗しました", "INTERNAL_ERROR", 500);
  }

  return NextResponse.json({ success: true });
}
