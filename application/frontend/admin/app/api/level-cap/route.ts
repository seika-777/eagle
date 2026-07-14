import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";
import type { LevelCapRowType } from "@/const/type/levelCap/LevelCapRowType";

type ErrorResponse = {
  error: string;
  code: string;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const INT4_MIN = -2147483648;
const INT4_MAX = 2147483647;

const REQUIRED_INTEGER_KEYS = [
  "min_exp",
  "min_reward",
  "reward_amount",
  "off_balance_reward",
  "honor",
  "growth_count",
  "growth_limit",
  "f_count_limit",
  "reward_limit",
] as const;

const NULLABLE_INTEGER_KEYS = ["min_growth", "min_honor", "distribution", "exp_diff"] as const;

const TEXT_KEYS = ["max_adventurer_rank", "reward_per_session", "sword_fragments", "excess_growth"] as const;

type RequiredIntegerKey = (typeof REQUIRED_INTEGER_KEYS)[number];
type NullableIntegerKey = (typeof NULLABLE_INTEGER_KEYS)[number];
type TextKey = (typeof TEXT_KEYS)[number];

type LevelCapUpdateFields = Partial<Pick<LevelCapRowType, RequiredIntegerKey | NullableIntegerKey | TextKey>>;

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
    .select("*")
    .eq("belt_type", belt)
    .order("sort_order", { ascending: true });

  if (error) return errorResponse("データ取得に失敗しました", "INTERNAL_ERROR", 500);

  return NextResponse.json((data ?? []) as LevelCapRowType[]);
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  let body: JsonValue;
  try {
    body = await request.json();
  } catch {
    return errorResponse("リクエストボディが不正です", "BAD_REQUEST", 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return errorResponse("リクエストボディが不正です", "BAD_REQUEST", 400);
  }

  const items = body.items;
  if (!Array.isArray(items)) {
    return errorResponse("itemsが配列ではありません", "BAD_REQUEST", 400);
  }

  const updates: { id: number; fields: LevelCapUpdateFields }[] = [];

  for (const item of items) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return errorResponse("itemsの要素が不正です", "BAD_REQUEST", 400);
    }

    const id = item.id;
    if (typeof id !== "number" || !Number.isInteger(id) || id < INT4_MIN || id > INT4_MAX) {
      return errorResponse("idが不正です", "BAD_REQUEST", 400);
    }

    const fields: LevelCapUpdateFields = {};

    for (const [key, value] of Object.entries(item)) {
      if (key === "id") continue;
      if ((REQUIRED_INTEGER_KEYS as readonly string[]).includes(key)) {
        if (typeof value !== "number" || !Number.isInteger(value)) {
          return errorResponse(`整数ではありません: ${key}`, "BAD_REQUEST", 400);
        }
        if (value < INT4_MIN || value > INT4_MAX) {
          return errorResponse(`整数の範囲外です: ${key}`, "BAD_REQUEST", 400);
        }
        fields[key as RequiredIntegerKey] = value;
      } else if ((NULLABLE_INTEGER_KEYS as readonly string[]).includes(key)) {
        if (value !== null && (typeof value !== "number" || !Number.isInteger(value))) {
          return errorResponse(`整数またはnullではありません: ${key}`, "BAD_REQUEST", 400);
        }
        if (value !== null && (value < INT4_MIN || value > INT4_MAX)) {
          return errorResponse(`整数の範囲外です: ${key}`, "BAD_REQUEST", 400);
        }
        fields[key as NullableIntegerKey] = value;
      } else if ((TEXT_KEYS as readonly string[]).includes(key)) {
        if (typeof value !== "string") {
          return errorResponse(`値が文字列ではありません: ${key}`, "BAD_REQUEST", 400);
        }
        fields[key as TextKey] = value;
      } else {
        return errorResponse(`不正なキーです: ${key}`, "BAD_REQUEST", 400);
      }
    }

    if (Object.keys(fields).length === 0) {
      return errorResponse("更新対象のカラムがありません", "BAD_REQUEST", 400);
    }

    updates.push({ id, fields });
  }

  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from("level_cap")
      .update(update.fields)
      .eq("id", update.id);

    if (error) {
      return errorResponse(`更新に失敗しました (id: ${update.id})`, "INTERNAL_ERROR", 500);
    }
  }

  return NextResponse.json({ success: true });
}
