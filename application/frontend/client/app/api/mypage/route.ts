import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validateYutosheetUrl } from "@/const/function/validateYutosheetUrl";
import { getScheduledRegulations } from "@/const/function/getScheduledRegulations";
import type { UserRegulationSheetType } from "@/const/type/mypage/UserRegulationSheetType";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

// マイページ機能の認可は user_meta.role の allowlist（フェイルクローズ）で行う。
// general / admin に厳密一致した場合のみ許可し、それ以外（common / null / 未知 / 取得失敗 / 例外）は全拒否する。
const ALLOWED_ROLES: readonly UserRoleType[] = ["general", "admin"];

// 入力検証の上限（設計 S-4）。
const MAX_URL_LENGTH = 2048;
const MAX_NOTE_LENGTH = 1000;

type UserMetaRow = {
  role: string | null;
};

// user_regulation_sheets の DB 行（snake_case）。
type UserRegulationSheetRow = {
  id: number;
  user_id: string;
  regulation_id: number;
  yutosheet_url: string;
  note: string;
  updated_at: string | null;
};

// PUT のリクエストボディ。user_id / updated_by はボディから一切受け取らない（S-1）。
type PutBody = {
  regulationId: number;
  yutosheetUrl: string;
  note: string;
};

// エラーレスポンスは { error, code } 固定。内部詳細・スタック・upstream 本文は含めない。
function errorResponse(error: string, code: string, status: number): NextResponse {
  return NextResponse.json({ error, code }, { status });
}

function unauthorized(): NextResponse {
  return errorResponse("認証が必要です", "UNAUTHORIZED", 401);
}

function forbidden(): NextResponse {
  return errorResponse("権限がありません", "FORBIDDEN", 403);
}

function badRequest(): NextResponse {
  return errorResponse("不正なリクエストです", "BAD_REQUEST", 400);
}

function internalError(): NextResponse {
  return errorResponse("サーバーエラーが発生しました", "INTERNAL_ERROR", 500);
}

// snake_case → camelCase 変換（既存データ取得関数のスタイルに準拠）。
function toCamel(row: UserRegulationSheetRow): UserRegulationSheetType {
  return {
    id: Number(row.id),
    userId: String(row.user_id),
    regulationId: Number(row.regulation_id),
    yutosheetUrl: String(row.yutosheet_url),
    note: String(row.note),
    updatedAt: row.updated_at !== null && row.updated_at !== undefined ? String(row.updated_at) : null,
  };
}

// 多重防御の認可: セッション再検証 + フェイルクローズ allowlist。
// 認可成功時は本人の user.id を返す。失敗時は対応するエラーレスポンスを返す。
async function authorize(
  request: NextRequest
): Promise<{ userId: string } | { response: NextResponse }> {
  // anon key + cookie バインドの session client で本人を取得する。
  const response = NextResponse.next();
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未認証 → 401。
  if (!user) {
    return { response: unauthorized() };
  }

  // user_meta（本人 row）から role を取得し、allowlist 厳密一致のみ許可（フェイルクローズ）。
  let role: string | null = null;
  try {
    const { data: userMeta } = await supabase
      .from("user_meta")
      .select("role")
      .eq("id", user.id)
      .single<UserMetaRow>();
    role = userMeta?.role ?? null;
  } catch {
    role = null;
  }

  const allowed =
    typeof role === "string" &&
    (ALLOWED_ROLES as readonly string[]).includes(role);

  if (!allowed) {
    return { response: forbidden() };
  }

  return { userId: user.id };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if ("response" in auth) {
      return auth.response;
    }
    const userId = auth.userId;

    // 本人スコープを必ず付与する（RLS に加えて明示的に user_id 条件を付ける多重防御）。
    const { data, error } = await supabaseAdmin
      .from("user_regulation_sheets")
      .select("id, user_id, regulation_id, yutosheet_url, note, updated_at")
      .eq("user_id", userId)
      .order("regulation_id", { ascending: true });

    if (error) {
      return internalError();
    }

    const rows = (data ?? []) as UserRegulationSheetRow[];
    // getUserRegulationSheet が期待する camelCase 配列で返却する。
    return NextResponse.json(rows.map(toCamel));
  } catch {
    return internalError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if ("response" in auth) {
      return auth.response;
    }
    const userId = auth.userId;

    // CSRF 対策（S-3 / M-4）: Origin ヘッダを自オリジンと照合する。
    // 不一致・欠落は同一オリジンと判断できないため拒否する。
    const origin = request.headers.get("origin");
    if (origin !== request.nextUrl.origin) {
      return forbidden();
    }

    const body = (await request.json()) as Partial<PutBody>;

    // regulationId は整数のみ許可（小数 / NaN / 非数は 400）。
    const regulationId = body.regulationId;
    if (typeof regulationId !== "number" || !Number.isInteger(regulationId)) {
      return badRequest();
    }

    // yutosheetUrl: 空文字は許可（未設定クリア相当）。非空は長さ + S-1 検証。
    const yutosheetUrl = typeof body.yutosheetUrl === "string" ? body.yutosheetUrl : "";
    if (yutosheetUrl.length > MAX_URL_LENGTH) {
      return badRequest();
    }
    if (yutosheetUrl !== "" && validateYutosheetUrl(yutosheetUrl) === null) {
      return badRequest();
    }

    // note: 最大 1000 字。
    const note = typeof body.note === "string" ? body.note : "";
    if (note.length > MAX_NOTE_LENGTH) {
      return badRequest();
    }

    // regulationId が対象集合（level_cap_schedule 登録ありの全レギュレーション = フォームで
    // 一覧表示する対象）に属するか確認する。最新 1 件ではなく対象集合全体で検証する。
    const scheduledRegulations = await getScheduledRegulations();
    const isAllowedRegulation = scheduledRegulations.some(
      (regulation) => regulation.id === regulationId
    );
    if (!isAllowedRegulation) {
      return badRequest();
    }

    // upsert。user_id / updated_by はセッション由来（userId）で固定。ボディ指定は無視（S-1）。
    // ON CONFLICT (user_id, regulation_id) で本人 × レギュレーションを 1 レコードに保つ。
    const { error } = await supabaseAdmin
      .from("user_regulation_sheets")
      .upsert(
        {
          user_id: userId,
          regulation_id: regulationId,
          yutosheet_url: yutosheetUrl,
          note,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,regulation_id" }
      );

    if (error) {
      return internalError();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return internalError();
  }
}
