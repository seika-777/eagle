import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { LOGIN } from "@/const/pages/LOGIN";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

// 内部メールドメイン。admin と共通の user_meta を用いるため admin と同一ドメインを使う。
const INTERNAL_EMAIL_DOMAIN = "eagle-admin.internal";

// ユーザー列挙対策のタイミング平準化用ダミー値。
// user_id 不存在時もこのダミー資格情報で signInWithPassword を実行し、
// Auth 呼び出し相当の処理を通して応答時間差を抑える（必ず失敗するメール）。
const DUMMY_EMAIL = `timing-equalizer@${INTERNAL_EMAIL_DOMAIN}`;
const DUMMY_PASSWORD = "timing-equalizer-dummy-password";

type LoginBody = {
  action: string;
  userId: string;
  password: string;
};

type UserMetaRow = {
  id: string;
  user_id: string;
  role: UserRoleType | null;
};

// ユーザー列挙対策: user_id 不存在・パスワード誤りのいずれも同一の 401 を返す。
function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: LOGIN.TEXT.ERROR_INVALID, code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

// エラー秘匿: 内部エラー詳細・スタックはレスポンスに含めない。
function internalErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: "サーバーエラーが発生しました", code: "INTERNAL_ERROR" },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LoginBody>;
    const action = body.action;

    // action が "login" 以外は 400。
    if (action !== "login") {
      return NextResponse.json(
        { error: "不正なリクエストです", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const userId = typeof body.userId === "string" ? body.userId : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (userId === "" || password === "") {
      return NextResponse.json(
        { error: "不正なリクエストです", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    // user_id → ユーザー解決は supabaseAdmin（Service Role）で行う。
    // 未認証リクエストは anon key では RLS により user_meta を読めないため、必ず Service Role を使う。
    const { data: userMeta, error: metaError } = await supabaseAdmin
      .from("user_meta")
      .select("id, user_id, role")
      .eq("user_id", userId)
      .single<UserMetaRow>();

    // Cookie 反映用のレスポンス。@supabase/ssr が成功時にセッション Cookie を載せる。
    // Cookie 属性（HttpOnly / Secure / SameSite）は @supabase/ssr のデフォルトに従う（S-3）。
    const response = NextResponse.json({ role: userMeta?.role ?? null });

    const supabaseSSR = createServerClient(
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

    // タイミング平準化: user_id 不存在時もダミー資格情報で signInWithPassword を実行し、
    // Auth 呼び出し相当の処理を必ず通すことで応答時間差からのユーザー存在推測を防ぐ（S-4）。
    if (metaError || !userMeta) {
      await supabaseSSR.auth.signInWithPassword({
        email: DUMMY_EMAIL,
        password: DUMMY_PASSWORD,
      });
      return unauthorizedResponse();
    }

    // email を {userId}@eagle-admin.internal で組み立て、セッション Cookie を発行する。
    const email = `${userId}@${INTERNAL_EMAIL_DOMAIN}`;
    const { error: signInError } = await supabaseSSR.auth.signInWithPassword({
      email,
      password,
    });

    // パスワード誤り等のサインイン失敗は user_id 不存在と同一の 401 に統一する。
    if (signInError) {
      return unauthorizedResponse();
    }

    // 成功 → user_meta.role を 200 で返す。
    // role が "common" でもセッションは発行し 200 + role を返す（アクセス制御は middleware と遷移先で行う）。
    return response;
  } catch {
    // 内部エラー詳細・スタックはレスポンスに含めない。
    return internalErrorResponse();
  }
}
