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

const TABLE_MAP: Record<string, string> = {
  regulation: "regulation_items",
  god: "god_items",
  school: "school_items",
  race: "race_items",
  "house-rule": "house_rule_items",
  prohibition: "prohibition_items",
  supplement: "supplement_items",
  original: "original_items",
  word: "word_items",
  "stage-term": "stage_term_items",
  "user-role": "user_meta",
};

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const isAlways = searchParams.get("is_always");

  if (!type || !TABLE_MAP[type]) {
    return errorResponse("typeパラメータが不正です", "BAD_REQUEST", 400);
  }

  const table = TABLE_MAP[type];

  if (id) {
    const { data, error } = await supabaseAdmin.from(table).select("*").eq("id", id).single();

    if (error || !data) {
      return errorResponse("データが見つかりません", "BAD_REQUEST", 400);
    }

    if (type === "regulation") {
      const { data: itemRegs } = await supabaseAdmin
        .from("item_regulations")
        .select("item_type, item_id")
        .eq("regulation_id", id);

      const godIds = (itemRegs ?? []).filter((r) => r.item_type === "god").map((r) => r.item_id);
      const schoolIds = (itemRegs ?? []).filter((r) => r.item_type === "school").map((r) => r.item_id);
      const raceIds = (itemRegs ?? []).filter((r) => r.item_type === "race").map((r) => r.item_id);
      const supplementIds = (itemRegs ?? []).filter((r) => r.item_type === "supplement").map((r) => r.item_id);

      return NextResponse.json({ ...data, godIds, schoolIds, raceIds, supplementIds });
    }

    return NextResponse.json(data);
  }

  let query = supabaseAdmin.from(table).select("*");

  if (isAlways === "false" && ["god", "school", "race", "supplement"].includes(type)) {
    query = query.eq("is_always", false) as typeof query;
  }

  if (type === "regulation") {
    query = query.order("id", { ascending: false }) as typeof query;
  } else if (type === "user-role") {
    query = query.order("created_at", { ascending: true }) as typeof query;
  } else {
    query = query.order("id", { ascending: true }) as typeof query;
  }

  if (type === "house-rule") {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*, supplement_items(name)")
      .order("id", { ascending: true });
    if (error) return errorResponse("データ取得に失敗しました", "INTERNAL_ERROR", 500);
    return NextResponse.json(data);
  }

  const { data, error } = await query;
  if (error) return errorResponse("データ取得に失敗しました", "INTERNAL_ERROR", 500);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type || !TABLE_MAP[type]) {
    return errorResponse("typeパラメータが不正です", "BAD_REQUEST", 400);
  }

  const table = TABLE_MAP[type];
  const body = await request.json();
  const now = new Date().toISOString();

  if (type === "regulation") {
    const { godIds, schoolIds, raceIds, supplementIds, ...fields } = body;

    const insertData: Record<string, unknown> = {
      name: fields.name,
      description: fields.description ?? "",
      recruitment: fields.recruitment ?? "",
      stage: fields.stage ?? "",
      race: fields.race ?? "",
      supplement: fields.supplement ?? "",
      notes: fields.notes ?? "",
      level_cap_belt: fields.levelCapBelt,
      publish_type: fields.publishType ?? "draft",
      updated_by: user.id,
      updated_at: now,
    };

    const { data: newReg, error } = await supabaseAdmin
      .from(table)
      .insert(insertData)
      .select()
      .single();

    if (error || !newReg) {
      return errorResponse("作成に失敗しました", "INTERNAL_ERROR", 500);
    }

    await supabaseAdmin.rpc("sync_item_regulations", {
      p_regulation_id: newReg.id,
      p_god_ids: godIds ?? [],
      p_school_ids: schoolIds ?? [],
      p_race_ids: raceIds ?? [],
      p_supplement_ids: supplementIds ?? [],
    });

    return NextResponse.json(newReg, { status: 201 });
  }

  const insertData = buildInsertData(type, body, user.id, now);
  const { data, error } = await supabaseAdmin
    .from(table)
    .insert(insertData)
    .select()
    .single();

  if (error || !data) {
    return errorResponse("作成に失敗しました", "INTERNAL_ERROR", 500);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !TABLE_MAP[type] || !id) {
    return errorResponse("パラメータが不正です", "BAD_REQUEST", 400);
  }

  const table = TABLE_MAP[type];
  const body = await request.json();
  const { updatedAt, ...fields } = body;

  const { data: current, error: fetchError } = await supabaseAdmin
    .from(table)
    .select("updated_at")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    return errorResponse("データが見つかりません", "BAD_REQUEST", 400);
  }

  if (type !== "user-role" && current.updated_at !== updatedAt) {
    return NextResponse.json(
      { error: "他のユーザーにより更新されました。ページを再読み込みしてください。", code: "CONFLICT" },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();

  if (type === "regulation") {
    const { godIds, schoolIds, raceIds, supplementIds, ...regulationFields } = fields;

    const updateData: Record<string, unknown> = {
      name: regulationFields.name,
      description: regulationFields.description ?? "",
      recruitment: regulationFields.recruitment ?? "",
      stage: regulationFields.stage ?? "",
      race: regulationFields.race ?? "",
      supplement: regulationFields.supplement ?? "",
      notes: regulationFields.notes ?? "",
      level_cap_belt: regulationFields.levelCapBelt,
      publish_type: regulationFields.publishType,
      updated_by: user.id,
      updated_at: now,
    };

    const { error } = await supabaseAdmin
      .from(table)
      .update(updateData)
      .eq("id", id);

    if (error) {
      return errorResponse("更新に失敗しました", "INTERNAL_ERROR", 500);
    }

    await supabaseAdmin.rpc("sync_item_regulations", {
      p_regulation_id: Number(id),
      p_god_ids: godIds ?? [],
      p_school_ids: schoolIds ?? [],
      p_race_ids: raceIds ?? [],
      p_supplement_ids: supplementIds ?? [],
    });

    return NextResponse.json({ success: true });
  }

  const updateData = buildInsertData(type, fields, user.id, now);
  const { error } = await supabaseAdmin
    .from(table)
    .update(updateData)
    .eq("id", id);

  if (error) {
    return errorResponse("更新に失敗しました", "INTERNAL_ERROR", 500);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("権限がありません", "FORBIDDEN", 403);

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !TABLE_MAP[type] || !id) {
    return errorResponse("パラメータが不正です", "BAD_REQUEST", 400);
  }

  if (type === "user-role") {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) return errorResponse("削除に失敗しました", "INTERNAL_ERROR", 500);
    return NextResponse.json({ success: true });
  }

  const table = TABLE_MAP[type];
  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);

  if (error) {
    return errorResponse("削除に失敗しました", "INTERNAL_ERROR", 500);
  }

  return NextResponse.json({ success: true });
}

