import type { UserRegulationSheetType } from "@/const/type/mypage/UserRegulationSheetType";

// 本人のゆとシート設定を取得する（設計「DB 操作 / データ取得関数の責務一覧」準拠）。
//
// /api/mypage（GET）を同一オリジンで叩き、本人スコープ（セッション user_id）の
// user_regulation_sheets 相当を受け取る。API は Phase5 で実装。
// API 側で snake_case → camelCase 変換済みの UserRegulationSheetType[] を JSON で返す前提。
// （/api/mypage GET の責務として変換を担う。本関数は受領した camelCase をそのまま使う）。
//
// 非同期は async/await。エラーは throw（画面側で useErrorHandler が処理する）。
const MYPAGE_API_PATH = "/api/mypage";

export const getUserRegulationSheet = async (): Promise<UserRegulationSheetType[]> => {
  const res = await fetch(MYPAGE_API_PATH, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user regulation sheets: ${res.status}`);
  }

  // 外部スキーマ保証のため any/unknown を使わずランタイムチェックしてマッピングする。
  const json: Record<string, string | number | boolean | null>[] = await res.json();
  if (!Array.isArray(json)) {
    throw new Error("Invalid response: expected an array of user regulation sheets");
  }

  return json.map((row) => ({
    id: Number(row.id),
    userId: String(row.userId),
    regulationId: Number(row.regulationId),
    yutosheetUrl: String(row.yutosheetUrl),
    note: String(row.note),
    updatedAt: row.updatedAt !== null && row.updatedAt !== undefined ? String(row.updatedAt) : null,
  }));
};
