import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { validateYutosheetUrl } from "@/const/function/validateYutosheetUrl";
import type { YutosheetJsonType } from "@/const/type/mypage/YutosheetJsonType";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

// マイページ機能の認可は user_meta.role の allowlist（フェイルクローズ）で行う。
const ALLOWED_ROLES: readonly UserRoleType[] = ["general", "admin"];

// プロキシ fetch のリソース制限（設計 S-2）。
const FETCH_TIMEOUT_MS = 8000;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024; // 2MB

// 許可する Content-Type（JSON のみ）。
const ALLOWED_CONTENT_TYPES: readonly string[] = [
  "application/json",
];

type UserMetaRow = {
  role: string | null;
};

// 外部 JSON はスキーマ保証がないため any/unknown を使わず
// Record<string, string | number | boolean | null> として受ける。
type RawJson = Record<string, string | number | boolean | null>;

// エラーレスポンスは { error, code } 固定。upstream 本文・内部詳細は含めない。
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

function upstreamError(): NextResponse {
  return errorResponse("外部データの取得に失敗しました", "UPSTREAM_ERROR", 502);
}

function internalError(): NextResponse {
  return errorResponse("サーバーエラーが発生しました", "INTERNAL_ERROR", 500);
}

// 数値化ヘルパ。number はそのまま、string はカンマ・空白除去後 Number()（NaN は 0）、その他 0。
function toNumber(value: string | number | boolean | null | undefined): number {
  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }
  if (typeof value === "string") {
    const n = Number(value.replace(/[,\s]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

// 多重防御の認可: セッション再検証 + フェイルクローズ allowlist。
async function authorize(request: NextRequest): Promise<boolean> {
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
  if (!user) {
    return false;
  }

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

  return (
    typeof role === "string" &&
    (ALLOWED_ROLES as readonly string[]).includes(role)
  );
}

// ストリームを読みながら累積バイト数が上限を超えたら中断する（S-2 リソース制限）。
// 上限超過時は null を返す（呼び出し側で 502）。
async function readBounded(res: Response): Promise<string | null> {
  const body = res.body;
  if (body === null) {
    return null;
  }
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  let done = false;
  while (!done) {
    const chunk = await reader.read();
    if (chunk.done) {
      done = true;
      break;
    }
    received += chunk.value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(chunk.value, { stream: true });
  }
  text += decoder.decode();
  return text;
}

export async function GET(request: NextRequest) {
  try {
    // 多重防御の認可（middleware に加えて route でも再検証）。
    const allowed = await authorize(request);
    if (!allowed) {
      // 未認証・権限外を区別せず最小情報で拒否する。
      // ここでは getUser 失敗・role 不許可いずれも 403 に集約せず、
      // 認証段階の有無で 401/403 を分けたいが、authorize は boolean のため
      // 多重防御として 401 を返す（middleware が一次防御で 401/403 を出し分け済み）。
      return unauthorized();
    }

    // S-1: ユーザー入力 URL を検証。null なら 400。
    const urlParam = request.nextUrl.searchParams.get("url");
    if (urlParam === null || urlParam === "") {
      return badRequest();
    }
    const validated = validateYutosheetUrl(urlParam);
    if (validated === null) {
      return badRequest();
    }

    // 検証を通った URL に対してのみ、サーバー側で mode=json を付与する。
    // URLSearchParams で安全に付与（ユーザー入力値は使わない）。
    const target = new URL(validated.toString());
    target.searchParams.set("mode", "json");

    // S-2: プロキシ fetch の安全化。
    // redirect:manual でリダイレクト追跡を禁止（内部 IP 到達・DNS リバインディング対策）。
    // ホストは S-1 で yutorize.work 完全一致に限定済み。DNS 解決結果が内部 IP を指す
    // リバインディングに対しては redirect:manual + ホスト固定で一次防御とする多重防御方針。
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(target.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
      });
    } catch {
      // タイムアウト（abort）・ネットワークエラーは upstream エラー扱い。
      return upstreamError();
    } finally {
      clearTimeout(timer);
    }

    // 30x（リダイレクト）は追跡せず 502。
    if (res.status >= 300 && res.status < 400) {
      return upstreamError();
    }
    if (!res.ok) {
      return upstreamError();
    }

    // Content-Type は JSON のみ許可。
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
    const contentTypeAllowed = ALLOWED_CONTENT_TYPES.some((allowedType) =>
      contentType.startsWith(allowedType)
    );
    if (!contentTypeAllowed) {
      return upstreamError();
    }

    // 本文を最大 2MB まで読む（超過で中断 → 502）。
    const text = await readBounded(res);
    if (text === null) {
      return upstreamError();
    }

    // plain JSON をパース（any/unknown 不使用）。
    let raw: RawJson;
    try {
      const parsed = JSON.parse(text) as RawJson;
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return upstreamError();
      }
      raw = parsed;
    } catch {
      return upstreamError();
    }

    // S-3: ホワイトリスト 5 フィールドのみ抽出し数値化して返却する。
    // 生 JSONP 文字列・JSON 全体は返さない。
    const result: YutosheetJsonType = {
      characterName: typeof raw.characterName === "string" ? raw.characterName : "",
      expTotal: toNumber(raw.expTotal),
      historyGrowTotal: toNumber(raw.historyGrowTotal),
      historyMoneyTotal: toNumber(raw.historyMoneyTotal),
      historyHonorTotal: toNumber(raw.historyHonorTotal),
    };

    return NextResponse.json(result);
  } catch {
    return internalError();
  }
}