function buildInsertData(
  type: string,
  fields: Record<string, unknown>,
  userId: string,
  now: string
): Record<string, unknown> {
  const base = { updated_by: userId, updated_at: now };

  if (type === "god") {
    return { type: fields.type, name: fields.name, url: fields.url ?? "", is_always: fields.isAlways ?? false, ...base };
  }
  if (type === "school") {
    return { name: fields.name, url: fields.url ?? "", is_always: fields.isAlways ?? false, notes: fields.notes ?? "", ...base };
  }
  if (type === "race") {
    return { name: fields.name, race_type: fields.raceType ?? [], url: fields.url ?? "", is_always: fields.isAlways ?? false, ...base };
  }
  if (type === "house-rule") {
    return { rule_type: fields.ruleType, supplement_id: fields.supplementId ?? null, about: fields.about, description: fields.description, ...base };
  }
  if (type === "prohibition") {
    return { about: fields.about, name: fields.name, ...base };
  }
  if (type === "supplement") {
    return { name: fields.name, is_always: fields.isAlways ?? false, notes: fields.notes ?? "", ...base };
  }
  if (type === "original") {
    return { type: fields.type, name: fields.name, url: fields.url ?? "", ...base };
  }
  if (type === "word") {
    return { title: fields.title, description: fields.description ?? "", ...base };
  }
  if (type === "stage-term") {
    return { title: fields.title, continent: fields.continent ?? "", description: fields.description ?? "", ...base };
  }
  if (type === "user-role") {
    const data: Record<string, unknown> = { updated_at: now };
    if (fields.role !== undefined) data.role = fields.role;
    if (fields.displayName !== undefined) data.display_name = fields.displayName;
    if (fields.isEditable !== undefined) data.is_editable = fields.isEditable;
    return data;
  }
  return { ...fields, ...base };
}
